import { Module } from '@nestjs/common';
import { MapsApiService } from './services/api/maps-api/maps-api.service';
import { TomTomApiService } from './services/tomtom/tomtom.service';

@Module({
    providers: [MapsApiService, TomTomApiService],
    exports: [MapsApiService, TomTomApiService],
})
export class MapsModule {}
