export interface AddressResponse {
    placeId?: string;
    streetNumber?: string;
    streetName?: string;
    municipalitySubdivision?: string;
    municipality?: string;
    countrySecondarySubdivision?: string;
    countryTertiarySubdivision?: string;
    countrySubdivision?: string;
    postalCode?: string;
    extendedPostalCode?: string;
    countryCode?: string;
    country?: string;
    countryCodeISO3?: string;
    freeformAddress?: string;
    countrySubdivisionName?: string;
    localName?: string;
}

export interface AutoCompleteRequestOptions {
    key: string;
    limit?: number;
}
