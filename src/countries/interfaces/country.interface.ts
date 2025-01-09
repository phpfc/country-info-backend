export interface BaseCountry {
  countryCode: string;
  name: string;
}

export interface CountryInfo extends BaseCountry {
  borders: string[];
  population: PopulationData[];
  flagUrl: string;
}

export interface PopulationData {
  year: number;
  value: number;
}

export interface CountryBorderResponse {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: string[];
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