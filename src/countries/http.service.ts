import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class HttpClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly dateNagerBaseUrl =
    this.configService.get<string>('DATE_NAGER_API_URL');
  private readonly countriesNowBaseUrl = this.configService.get<string>(
    'COUNTRIES_NOW_API_URL',
  );

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<T>(url).pipe(
          catchError((error: AxiosError) => {
            console.error('HTTP Get Error:', error.message);
            throw new HttpException(
              error.response?.data || 'Failed to fetch data',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async post<T>(url: string, body: any): Promise<T> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<T>(url, body).pipe(
          catchError((error: AxiosError) => {
            console.error('HTTP Post Error:', error.message);
            throw new HttpException(
              error.response?.data || 'Failed to post data',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to post data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getDateNagerUrl(path: string): string {
    return `${this.dateNagerBaseUrl}${path}`;
  }

  getCountriesNowUrl(path: string): string {
    return `${this.countriesNowBaseUrl}${path}`;
  }
}
