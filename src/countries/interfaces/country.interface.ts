export interface BaseCountry {
  countryCode: string;
  name: string;
}

export interface BorderCountry extends BaseCountry {
  flagUrl: string;
}

export interface CountryInfo extends BaseCountry {
  borders: BorderCountry[];
  population: PopulationData[];
  flagUrl: string;
}

export interface PopulationData {
  year: number;
  value: number;
}

export interface CountryBorderInfo {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: null | any[];
}

export interface CountryBorderResponse {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: CountryBorderInfo[];
}

export interface CountryPopulationResponse {
  error: boolean;
  msg: string;
  data: {
    country: string;
    populationCounts: Array<{
      year: string;
      value: string;
    }>;
  };
}

export interface CountryFlagResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    flag: string;
  };
}