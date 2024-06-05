// DispositivoTypes.ts
export interface IRData {
    up: string;
    down: string;
    power: string;
  }
  
  export interface DataEntry {
    deviceType: string;
    icon: string;
    irData: IRData;
    model: string;
    name: string;
    state: boolean;
  }
  
  export interface Dispositivo {
    currentIp: string;
    firmware: string;
    online: boolean;
    salaName: string;
    wifiName: string;
    apMode: boolean;
    apSSID: string;
    data: Record<string, DataEntry>;
}
  
export interface Dispositivos {
    [key: string]: Dispositivo;
}
  
export interface DispositivosContextProps {
  dispositivos: Dispositivo[];
  setDispositivos: any;
}