import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { BaseCountry, CountryInfo } from './interfaces/country.interface';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  getAvailableCountries(): Promise<BaseCountry[]> {
    return this.countriesService.getAvailableCountries();
  }

  @Get(':code')
  getCountryInfo(@Param('code') code: string): Promise<CountryInfo> {
    return this.countriesService.getCountryInfo(code);
  }
}
