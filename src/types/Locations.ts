export interface Location{
  id:number;
  devicePublicId:string;
  latitude:number;
  longitude:number;
  speed:number | null;
  gpsTimestamp: string;
  receivedAt: string;

}