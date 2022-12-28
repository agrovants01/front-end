import { GeoJsonObject } from 'geojson';
export interface Flight {
  vueloId: string;
  cuadroVuelo?: string;
  aplicacionVuelo?: string;
  cultivoVuelo?: string;
  caldoVuelo?: number;
  totalCaldoVuelo?: number;
  totalH2OVuelo?: number;
  pilotoVuelo?: string;
  asistenteVuelo?: string;
  fechaVuelo: Date;
  superficieVuelo?: number;
  colorVuelo?: string;
  geometryVuelo: GeoJsonObject;
  fechaBajaVuelo?: Date;
  fk_Usuario: string;
  date: Date;
}
