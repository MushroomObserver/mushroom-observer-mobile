import { License } from './store';

export interface ApiRequestParams {
  api_key: string;
  detail: 'high' | 'low';
}

export interface ApiResponse<ApiResult> {
  version: number;
  run_date: string;
  user: number;
  query?: string;
  run_time: number;
  errors?: ApiError[];
  results?: ApiResult[];
  number_of_records?: number;
  number_of_pages?: number;
  page_number?: number;
}

export interface ApiError {
  code: number;
  details: string;
  fatal: boolean;
  trace?: string;
}

export interface ApiKeyForUserRequestParams extends ApiRequestParams {
  app: string;
  for_user: string;
  password: string;
}

export interface ApiKeyResult {
  id: number;
  type: string;
  key: string;
  notes: string;
  created_at: string;
  last_used: string;
  verified: string;
  num_users: number;
}

export interface GetUserRequestParams extends ApiRequestParams {
  id: number;
}

export interface UserResult {
  id: number;
  type: string;
  login_name: string;
  legal_name: string;
  joined?: string;
  verified?: string;
  last_login?: string;
  last_activity?: string;
  contribution?: number;
  api_keys?: ApiKeyResult[];
}

export interface PostUserRequestParams extends ApiRequestParams {
  create_key: string;
  login: string;
  email: string;
  password: string;
}

export interface GetObservationsRequestParams extends ApiRequestParams {
  //   comments_has?: string;
  //   confidence?: number;
  //   created_at?: string;
  //   date?: string;
  //   east?: string;
  //   gps_hidden?: boolean;
  //   has_comments?: boolean;
  //   has_images?: boolean;
  //   has_location?: boolean;
  //   has_name?: boolean;
  //   has_notes?: boolean;
  //   has_notes_field?: string;
  //   has_specimen?: boolean;
  //   herbarium?: string;
  //   herbarium_record?: string;
  //   id?: number;
  //   include_subtaxa?: boolean;
  //   include_synonyms?: boolean;
  //   is_collection_location?: boolean;
  //   location?: string;
  //   name?: string;
  //   north?: number;
  //   notes_has?: string;
  //   project?: string;
  //   region?: string;
  //   south?: number;
  //   species_list?: string;
  //   updated_at?: string;
  user?: string;
  //   west?: string;
}

export interface PostObservationRequestParams extends ApiRequestParams {
  accession_number?: string;
  altitude?: number;
  collection_number?: string;
  collectors_name?: string;
  date?: string;
  gps_hidden?: boolean;
  has_specimen?: boolean;
  herbarium?: string;
  images?: string;
  initial_det?: string;
  is_collection_location?: boolean;
  latitude?: number;
  location: string;
  log?: boolean;
  longitude?: number;
  name?: string;
  notes?: string;
  projects?: string;
  reason_1?: string;
  reason_2?: string;
  reason_3?: string;
  reason_4?: string;
  species_lists?: string;
  thumbnail?: string;
  vote?: number;
}

export enum ContentType {
  BMP = 'bmp',
  GIF = 'gif',
  JPG = 'jpg',
  PNG = 'png',
  RAW = 'raw',
  TIFF = 'tiff',
}

export enum Size {
  HUGE = 'huge',
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
  THUMBNAIL = 'thumbnail',
}

export interface GetImageRequestParams extends ApiRequestParams {
  confidence?: number;
  content_type?: ContentType;
  copyright_holder_has?: string;
  created_at?: string;
  date?: string;
  has_notes?: boolean;
  has_observation?: boolean;
  has_votes?: boolean;
  id?: string;
  include_subtaxa?: boolean;
  include_synonyms?: boolean;
  license?: License;
  location?: string;
  name?: string;
  notes_has?: string;
  observation?: string;
  ok_for_export?: boolean;
  project?: string;
  quality?: number;
  size?: Size;
  species_list?: string;
  updated_at?: string;
  user?: string;
}
