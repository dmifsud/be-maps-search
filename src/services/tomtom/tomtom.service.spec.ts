import axios from 'axios';
import { TomTomApiService } from './tomtom.service';
import { TestingModule, Test } from '@nestjs/testing';
import { getSearchApiUrl } from './apis';

describe('TomTomApiService (Unit)', () => {
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

    it('should call axios.get', async () => {
        const mockGet = jest.spyOn(axios, 'get');
        const mockAddress = 'This is a mock address';
        const mockResult = ['mock default item'];
        mockGet.mockImplementation((url) => {
            return Promise.resolve({
                data: { results: mockResult },
            });
        });

        const result = await service.getPlaceAutocomplete(mockAddress, {
            key: 'mockKey',
        });

        expect(mockGet).toHaveBeenCalledWith(getSearchApiUrl(mockAddress), {
            params: { key: 'mockKey' },
        });

        expect(result).toStrictEqual(mockResult);
    });
});
