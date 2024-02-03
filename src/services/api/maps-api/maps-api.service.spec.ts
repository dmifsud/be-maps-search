import { TestingModule, Test } from '@nestjs/testing';
import { MapsApiService } from './maps-api.service';
import { TomTomApiService } from '../../tomtom/tomtom.service';
import exp from 'constants';

describe('MapsApiService (Unit)', () => {
    let service: MapsApiService;
    let spy: jest.SpyInstance;
    let mockTomtomApiService: TomTomApiService;

    const mockId = 'mockId';
    const mockAddress = {
        freeformAddress: 'mock freeformAddress',
        country: 'mock country',
        countryCode: 'mock countryCode',
        streetName: 'mock streetName',
        streetNumber: 'mock streetNumber',
        municipality: 'mock municipality',
        municipalitySubdivision: 'mock municipalitySubdivision',
        countrySubdivision: 'mock countrySubdivision',
        countryCodeISO3: 'mock countryCodeISO3',
        countrySecondarySubdivision: 'mock countrySecondarySubdivision',
        countrySubdivisionName: 'mock countrysubdivisionName',
        countryTertiarySubdivision: 'mock countryTertiarySubdivision',
        extendedPostalCode: 'mock extendedPostalCode',
        localName: 'mock localName',
        postalCode: 'mock postalCode',
    };

    beforeEach(async () => {
        mockTomtomApiService = new TomTomApiService();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: MapsApiService,
                    useValue: new MapsApiService(mockTomtomApiService),
                },
                {
                    provide: TomTomApiService,
                    useValue: mockTomtomApiService,
                },
            ],
        }).compile();

        spy = jest
            .spyOn(mockTomtomApiService, 'getPlaceAutocomplete')
            .mockResolvedValue([
                {
                    id: mockId,
                    address: mockAddress,
                },
            ]);
        service = module.get<MapsApiService>(MapsApiService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call tomtom getPlaceautocomplete with expected options', async () => {
        const mockAddress = 'mock address';
        await service.getAutoCompleteDetails(mockAddress, {
            key: 'key',
        });
        expect(spy).toHaveBeenCalledWith(mockAddress, {
            key: 'key',
            limit: 100,
            countrySet: 'AU',
        });
    });

    it('should call tomtom getPlaceautocomplete with expected limit', async () => {
        const mockAddress = 'mock address';
        await service.getAutoCompleteDetails(mockAddress, {
            key: 'key',
            limit: 10,
        });
        expect(spy).toHaveBeenCalledWith(mockAddress, {
            key: 'key',
            limit: 10,
            countrySet: 'AU',
        });
    });

    it('should expect to return a mapped result', async () => {
        const res = await service.getAutoCompleteDetails('mock address', {
            key: 'key',
        });
        expect(res).toStrictEqual([
            {
                placeId: mockId,
                ...mockAddress,
            },
        ]);
    });
});
