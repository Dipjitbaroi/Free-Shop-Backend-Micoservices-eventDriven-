import { BadRequestError, NotFoundError } from '@freeshop/shared-utils';
import config from '../config/index.js';

export interface AddressSnapshot {
  fullName: string;
  phone: string;
  addressLine: string;
  district: string;
  upazila?: string;
  postalCode?: string;
  country: string;
  zoneId?: string;
}

/**
 * Fetch a single saved address from the user-service by its ID.
 * Forwards the caller's Authorization header so the user-service can
 * authenticate the request and confirm ownership of the address.
 */
export async function fetchAddressById(
  addressId: string,
  authorizationHeader: string,
): Promise<AddressSnapshot> {
  const url = `${config.userServiceUrl}/addresses/${addressId}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: authorizationHeader },
    });
  } catch (err) {
    throw new Error(`Could not reach user-service: ${(err as Error).message}`);
  }

  if (response.status === 404) {
    throw new NotFoundError(`Address ${addressId} not found`);
  }

  if (response.status === 401 || response.status === 403) {
    throw new BadRequestError('Not authorised to use this address');
  }

  if (!response.ok) {
    throw new Error(`User-service returned ${response.status} for address ${addressId}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = (await response.json()) as any;
  const a = body?.data ?? body;

  // Prefer an explicit zoneId from user-service, then legacy zone fields, then district
  const zone = a.zoneId ?? a.zone ?? a.district ?? undefined;

  return {
    fullName: a.fullName,
    phone: a.phone,
    addressLine: a.addressLine,
    district: a.district ?? '',
    upazila: a.upazila ?? undefined,
    postalCode: a.postalCode ?? undefined,
    country: a.country ?? 'Bangladesh',
    zoneId: zone ? String(zone) : undefined,
  };
}
