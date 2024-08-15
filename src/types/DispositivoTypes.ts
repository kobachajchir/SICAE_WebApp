export interface IRData {
  up: string;
  down: string;
  power: string;
}

export interface DispositivoInfo {
  ip: string;
  firmware: string;
  status: boolean;
  salaName: string;
  ssid: string;
  connDBI: string;
  lastConnectionTime: string;
  apMode: boolean;
}

export interface DeviceDataEntry {
  deviceType: string;
  icon: string;
  irData: IRData;
  model: string;
  name: string;
  status: boolean;
}

export interface DispositivoData {
  devices: Record<string, DeviceDataEntry>;
  info: DispositivoInfo; // Changed from Record<string, DispositivoInfo> to DispositivoInfo
}

export interface Dispositivo {
  data: DispositivoData; // Adjusted to reflect the structure change
  id: string; // Adjusted to reflect the structure change
}

export interface Dispositivos {
  [key: string]: Dispositivo;
}

export interface DispositivosContextProps {
  dispositivos: Dispositivo[];
  setDispositivos: any;
}
