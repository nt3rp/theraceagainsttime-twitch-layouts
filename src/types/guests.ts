export interface SocialMedia {
  platform: string;
  handle: string;
}

export interface Guest {
  id: string;
  displayName?: string;
  socialMedia: Array<SocialMedia>;
  camera?: string;
}

export interface Camera {
  id: string;
  name: string;
}
