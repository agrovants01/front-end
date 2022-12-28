import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OwnerDataInfoComponent } from '../components/owner-data-info/owner-data-info.component';
import { OwnerPreview, OwnerListInput } from '../owner/owner.interface';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private baseUrl: string = environment.baseUrl;
  public elementDeleted: Subject<any> = new Subject();

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  /* Backend Agrovants */

  searchOwners(value: string = ''): Observable<OwnerPreview[]> {
    const params = new HttpParams().appendAll({
      q: value,
    });
    return this.http.get<OwnerPreview[]>(
      `${this.baseUrl}/busqueda/propietarios`, { params }
    );
  }

  sortOwners(owners: OwnerPreview[], option: string, criterion: boolean) {

    switch (option) {
      case 'Propietario':
        if (criterion) {
          owners.sort((a, b) => {
            if (a.nombrePropietario.length > 0) {
              if (b.nombrePropietario.length > 0) {
                return a.nombrePropietario.localeCompare(b.nombrePropietario)
              } else {
                return a.nombrePropietario.localeCompare(b.aliasPropietario)
              }
            }
            return (b.nombrePropietario.length > 0) ? a.aliasPropietario.localeCompare(b.nombrePropietario) : a.aliasPropietario.localeCompare(b.aliasPropietario);
          });
          return;
        }
        owners.sort((a, b) => {
          if (a.nombrePropietario.length > 0) {
            if (b.nombrePropietario.length > 0) {
              return a.nombrePropietario.localeCompare(b.nombrePropietario)
            } else {
              return a.nombrePropietario.localeCompare(b.aliasPropietario)
            }
          }
          return (b.nombrePropietario.length > 0) ? a.aliasPropietario.localeCompare(b.nombrePropietario) : a.aliasPropietario.localeCompare(b.aliasPropietario);
        }).reverse();
        break;

      case 'Último Vuelo':
        if (criterion) {
          owners.sort((a, b) => {
            return (
              <any>new Date(a.ultimoVuelo) -
              <any>new Date(b.ultimoVuelo)
            );
          });
          return;
        }
        owners
          .sort((a, b) => {
            return (
              <any>new Date(a.ultimoVuelo) -
              <any>new Date(b.ultimoVuelo)
            );
          })
          .reverse();
        break;

      case 'Cant. Vuelos':
        if (criterion) {
          owners.sort((a, b) => {
            return a.cantidadVuelos - b.cantidadVuelos;
          });
          return;
        }
        owners
          .sort((a, b) => {
            return a.cantidadVuelos - b.cantidadVuelos;
          })
          .reverse();
        break;
    }
  }

  getOwnersList(): Observable<OwnerListInput[]> {
    return this.http.get<OwnerListInput[]>(
      `${this.baseUrl}/usuario/admin/propietariosInput`
    )
  }

  getOwnerFlights(usuarioId: string, fechaDesde: Date, fechaHasta: Date) {
    const params = new HttpParams().appendAll({
      fechaDesde: fechaDesde.toString(),
      fechaHasta: fechaHasta.toString(),
    });
    return this.http.get<any>(
      `${this.baseUrl}/vuelo/${usuarioId}`, { params }
    )
  }

  deleteOwnerFlight(vueloId: string) {
    return this.http.put<any>(`${this.baseUrl}/vuelo/bajaVuelo/${vueloId}`, {});
  }

  sortOwnerData(ownerData: any[], criterion: boolean): any[] {
    let fullOwnerData: any[] = [];

    ownerData.forEach((data: any) => {
      if (data !== null) {
        if (data) {
          fullOwnerData = fullOwnerData.concat(data)
        } else {
          fullOwnerData = fullOwnerData.concat(data)
        }
      }
    })

    if (criterion) {
      fullOwnerData.sort((a, b) => {
        return (
          <any>new Date(a.date) -
          <any>new Date(b.date)
        );
      })
    } else {
      fullOwnerData.sort((a, b) => {
        return (
          <any>new Date(a.date) -
          <any>new Date(b.date)
        );
      }).reverse();
    }

    return fullOwnerData;
  }

  openInfoDialog(data: any, type: string) {
    this.dialog.open(OwnerDataInfoComponent, {
      data: {
        type,
        data
      }
    })
  }

  /* FackeBackend */

  getOwnersFake(): Observable<OwnerPreview[]> {
    return this.http.get<OwnerPreview[]>(
      `${this.baseUrl}/propietarios/`
    )
  };

  searchOwnersFake(value: string): Observable<OwnerPreview[]> {
    const searchValue = value.trim().toLocaleLowerCase();
    return this.http.get<OwnerPreview[]>(
      `${this.baseUrl}/propietarios/?q=${searchValue}`
    )
  }

  sortOwnersFake(option: string, criterion: boolean): Observable<OwnerPreview[]> {

    switch (option) {
      case 'Propietario':
        if (criterion) {
          return this.http.get<OwnerPreview[]>(
            `${this.baseUrl}/propietarios/?_sort=nombrePropietario&_order=asc`
          );
        }
        return this.http.get<OwnerPreview[]>(
          `${this.baseUrl}/propietarios/?_sort=nombrePropietario&_order=desc`
        );
        break;

      case 'Último Vuelo':
        if (criterion) {
          return this.http.get<OwnerPreview[]>(
            `${this.baseUrl}/propietarios/?_sort=ultimoVuelo&_order=asc`
          );
        }
        return this.http.get<OwnerPreview[]>(
          `${this.baseUrl}/propietarios/?_sort=ultimoVuelo&_order=desc`
        );
        break;

      case 'Cant. Vuelos':
        if (criterion) {
          return this.http.get<OwnerPreview[]>(
            `${this.baseUrl}/propietarios/?_sort=cantidadVuelos&_order=asc`
          );
        }
        return this.http.get<OwnerPreview[]>(
          `${this.baseUrl}/propietarios/?_sort=cantidadVuelos&_order=desc`
        );
        break;
    }
    return new Observable<OwnerPreview[]>();
  }


}
