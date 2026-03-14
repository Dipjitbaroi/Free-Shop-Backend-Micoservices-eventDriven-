import { UserProfile, Address, Gender, AddressType } from '../../generated/prisma';
import { NotFoundError, BadRequestError } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma';
import { 
  cacheGet, 
  cacheSet, 
  cacheDelete,
  profileCacheKey,
  addressesCacheKey,
} from '../lib/redis';
import config from '../config';

interface ProfileData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: Gender;
}

interface AddressData {
  label?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  district?: string;
  division?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  type?: AddressType;
}

class UserService {
  // Profile methods
  async getProfile(userId: string, email?: string): Promise<UserProfile> {
    const cached = await cacheGet<UserProfile>(profileCacheKey(userId));
    if (cached) return cached;

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        email: email ?? undefined,
      },
      update: {},
      include: {
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });

    await cacheSet(profileCacheKey(userId), profile, config.cache.profileTTL);

    return profile;
  }

  async createProfile(userId: string, data: ProfileData): Promise<UserProfile> {
    const profile = await prisma.userProfile.create({
      data: {
        userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatar: data.avatar,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
      },
    });

    await cacheSet(profileCacheKey(userId), profile, config.cache.profileTTL);

    return profile;
  }

  async updateProfile(userId: string, data: ProfileData): Promise<UserProfile> {
    let profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create profile if doesn't exist
      profile = await this.createProfile(userId, data);
    } else {
      profile = await prisma.userProfile.update({
        where: { userId },
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          avatar: data.avatar,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          gender: data.gender,
        },
      });
    }

    await cacheDelete(profileCacheKey(userId));

    return profile;
  }

  // Address methods
  async getAddresses(userId: string): Promise<Address[]> {
    const cached = await cacheGet<Address[]>(addressesCacheKey(userId));
    if (cached) return cached;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { addresses: { orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] } },
    });

    const addresses = profile?.addresses || [];
    await cacheSet(addressesCacheKey(userId), addresses, config.cache.profileTTL);

    return addresses;
  }

  async addAddress(userId: string, data: AddressData): Promise<Address> {
    let profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: { userId },
      });
    }

    // Enforce address limit
    const existingCount = await prisma.address.count({ where: { userProfileId: profile.id } });
    if (existingCount >= 3) {
      throw new BadRequestError('You can save a maximum of 3 addresses');
    }

    // If this is the first address or set as default, update others
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userProfileId: profile.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userProfileId: profile.id,
        label: data.label,
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        district: data.district ?? data.state ?? '',
        division: data.division ?? '',
        postalCode: data.postalCode ?? '',
        country: data.country || 'Bangladesh',
        isDefault: data.isDefault || false,
        type: data.type || AddressType.SHIPPING,
      },
    });

    await cacheDelete(addressesCacheKey(userId));

    return address;
  }

  async updateAddress(userId: string, addressId: string, data: Partial<AddressData>): Promise<Address> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { addresses: true },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const address = profile.addresses.find((a: Address) => a.id === addressId);
    if (!address) {
      throw new NotFoundError('Address not found');
    }

    // If setting as default, update others
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userProfileId: profile.id,
          id: { not: addressId },
        },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: {
        label: data.label,
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        district: data.district ?? data.state,
        division: data.division,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: data.isDefault,
        type: data.type,
      },
    });

    await cacheDelete(addressesCacheKey(userId));

    return updated;
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { addresses: true },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const address = profile.addresses.find((a: Address) => a.id === addressId);
    if (!address) {
      throw new NotFoundError('Address not found');
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default, set another as default
    if (address.isDefault && profile.addresses.length > 1) {
      const anotherAddress = profile.addresses.find((a: Address) => a.id !== addressId);
      if (anotherAddress) {
        await prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    await cacheDelete(addressesCacheKey(userId));
  }

  async getAddressById(userId: string, addressId: string): Promise<Address> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { addresses: true },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const address = profile.addresses.find((a: Address) => a.id === addressId);
    if (!address) {
      throw new NotFoundError('Address not found');
    }

    return address;
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<Address> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { addresses: true },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const address = profile.addresses.find((a: Address) => a.id === addressId);
    if (!address) {
      throw new NotFoundError('Address not found');
    }

    // Update all addresses to not default
    await prisma.address.updateMany({
      where: { userProfileId: profile.id },
      data: { isDefault: false },
    });

    // Set the selected one as default
    const updated = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    await cacheDelete(addressesCacheKey(userId));

    return updated;
  }
}

export const userService = new UserService();
