const API_ROOT: string = 'https://api.tomtom.com/';

const API_SEARCH: string = `${API_ROOT}search/2/search/`;

export const getSearchApiUrl = (address: string): string =>
    `${API_SEARCH}${encodeURIComponent(address)}.json'`;

// `https://api.tomtom.com/search/2/search/${encodeURIComponent(address)}.json'`
