import { getPlaceAutocomplete } from './services/maps/maps-api';
import { AddressResponse, AutoCompleteRequestOptions } from './dtos';

/**
 * Get the details of an address from the TomTom Places API
 * @param address The address to search for
 * @param options Options for the request
 * @returns A promise that resolves to a list of addresses
 */
export async function getAutoCompleteDetails(
    address: string,
    options: AutoCompleteRequestOptions
): Promise<AddressResponse[]> {
    const { key, limit } = options;

    const results = await getPlaceAutocomplete(address, {
        key,
        limit: limit ?? 100,
        countrySet: 'AU',
    });

    return results.map((location) => ({
        placeId: location.id,
        streetNumber: location.address?.streetNumber,
        streetName: location.address?.streetName,
        municipalitySubdivision: location.address?.municipalitySubdivision,
        municipality: location.address?.municipality,
        countrySecondarySubdivision:
            location.address?.countrySecondarySubdivision,
        countryTertiarySubdivision:
            location.address?.countryTertiarySubdivision,
        countrySubdivision: location.address?.countrySubdivision,
        postalCode: location.address?.postalCode,
        extendedPostalCode: location.address?.extendedPostalCode,
        countryCode: location.address?.countryCode,
        country: location.address?.country,
        countryCodeISO3: location.address?.countryCodeISO3,
        freeformAddress: location.address?.freeformAddress,
        countrySubdivisionName: location.address?.countrySubdivisionName,
        localName: location.address?.localName,
    }));
}
