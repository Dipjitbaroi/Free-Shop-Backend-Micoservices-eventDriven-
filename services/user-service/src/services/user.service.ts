import { UserProfile, Address, Gender, AddressType } from '../../generated/client/client.js';
import { NotFoundError, BadRequestError, isValidUUID } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { 
  cacheGet, 
  cacheSet, 
  cacheDelete,
  profileCacheKey,
  addressesCacheKey,
} from '../lib/redis.js';
import config from '../config/index.js';
import axios from 'axios';

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
  // Single detailed address line used by local e-commerce (house/road/flat)
  addressLine: string;
  // Proper Bangladesh address fields (kept minimal following local patterns)
  area?: string; // specific area or neighborhood
  district: string; // required
  upazila?: string; // upazila/thana
  postalCode?: string;
  country?: string;
  zoneId: string; // required canonical zone reference (delivery charge lookup)
  isDefault?: boolean;
  type?: AddressType;
}

class UserService {
  // Public profile methods (no auth required)
  private async fetchAuthServiceUserData(userId: string): Promise<{ firstName?: string; lastName?: string; email?: string; avatar?: string; phone?: string } | null> {
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
      const serviceToken = process.env.SERVICE_AUTH_TOKEN;

      if (!serviceToken) {
        return null;
      }

      const response = await axios.get(
        `${authServiceUrl}/internal/users/${userId}`,
        {
          timeout: 5000,
          headers: {
            'Authorization': `Bearer ${serviceToken}`,
            'X-Service-Call': 'true',
          },
        }
      );

      const user = response.data?.data || null;
      if (user) {
        return {
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          email: user.email || undefined,
          avatar: user.avatar || undefined,
          phone: user.phone || undefined,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getUserById(userId: string): Promise<UserProfile> {
    const cached = await cacheGet<UserProfile>(profileCacheKey(userId));
    if (cached) return cached;

    let profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!profile) {
      throw new NotFoundError('User profile not found');
    }

    // If firstName or lastName are null, try to fetch from auth-service
    if (!profile.firstName || !profile.lastName) {
      const authData = await this.fetchAuthServiceUserData(userId);
      if (authData && (authData.firstName || authData.lastName)) {
        // Update the profile with data from auth-service
        profile = await prisma.userProfile.update({
          where: { userId },
          data: {
            firstName: authData.firstName || profile.firstName,
            lastName: authData.lastName || profile.lastName,
            email: authData.email || profile.email,
            avatar: authData.avatar || profile.avatar,
            phone: authData.phone || profile.phone,
          },
          include: {
            addresses: {
              orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
            },
          },
        });
      }
    }

    await cacheSet(profileCacheKey(userId), profile, config.cache.profileTTL);

    return profile;
  }

  async getPublicProfile(userId: string): Promise<{ id: string; firstName?: string | null; lastName?: string | null; email?: string | null; avatar?: string | null }> {
    let profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
    });

    if (!profile) {
      throw new NotFoundError('User profile not found');
    }

    // If firstName or lastName are null, try to fetch from auth-service
    if (!profile.firstName || !profile.lastName) {
      const authData = await this.fetchAuthServiceUserData(userId);
      if (authData && (authData.firstName || authData.lastName)) {
        profile = {
          userId: profile.userId,
          firstName: authData.firstName || profile.firstName,
          lastName: authData.lastName || profile.lastName,
          email: authData.email || profile.email,
          avatar: authData.avatar || profile.avatar,
        };
        // Update the profile in database so we don't need to fetch from auth-service next time
        await prisma.userProfile.update({
          where: { userId },
          data: {
            firstName: authData.firstName || undefined,
            lastName: authData.lastName || undefined,
            email: authData.email || undefined,
            avatar: authData.avatar || undefined,
          },
        }).catch(() => {
          // Ignore update errors - the profile is already loaded
        });
      }
    }

    return {
      id: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      avatar: profile.avatar,
    };
  }

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

    // Validate required Bangladesh fields
    if (!data.district) throw new BadRequestError('`district` is required');
    if (!data.zoneId) throw new BadRequestError('`zoneId` is required');
    // Validate zoneId is a valid UUID format
    if (!isValidUUID(data.zoneId)) {
      throw new BadRequestError('`zoneId` must be a valid UUID format');
    }

    const address = await prisma.address.create({
      // Cast to any because generated client input types differ across builds/environments
      data: {
        userProfileId: profile.id,
        label: data.label,
        fullName: data.fullName,
        phone: data.phone,
        addressLine: data.addressLine,
        area: data.area ?? undefined,
        district: data.district,
        upazila: data.upazila ?? undefined,
        postalCode: data.postalCode ?? undefined,
        country: data.country || 'Bangladesh',
        zoneId: data.zoneId,
        isDefault: data.isDefault || false,
        type: data.type || AddressType.SHIPPING,
      } as any,
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

    // For update: only set fields provided. Do not null out required fields.
    const updateData: any = {
      label: data.label,
      fullName: data.fullName,
      phone: data.phone,
      addressLine: data.addressLine ?? undefined,
      area: data.area ?? undefined,
      district: data.district ?? undefined,
      upazila: data.upazila ?? undefined,
      postalCode: data.postalCode ?? undefined,
      country: data.country ?? undefined,
      isDefault: data.isDefault,
      type: data.type,
    };

    // Validate zoneId if being updated
    if ((data as any).zoneId) {
      if (!isValidUUID((data as any).zoneId)) {
        throw new BadRequestError('`zoneId` must be a valid UUID format');
      }
      updateData.zoneId = (data as any).zoneId;
    }

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: updateData as any,
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
