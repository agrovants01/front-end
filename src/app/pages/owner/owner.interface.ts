export interface OwnerPreview {
  idPropietario: string;
  nombrePropietario: string;
  apellidoPropietario: string;
  aliasPropietario: string;
  cantidadVuelos: number;
  ultimoVuelo: Date;
}


export interface OwnerListInput {
  propietarioId: string;
  nombrePropietario: string;
  apellidoPropietario: string;
  aliasPropietario: string;
}
