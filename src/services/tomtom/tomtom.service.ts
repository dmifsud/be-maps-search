import { Injectable, Inject } from '@nestjs/common';
import {
    FuzzySearchOptions,
    FuzzySearchResult,
} from '@tomtom-international/web-sdk-services';
import axios from 'axios';
import { getSearchApiUrl } from './apis';

@Injectable()
export class TomTomApiService {
    async getPlaceAutocomplete(
        address: string,
        options: FuzzySearchOptions
    ): Promise<FuzzySearchResult[]> {
        const autocomplete = await axios.get(getSearchApiUrl(address), {
            params: options,
        });
        return autocomplete.data?.results ?? [];
    }
}
