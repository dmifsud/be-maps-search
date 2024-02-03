import { config } from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { describe } from '@jest/globals';
import { MapsApiService } from '../src/services/api/maps-api/maps-api.service';
import { randomDelay } from './utils';
import { TomTomApiService } from '../src/services/tomtom/tomtom.service';
config();

const key = process.env.TOMTOM_API_KEY ?? '';

const maltaBasedAddress = 'Triq il-Karmnu';

describe('MapsApiService (Integration)', () => {
    let service: MapsApiService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: MapsApiService,
                    useValue: new MapsApiService(new TomTomApiService()),
                },
                TomTomApiService,
            ],
            exports: [TomTomApiService],
        }).compile();

        service = module.get<MapsApiService>(MapsApiService);
    });

    afterEach(async () => {
        await randomDelay(); // to avoid 429 error
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAutoCompleteDetails', () => {
        it('returns a promise', () => {
            const res = service.getAutoCompleteDetails('Charlotte Street', {
                key,
            });
            expect(res).toBeInstanceOf(Promise);
        });

        it('can fetch from the autocomplete api', async () => {
            const res = await service.getAutoCompleteDetails(
                'Charlotte Street',
                {
                    key,
                }
            );
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
            const res = await service.getAutoCompleteDetails('blkasdlkahsdgl', {
                key,
            });
            expect(res).toStrictEqual([]);
        });

        it('handles error', async () => {
            expect(
                service.getAutoCompleteDetails('', { key })
            ).rejects.toThrow();
        });

        it('handless error with no key', async () => {
            expect(
                service.getAutoCompleteDetails('Charlotte Street', { key: '' })
            ).rejects.toThrow();
        });

        it('does not return results outside of Australia', async () => {
            // even though it should return a Malta based address, it expects an Australian address by default
            const res = await service.getAutoCompleteDetails(
                maltaBasedAddress,
                {
                    key,
                }
            );
            expect(res[0]?.countryCode).toBe('AU');
        });

        describe('getAutoCompleteDetails with limit options', () => {
            it('returns a limited number of results', async () => {
                const res = await service.getAutoCompleteDetails(
                    'Charlotte Street',
                    {
                        key,
                        limit: 1,
                    }
                );
                expect(res.length).toBe(1);
            });

            it('returns a default number of results', async () => {
                const res = await service.getAutoCompleteDetails(
                    'Charlotte Street',
                    {
                        key,
                    }
                );
                expect(res.length).toBe(100);
            });
        });
    });
});
