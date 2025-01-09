import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpClientService } from './http.service';
import {
  BaseCountry,
  CountryInfo,
  CountryBorderResponse,
  CountryPopulationResponse,
  CountryFlagResponse,
} from './interfaces/country.interface';

@Injectable()
export class CountriesService {
  constructor(private readonly httpClient: HttpClientService) {}

  async getAvailableCountries(): Promise<BaseCountry[]> {
    try {
      const countries = await this.httpClient.get<BaseCountry[]>(
        this.httpClient.getDateNagerUrl('/AvailableCountries'),
      );

      const countriesWithFlags = await Promise.all(
        countries.map(async (country) => {
          try {
            const borderInfo = await this.getBorderInfo(country.countryCode);
            const flagUrl = await this.getFlagUrl(borderInfo.commonName);
            return {
              ...country,
              flagUrl,
            };
          } catch (error) {
            console.error(`Error fetching flag for ${country.name}:`, error);
            return {
              ...country,
              flagUrl: '',
            };
          }
        }),
      );

      return countriesWithFlags;
    } catch (error) {
      console.error('Error fetching available countries:', error);
      throw new HttpException(
        'Failed to fetch available countries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCountryInfo(countryCode: string): Promise<CountryInfo> {
    try {
      const borderInfo = await this.getBorderInfo(countryCode);

      const [populationData, flagData] = await Promise.all([
        this.getPopulationData(borderInfo.commonName),
        this.getFlagUrl(borderInfo.commonName),
      ]);

      const borderPromises = borderInfo.borders.map(async (border) => {
        try {
          const borderFlag = await this.getFlagUrl(border.commonName);
          return {
            countryCode: border.countryCode,
            name: border.commonName,
            flagUrl: borderFlag,
          };
        } catch (error) {
          console.error(
            `Error getting flag for border country ${border.commonName}:`,
            error,
          );
          return {
            countryCode: border.countryCode,
            name: border.commonName,
            flagUrl: '',
          };
        }
      });

      const borderCountries = await Promise.all(borderPromises);

      return {
        countryCode,
        name: borderInfo.commonName,
        borders: borderCountries,
        population: populationData,
        flagUrl: flagData,
      };
    } catch (error) {
      console.error('Error fetching country info:', error);
      throw new HttpException(
        'Failed to fetch country information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getBorderInfo(
    countryCode: string,
  ): Promise<CountryBorderResponse> {
    try {
      return await this.httpClient.get<CountryBorderResponse>(
        this.httpClient.getDateNagerUrl(`/CountryInfo/${countryCode}`),
      );
    } catch (error) {
      console.error('Error fetching border info:', error);
      throw new HttpException(
        'Failed to fetch border information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getPopulationData(countryName: string): Promise<any[]> {
    try {
      const response = await this.httpClient.post<CountryPopulationResponse>(
        this.httpClient.getCountriesNowUrl('/countries/population'),
        { country: countryName },
      );

      if (response.error) {
        throw new HttpException(response.msg, HttpStatus.BAD_REQUEST);
      }

      return response.data.populationCounts.map((count) => ({
        year: parseInt(count.year),
        value: parseInt(count.value),
      }));
    } catch (error) {
      console.error('Error fetching population data:', error);
      return [];
    }
  }

  private async getFlagUrl(countryName: string): Promise<string> {
    try {
      const response = await this.httpClient.post<CountryFlagResponse>(
        this.httpClient.getCountriesNowUrl('/countries/flag/images'),
        { country: countryName },
      );

      if (response.error) {
        throw new HttpException(response.msg, HttpStatus.BAD_REQUEST);
      }

      return response.data.flag;
    } catch (error) {
      console.error('Error fetching flag URL:', error);
      return '';
    }
  }
}
