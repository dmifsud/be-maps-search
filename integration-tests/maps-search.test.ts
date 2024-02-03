import { config } from 'dotenv';
import { describe } from '@jest/globals';
import { randomDelay } from './utils';
import { TestingModule, Test } from '@nestjs/testing';
import { TomTomApiService } from '../src/services/tomtom/tomtom.service';
import { MapsModule } from '../src/maps.module';

config();

const key = process.env.TOMTOM_API_KEY ?? '';

const maltaBasedAddress = 'Triq il-Karmnu';

// These are end-to-end tests and need an api key
describe('Tomtom Places E2E Tests', () => {
    afterEach(() => randomDelay()); // to avoid 429 error

    let service: TomTomApiService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TomTomApiService],
        }).compile();

        service = module.get<TomTomApiService>(TomTomApiService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getPlaceAutocomplete', () => {
        it('handles no results', async () => {
            const res = await service.getPlaceAutocomplete('blkasdlkahsdgl', {
                key,
            });
            expect(res).toStrictEqual([]);
        });

        it('handles error', async () => {
            expect(service.getPlaceAutocomplete('', { key })).rejects.toThrow();
        });

        it('returns a list of results', async () => {
            const res = await service.getPlaceAutocomplete('Charlotte Street', {
                key,
            });
            expect(res).toBeDefined();
            expect(res.length).toBeGreaterThan(0);
        });

        describe('getPlaceAutocomplete with different countrySet against same address', () => {
            it('returns Australia based address when countrySet is set to "AU"', async () => {
                const res = await service.getPlaceAutocomplete(
                    maltaBasedAddress,
                    {
                        key,
                        countrySet: 'AU', // This is the default currently used in the getAutoCompleteDetails function
                    }
                );
                expect(res[0]?.address?.countryCode).toBe('AU');
            });

            it('returns Malta address when countrySet is set to "AU"', async () => {
                const res = await service.getPlaceAutocomplete(
                    maltaBasedAddress,
                    {
                        key,
                        countrySet: 'MT',
                    }
                );
                expect(res[0]?.address?.countryCode).toBe('MT');
            });

            it('return Malta address when countrySet is left empty', async () => {
                const res = await service.getPlaceAutocomplete(
                    maltaBasedAddress,
                    {
                        key,
                    }
                );
                expect(res[0]?.address?.countryCode).toBe('MT');
            });
        });
    });
});
