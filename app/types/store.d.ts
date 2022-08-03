export interface Owner {
  id: number;
  login_name: string;
  legal_name: string;
}

export interface Name {
  id: number;
  name: string;
  author: string;
  rank: string;
}

export interface Naming {
  id: number;
  name: Name;
  owner: Owner;
  confidence: number;
}

export interface Vote {
  id: number;
  confidence: number;
  naming_id: number;
  owner: Owner;
}

export interface Observation {
  id: number;
  type: string;
  date: string;
  gps_hidden: boolean;
  specimen_available: boolean;
  is_collection_location: boolean;
  confidence: number;
  created_at: string;
  updated_at: string;
  number_of_views: number;
  images?: Image[];
  primary_image?: Image;
  last_viewed?: boolean;
  owner: Owner;
  consensus: Name;
  namings: Naming[];
  votes: Vote[];
  location_name: string;
}

export interface License {
  label: string;
  value: number;
}

export interface Location {
  label: string;
  value: number;
}

export interface Image {
  id: number;
  copyrightHolder: string;
  date: string;
  files: string[];
  license: number;
  notes: string;
}

export interface DraftObservation {
  id: string;
  name?: string;
  date?: string;
  location?: string;
  vote?: number;
  notes?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  isCollectionLocation?: boolean;
  gpsHidden?: boolean;
  draftPhotoIds?: string[];
}

export interface DraftImage {
  md5: any;
  id: string;
  fileName?: string;
  fileSize?: number;
  type?: string;
  width?: number;
  height?: number;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  uri?: string;
  copyrightHolder?: string;
  date?: string;
  license?: string;
  notes?: string;
  draftObservationId: string;
}
