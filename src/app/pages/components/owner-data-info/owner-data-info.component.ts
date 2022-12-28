import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalsService } from 'src/app/shared/services/globals.service';
import { confirmAlert, successAlert, errorAlert } from '../../../shared/services/alerts';
import { LayerService } from '../../services/layer.service';
import { ObservationsService } from '../../services/observations.service';
import { OwnerService } from '../../services/owner.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-owner-data-info',
  templateUrl: './owner-data-info.component.html',
  styles: [
  ]
})
export class OwnerDataInfoComponent implements OnInit {
  admin = this.authService.auth.perfilUsuario == "ADMIN";

  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<OwnerDataInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private observationsService: ObservationsService,
    private ownerService: OwnerService,
    private layerService: LayerService
  ) { }

  ngOnInit(): void { }

  deleteData() {
    let title;
    switch (this.data.type) {
      case "flight":
        title = "el vuelo";
        break;
      case "observation":
        title = "la observación";
        break;
      case "analysis":
        title = "el análisis";
        break;
    }
    confirmAlert(`¿Está seguro de que desea eliminar ${title}?`)
      .then((result: any) => {
        if (result.isConfirmed) {
          switch (this.data.type) {
            case "flight":

              this.ownerService.deleteOwnerFlight(this.data.data.vueloId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((_) => {
                  successAlert('El vuelo ha sido eliminado')
                }, error => {
                  console.log(error);
                  errorAlert(error.error.msg)
                })

              break;
            case "observation":

              this.observationsService.deleteObservation(this.data.data.observacionId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((_) => {
                  successAlert('La observación ha sido eliminada')
                }, error => {
                  console.log(error);
                  errorAlert(error.error.msg)
                })

              break;
            case "analysis":

              this.layerService.deleteAnalysis(this.data.data.analisisId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((_) => {
                  successAlert('El análisis ha sido dado de baja')
                }, error => {
                  console.log(error);
                  errorAlert(error.error.msg)
                })

              break;

          }
          this.ownerService.elementDeleted.next();
          this.dialogRef.close();
        }
      });
  }

}
