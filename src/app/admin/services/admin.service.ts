import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserList } from '../users/users.interface';
import { catchError, delay, map, retry } from 'rxjs/operators';
import { ProfileList } from './profiles.interface';
import { IndexData, IndexList, IndexRange } from '../indexes/index.interface';
import { Backup } from '../backup/backup.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  /* Backend */

  saveFlights(flights: any) {
    return this.http.post<any>(
      `${this.baseUrl}/file`,
      flights
    );
  }

  getUser(userId: string): Observable<UserList> {
    return this.http.get<UserList>(`${this.baseUrl}/usuario/${userId}`)
  }

  saveUser(user: UserList): Observable<UserList> {
    return this.http.post<UserList>(`${this.baseUrl}/usuario`, user)
  }

  updateUser(user: UserList): Observable<UserList> {
    return this.http.put<UserList>(`${this.baseUrl}/usuario/editUsuario/${user.usuarioId}`, user)
  }

  deleteUser(user: UserList) {
    return this.http.delete<any>(`${this.baseUrl}/usuario/${user.usuarioId}`)
  }

  getUsuerProfiles() {
    return this.http.get<ProfileList[]>(`${this.baseUrl}/perfil`)
  }

  getUsuersAdminList(sort: string = '', order: SortDirection, page: number = 0, filter: string = '', limit: number) {
    const params = new HttpParams().appendAll({
      sort,
      order,
      page: page,
      q: filter,
      limit
    })
    return this.http.get<any>(`${this.baseUrl}/usuario/admin`, { params })
      .pipe(
        delay(500),
        map(users => {
          const { count, rows } = users;
          rows.forEach((user: any) => {
            const perfil = user.Perfil.nombrePerfil;
            delete user.Perfil;
            user.perfilUsuario = perfil
          })
          return {
            items: rows,
            total_count: count
          };
        })
      );
  }

  getIndexesAdminList(sort: string = '', order: SortDirection, page: number = 0, filter: string = '', limit: number) {
    const params = new HttpParams().appendAll({
      sort,
      order,
      page: page,
      q: filter,
      limit
    })
    return this.http.get<any>(`${this.baseUrl}/indice/admin`, { params })
      .pipe(
        delay(500),
        map((indexes) => {
          const { count, rows } = indexes;
          return {
            items: rows,
            total_count: count
          };
        })
      );
  }

  getIndexes() {
    return this.http.get<IndexData[]>(`${this.baseUrl}/indice/`);
  }

  getIndexRange(index: string) {
    return this.http.get<IndexRange[]>(`${this.baseUrl}/rango/${index}`)
  }

  saveIndex(index: IndexData): Observable<IndexData> {
    return this.http.post<IndexData>(`${this.baseUrl}/indice`, index)
  }


  updateIndex(index: IndexData): Observable<IndexData> {
    return this.http.put<IndexData>(`${this.baseUrl}/indice/${index.indiceId}`, index)
  }

  deleteIndex(index: IndexList) {
    return this.http.delete<any>(`${this.baseUrl}/indice/${index.indiceId}`)
  }


  deleteBackup(backup: Backup) {
    return this.http.delete<any>(`${this.baseUrl}/index/${backup.backupId}`)
      .pipe(
        delay(500)
      );

  }

  saveBackup(backup: Backup): Observable<Backup> {
    return this.http.post<Backup>(`${this.baseUrl}/backup`, backup)
      .pipe(
        delay(500)
      )
  }

  /* FakeBackend */

  saveFlightsFake(flights: any) {
    return this.http.post<any>(
      `${this.baseUrl}/vuelos`,
      flights
    );
  }

  getUsuersAdminListFake(sort: string, order: SortDirection, page: number, filter: string = '') {
    const filterValue = filter.trim().toLocaleLowerCase();
    return this.http.get<any>(`${this.baseUrl}/usuarios?_sort=${sort}&_order=${order}&_start=${page}&_limit=30&q=${filterValue}`)
      .pipe(
        delay(500),
        map((data) => {
          const total_count = 100;
          return {
            items: data,
            total_count
          }
        })
      );

  }

  saveUserFake(user: UserList): Observable<UserList> {
    const id = Math.random().toString();
    const userFake: any = {
      aliasUsuario: user.aliasUsuario,
      apellidoUsuario: user.apellidoUsuario,
      nombreUsuario: user.nombreUsuario,
      telefonoUsuario: user.telefonoUsuario,
      cuitUsuario: user.cuitUsuario,
      perfilUsuario: user.perfilUsuario,
      emailUsuario: user.emailUsuario,
      usuarioId: id,
      id
    }
    return this.http.post<UserList>(`${this.baseUrl}/usuarios`, userFake)
      .pipe(
        delay(500)
      )
  }
  updateUserFake(user: UserList): Observable<UserList> {
    const id = Math.random().toString();
    const userFake: any = {
      aliasUsuario: user.aliasUsuario,
      apellidoUsuario: user.apellidoUsuario,
      nombreUsuario: user.nombreUsuario,
      telefonoUsuario: user.telefonoUsuario,
      cuitUsuario: user.cuitUsuario,
      perfilUsuario: user.perfilUsuario,
      emailUsuario: user.emailUsuario,
      usuarioId: id,
      id
    }
    return this.http.put<UserList>(`${this.baseUrl}/usuarios/${user.usuarioId}`, userFake)
      .pipe(
        delay(500)
      )
  }


  getUsuerProfilesFake() {
    return this.http.get<ProfileList[]>(`${this.baseUrl}/perfiles`)
      .pipe(
        delay(500)
      );

  }

  deleteUserFake(user: UserList) {
    return this.http.delete<any>(`${this.baseUrl}/usuarios/${user.usuarioId}`)
      .pipe(
        delay(500)
      );

  }


  getIndexesAdminListFake(sort: string, order: SortDirection, page: number, filter: string = '') {
    const filterValue = filter.trim().toLocaleLowerCase();
    return this.http.get<any>(`${this.baseUrl}/indices?_sort=${sort}&_order=${order}&_start=${page}&_limit=30&q=${filterValue}`)
      .pipe(
        delay(500),
        map((data) => {
          const total_count = 3;
          return {
            items: data,
            total_count
          }
        })
      );

  }

  saveIndexFake(index: IndexData): Observable<IndexData> {
    const id = Math.random().toString();
    const indexFake: any = {
      nombreIndice: index.nombreIndice,
      siglasIndice: index.siglasIndice,
      indiceId: id,
      referencia: index.referencia,
      id
    }
    return this.http.post<IndexData>(`${this.baseUrl}/indices`, indexFake)
      .pipe(
        delay(500)
      )
  }

  updateIndexFake(index: IndexData): Observable<IndexData> {
    const id = Math.random().toString();
    const indexFake: any = {
      nombreIndice: index.nombreIndice,
      siglasIndice: index.siglasIndice,
      rerefencia: index.referencia,
      indiceId: id,
      id
    }
    return this.http.put<IndexData>(`${this.baseUrl}/indices/${index.indiceId}`, indexFake)
      .pipe(
        delay(500)
      )
  }


  deleteIndexFake(index: IndexList) {
    return this.http.delete<any>(`${this.baseUrl}/index/${index.indiceId}`)
      .pipe(
        delay(500)
      );

  }

  getBackupsListFake(sort: string, order: SortDirection, page: number, filter: string = '') {
    const filterValue = filter.trim().toLocaleLowerCase();
    return this.http.get<any>(`${this.baseUrl}/backups?_sort=${sort}&_order=${order}&_start=${page}&_limit=30&q=${filterValue}`)
      .pipe(
        delay(500),
        map((data) => {
          const total_count = 3;
          return {
            items: data,
            total_count
          }
        })
      );

  }


}
