import { BadRequestError, NotFoundError } from '@freeshop/shared-utils';
import config from '../config';

export interface AddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;    // mapped from district
  division?: string;
  postalCode: string;
  country: string;
  zone?: string;
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

  // Prefer an explicit 'zone' property from user-service, fall back to district/state
  const zone = a.zone ?? a.zoneName ?? a.district ?? a.state ?? undefined;

  return {
    fullName: a.fullName,
    phone: a.phone,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2 ?? undefined,
    city: a.city,
    state: a.district ?? a.state ?? '',
    division: a.division ?? undefined,
    postalCode: a.postalCode ?? '',
    country: a.country ?? 'Bangladesh',
    zone: zone ? String(zone) : undefined,
  };
}
