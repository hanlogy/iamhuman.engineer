export interface GetSignedUrlParams {
  readonly folder: string;
  readonly contentType: string;
}

export interface GetSignedUrlResult {
  readonly uploadUrl: string;
  readonly key: string;
  readonly publicUrl: string;
}

export interface S3HelperInterface {
  getSignedUrl: (params: GetSignedUrlParams) => Promise<GetSignedUrlResult>;
}
