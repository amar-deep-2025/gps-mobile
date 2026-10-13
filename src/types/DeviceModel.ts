export interface CreateDeviceModelRequest{
  manufacturer:string;
  modelName: string;
  modelNumber:string;
  protocol:string;
  capabilities: string;
}

export interface DeviceModel{
  publicId:string;
  manufacturer:string;
  modelName:string;
  modelNumber:string;
  protocol:string;
  capabilities:string;
  createdAt:string;
}