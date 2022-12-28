import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserFormComponent } from 'src/app/admin/components/user-form/user-form.component';
import { GlobalsService } from 'src/app/shared/services/globals.service';
import { cancelAlert, warningAlert, loadingAlert, successAlert } from '../../../shared/services/alerts';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  fromDate: any;
  flights: any[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<UserFormComponent>,
    private globalsService: GlobalsService,
    private reportService: ReportService,
    @Inject(MAT_DIALOG_DATA) public userId: string,
  ) { }

  ngOnInit(): void {
    
  }

  setFromDate(fromDate: any) {
    this.fromDate = fromDate;
  }

  getFlights(toDate: any) {
    if (toDate) {
      const req = {
        "fechaDesde": this.globalsService.formatDate(this.fromDate),
        "fechaHasta": this.globalsService.formatDate(toDate),
        "usuarioId": this.userId
      }
      this.reportService.getFlightsByDate(req)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(flights => {
          this.flights = flights;
          if (this.flights.length == 0) {
            warningAlert("No se encontraron vuelos para el rango de fechas indicado");
          }
        });
    }
  }

  removeFlight(i: any) {
    this.flights = this.flights.filter((flight) => flight.vueloId !== i);
  }

  cancel(): void {
    cancelAlert()
      .then((result: any) => {
        if (result.isConfirmed) {
          this.dialogRef.close();
        }
      });
  }

  generateReport() {
    if (this.flights.length == 0) {
      warningAlert("Debe agregar algún vuelo para generar un informe.");
    } else {
      const dataFlights: any[] = [];
      this.flights.forEach(flight => { dataFlights.push(flight.vueloId); })
      const data = { "vuelos": dataFlights };

      loadingAlert('Generando informe...');

      this.reportService.generateReport(data)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: any) => {
          const file = new Blob([res.body], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.dialogRef.close();
          successAlert('Informe generado con éxito');
        });
    }
  }

}
