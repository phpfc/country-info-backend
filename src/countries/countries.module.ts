import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { HttpClientService } from './http.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [CountriesController],
  providers: [CountriesService, HttpClientService],
})
export class CountriesModule { }