export interface CosmicSeriesUrl {
  exactUrl: string | null;
  originalKey: string;
  status?: 'not_uploaded_yet';
}

export interface CosmicSeriesUrls {
  cosmicSeriesUrls: {
    [key: string]: CosmicSeriesUrl;
  };
} 