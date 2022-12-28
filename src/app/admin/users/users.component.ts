import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { AdminService } from '../services/admin.service';
import { UserList } from './users.interface';
import { successAlert, errorAlert, confirmAlert } from '../../shared/services/alerts';
import { pageSizeOptions } from '../../frameworks/MatTableSettings';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements AfterViewInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  addingUser: boolean = false;

  displayedColumns: string[] = [
    'nombreUsuario',
    'apellidoUsuario',
    'aliasUsuario',
    'emailUsuario',
    'telefonoUsuario',
    'cuitUsuario',
    'perfilUsuario',
    'options'
  ];

  data: UserList[] = [];
  searchUsers: FormControl = new FormControl('');
  isLoadingResults = true;
  dataError: boolean = false;

  // MatPaginator
  resultsLength = 0;
  pageSizeOptions: number[] = pageSizeOptions;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private _adminService: AdminService,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.searchUsers.valueChanges)
      .pipe(
        takeUntil(this.unsubscribe$),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this._adminService.getUsuersAdminList(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.searchUsers.value,
            this.paginator.pageSize
          ).pipe(
            catchError(() => {
              this.dataError = true;
              return of(null)
            })
          );
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total_count;
          this.dataError = true;
          return data.items;
        }),
      )
      .subscribe(data => {
        this.data = data
      });


  }

  editUser(user: UserList) {
    this.addingUser = true; //Disable the edit button

    this.dialog.open(UserFormComponent, {
      autoFocus: true,
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      data: {
        title: 'Editar',
        user
      }
    })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        if (user === undefined) {
          this.addingUser = false;
          return;
        };

        Swal.fire({
          title: 'Guardando usuario',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            this._adminService.updateUser(user)
              .pipe(
                takeUntil(this.unsubscribe$),
              )
              .subscribe((_) => {
                successAlert('El usuario ha sido actualizado')
                  .then(() => {
                    this.addingUser = false; //Reset the update user button
                    this.searchUsers.reset(''); //Reset the table
                    Swal.close();
                  });
              }, (error: any) => {
                console.log(error);
                errorAlert('El usuario no ha sido editado', error.error.errors[0].msg)
                this.editUser(user); //call the form with the recovered data
              })
          }
        })


      });

  }

  deleteUser(user: UserList) {

    this.addingUser = true; //Disable the buttons

    confirmAlert()
      .then((result: any) => {
        if (result.isConfirmed) {
          this._adminService.deleteUser(user)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((_) => {
              this.addingUser = false; //Reset the update user button
              this.searchUsers.reset(''); //Reset the table
              Swal.close();
            }, (error) => {
              console.log(error);
              errorAlert('No se ha eliminado el usuario');
              return;
            })

        }
      });
    this.addingUser = false; //Enable  the buttons
  }

  addUser(userData = undefined) {

    this.addingUser = true; //Disable the add button

    this.dialog.open(UserFormComponent, {
      autoFocus: true,
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      data: {
        title: 'Crear nuevo',
        user: userData
      }
    }).afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {

        if (user === undefined) {
          this.addingUser = false;
          return;
        };

        userData = user; //Set the data to recover if there's an error

        Swal.fire({
          title: 'Guardando usuario',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            this._adminService.saveUser(user)
              .pipe(
                takeUntil(this.unsubscribe$),
              )
              .subscribe((_) => {
                successAlert('El usuario ha sido creado')
                  .then(() => {
                    this.addingUser = false; //Reset the create user button
                    this.searchUsers.reset(''); //Reset the table
                    Swal.close();
                  });
              }, (error: any) => {
                console.log(error);
                errorAlert('El usuario no ha sido editado', error.error.errors[0].msg);
                this.addUser(userData); //call the form with the recovered data
              })
          }
        })


      });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
