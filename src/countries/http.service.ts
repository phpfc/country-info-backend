import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }

  private readonly dateNagerBaseUrl = this.configService.get<string>('DATE_NAGER_API_URL');
  private readonly countriesNowBaseUrl = this.configService.get<string>('COUNTRIES_NOW_API_URL');

  async get<T>(url: string): Promise<T> {
    const { data } = await firstValueFrom(this.httpService.get<T>(url));
    return data;
  }

  async post<T>(url: string, body: any): Promise<T> {
    const { data } = await firstValueFrom(this.httpService.post<T>(url, body));
    return data;
  }

  getDateNagerUrl(path: string): string {
    return `${this.dateNagerBaseUrl}${path}`;
  }

  getCountriesNowUrl(path: string): string {
    return `${this.countriesNowBaseUrl}${path}`;
  }
}