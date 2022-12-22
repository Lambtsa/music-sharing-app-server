export type HttpMethods =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

interface GeolocationType {
  city: string;
  country: string;
  coordinates: string;
  timezone: string;
}
export interface UserDataInput {
  ip: string | undefined;
  geolocation: GeolocationType | undefined;
}
