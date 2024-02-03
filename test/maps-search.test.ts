import { config } from 'dotenv';
import { describe } from '@jest/globals';
import { getPlaceAutocomplete } from '../src/services/maps/maps-api';
import { getAutoCompleteDetails } from '../src';

config();

const key = process.env.TOMTOM_API_KEY ?? '';

// Test data
const maltaBasedAddress = 'Triq il-Karmnu';

// These are end-to-end tests and need an api key
describe('Tomtom Places E2E Tests', () => {
    describe('getAutoCompleteDetails', () => {
        it('returns a promise', () => {
            const res = getAutoCompleteDetails('Charlotte Street', { key });
            expect(res).toBeInstanceOf(Promise);
        });

        it('can fetch from the autocomplete api', async () => {
            const res = await getAutoCompleteDetails('Charlotte Street', {
                key,
            });
            const firstRes = res[0];

            expect(firstRes).toBeDefined();
            expect(firstRes).toHaveProperty('placeId');
            expect(firstRes).toHaveProperty('streetNumber');
            expect(firstRes).toHaveProperty('countryCode');
            expect(firstRes).toHaveProperty('country');
            expect(firstRes).toHaveProperty('freeformAddress');
            expect(firstRes).toHaveProperty('municipality');
        });

        it('handles no results', async () => {
            const res = await getAutoCompleteDetails('blkasdlkahsdgl', { key });
            expect(res).toStrictEqual([]);
        });

        it('handles error', async () => {
            expect(getAutoCompleteDetails('', { key })).rejects.toThrow();
        });

        it('handless error with no key', async () => {
            expect(
                getAutoCompleteDetails('Charlotte Street', { key: '' })
            ).rejects.toThrow();
        });

        it('does not return results outside of Australia', async () => {
            // even though it should return a Malta based address, it expects an Australian address by default
            const res = await getAutoCompleteDetails(maltaBasedAddress, {
                key,
            });
            expect(res[0]?.countryCode).toBe('AU');
        });

        describe('getAutoCompleteDetails with limit options', () => {
            it('returns a limited number of results', async () => {
                const res = await getAutoCompleteDetails('Charlotte Street', {
                    key,
                    limit: 1,
                });
                expect(res.length).toBe(1);
            });

            it('returns a default number of results', async () => {
                const res = await getAutoCompleteDetails('Charlotte Street', {
                    key,
                });
                expect(res.length).toBe(100);
            });
        });
    });

    describe('getPlaceAutocomplete', () => {
        it('handles no results', async () => {
            const res = await getPlaceAutocomplete('blkasdlkahsdgl', { key });
            expect(res).toStrictEqual([]);
        });

        it('handles error', async () => {
            expect(getPlaceAutocomplete('', { key })).rejects.toThrow();
        });

        it('returns a list of results', async () => {
            const res = await getPlaceAutocomplete('Charlotte Street', { key });
            expect(res).toBeDefined();
            expect(res.length).toBeGreaterThan(0);
        });

        describe('getPlaceAutocomplete with different countrySet against same address', () => {
            it('returns Australia based address when countrySet is set to "AU"', async () => {
                const res = await getPlaceAutocomplete(maltaBasedAddress, {
                    key,
                    countrySet: 'AU', // This is the default currently used in the getAutoCompleteDetails function
                });
                expect(res[0]?.address?.countryCode).toBe('AU');
            });

            it('returns Malta address when countrySet is set to "AU"', async () => {
                const res = await getPlaceAutocomplete(maltaBasedAddress, {
                    key,
                    countrySet: 'MT',
                });
                expect(res[0]?.address?.countryCode).toBe('MT');
            });

            it('return Malta address when countrySet is left empty', async () => {
                const res = await getPlaceAutocomplete(maltaBasedAddress, {
                    key,
                });
                expect(res[0]?.address?.countryCode).toBe('MT');
            });
        });
    });
});
