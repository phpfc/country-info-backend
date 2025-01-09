import { Injectable } from '@nestjs/common';
import { HttpClientService } from './http.service';
import { BaseCountry, CountryInfo, CountryBorderResponse, CountryPopulationResponse, CountryFlagResponse } from './interfaces/country.interface';

@Injectable()
export class CountriesService {
  constructor(private readonly httpClient: HttpClientService) { }

  async getAvailableCountries(): Promise<BaseCountry[]> {
    return this.httpClient.get<BaseCountry[]>(
      this.httpClient.getDateNagerUrl('/AvailableCountries')
    );
  }

  async getCountryInfo(countryCode: string): Promise<CountryInfo> {
    const [borderInfo, populationData, flagData] = await Promise.all([
      this.getBorderInfo(countryCode),
      this.getPopulationData(countryCode),
      this.getFlagUrl(countryCode),
    ]);

    return {
      countryCode,
      name: borderInfo.commonName,
      borders: borderInfo.borders,
      population: populationData,
      flagUrl: flagData,
    };
  }

  private async getBorderInfo(countryCode: string): Promise<CountryBorderResponse> {
    return this.httpClient.get<CountryBorderResponse>(
      this.httpClient.getDateNagerUrl(`/CountryInfo/${countryCode}`)
    );
  }

  private async getPopulationData(countryCode: string): Promise<any[]> {
    const response = await this.httpClient.post<CountryPopulationResponse>(
      this.httpClient.getCountriesNowUrl('/countries/population'),
      { country: countryCode }
    );

    return response.data.populationCounts.map(count => ({
      year: parseInt(count.year),
      value: parseInt(count.value),
    }));
  }

  private async getFlagUrl(countryCode: string): Promise<string> {
    const response = await this.httpClient.post<CountryFlagResponse>(
      this.httpClient.getCountriesNowUrl('/countries/flag/images'),
      { country: countryCode }
    );

    return response.data.flag;
  }
}