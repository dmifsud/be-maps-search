import axios from 'axios';
import {
    FuzzySearchResult,
    FuzzySearchOptions,
} from '@tomtom-international/web-sdk-services/dist';
import { getSearchApiUrl } from './apis';

// https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search
/**
 * Get the details of an address from the TomTom Places API
 * @param address The address to search for
 * @param options Options for the request
 * @returns A promise that resolves to a list of addresses
 */
export async function getPlaceAutocomplete(
    address: string,
    options: FuzzySearchOptions
): Promise<FuzzySearchResult[]> {
    const autocomplete = await axios.get(getSearchApiUrl(address), {
        params: options,
    });
    return autocomplete.data?.results ?? [];
}
