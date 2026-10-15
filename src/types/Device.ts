export interface CreateDeviceRequest {
  serialNumber: string;
  imei: string;
  deviceName: string;
  deviceModelId: string;
  firmwareVersion?: string | null;
}
export interface Device {
  publicId: string;
  serialNumber: string;
  imei: string;
  deviceName: string;
  deviceModelId: string;
  status: string;
  lifecycleState: string;
  firmwareVersion?: string | null;
  lastSeenAt?: string | null;
  registeredAt?: string | null;
  activatedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
