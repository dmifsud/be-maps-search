import { TomTomApiService } from './tomtom.service';
import { TestingModule, Test } from '@nestjs/testing';

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
});
