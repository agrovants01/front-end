import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { asyncScheduler, combineLatest, Observable, of, scheduled, Subject } from 'rxjs';
import { catchError, combineAll, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AdminService } from 'src/app/admin/services/admin.service';
import { UserList } from 'src/app/admin/users/users.interface';
import { GlobalsService } from 'src/app/shared/services/globals.service';
import { MapService } from 'src/app/shared/services/map.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { errorAlert } from '../../shared/services/alerts';
import { ReportComponent } from '../components/report/report.component';
import { LayerService } from '../services/layer.service';
import { ObservationsService } from '../services/observations.service';
import { OwnerService } from '../services/owner.service';

@Component({
  selector: 'app-owner',
  host: { 'class': 'sidebar__content-flex' },
  templateUrl: './owner.component.html',
  styles: []
})
export class OwnerComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  value: string = '';

  user: (UserList | undefined);

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  flightsRequired: boolean = true;
  analysisRequired: boolean = true;
  observationsRequired: boolean = true;

  ownerDataList: any[] = [];

  sortingCriterion: boolean = true;

  loading: boolean = false;

  constructor(
    public sidebarService: SidebarService,
    public globalsService: GlobalsService,
    public mapService: MapService,
    private adminService: AdminService,
    private ownerService: OwnerService,
    private observationsService: ObservationsService,
    private layerService: LayerService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.params
      .pipe(
        takeUntil(this.unsubscribe$),
        map((data: any) => {
          const { id } = data;
          return id;
        }),
        switchMap((id) => {
          return this.adminService.getUser(id)
        })
      ).subscribe((user: UserList) => {
        if (!user) {
          this.router.navigate(['404'])
        }
        this.user = user;
      })
  }

  ngOnInit(): void {
    this.mapService.addTimeslider();
    const today = new Date();
    const month = (today.getMonth() === 0) ? 12 : today.getMonth();
    const initStartDate = new Date(today.getFullYear().toString() + '-' + month.toString() + '-' + today.getDate().valueOf().toString());
    this.range.reset({
      start: initStartDate,
      end: today
    })
    this.formatRangeDates();
    this.ownerService.elementDeleted
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((_) => {
        this.formatRangeDates();
      })

  }

  formatRangeDates() {
    const dateSince = this.range.get('start')?.value;
    const dateUntil = this.range.get('end')?.value;
    if (!dateSince || !dateUntil) {
      return;
    }
    const range = {
      fechaDesde: formatDate(dateSince, 'yyyy-MM-dd', 'es-Ar'),
      fechaHasta: formatDate(dateUntil, 'yyyy-MM-dd', 'es-Ar'),
    }

    this.getOwnerData(range)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((userData: any[]) => {
          this.mapService.clearMap(); //Reset the map
          this.mapService.refreshView();

          const [flights, observations, layers] = userData;
          if (layers) {
            this.mapService.addAnalysisListToMap(layers);
          }
          if (flights) {
            this.mapService.addFlightsToMap(flights);
          }
          if (observations) {
            this.mapService.addObservationsToMap(observations);
          }
        }),
        map((userData: any[]) => {
          const userDataOrdered = this.ownerService.sortOwnerData(userData, true);
          return userDataOrdered;
        }),
      )
      .subscribe((data: any) => {
        this.ownerDataList = data;
      })

  }

  getOwnerData(range: any): Observable<any> {
    //Get the owner ID, and the map reference
    this.loading = true;
    return scheduled([this.route.params, this.mapService.map$], asyncScheduler)
      .pipe(
        combineAll(),
        takeUntil(this.unsubscribe$),
        switchMap((data: any[]) => {
          return combineLatest([
            (this.flightsRequired)
              ? this.ownerService.getOwnerFlights(data[0].id, range.fechaDesde, range.fechaHasta)
                .pipe(
                  takeUntil(this.unsubscribe$),
                  map((data: any[]) => {
                    data.forEach(element => {
                      element.visibility = true;
                      element.path = this.mapService.geojsonSvgPath(element.geometryVuelo.coordinates);
                    })
                    return data
                  }),
                  catchError((error) => {
                    console.log(error);
                    return of(error.error.type)
                  })
                )
              : of(null),
            (this.observationsRequired)
              ? this.observationsService.getOwnerObservations(data[0].id, range.fechaDesde, range.fechaHasta)
                .pipe(
                  takeUntil(this.unsubscribe$),
                  catchError((error) => {
                    console.log(error);
                    return of(error.error.type)
                  }),
                  map((data: any) => {
                    data.forEach((element: any) => {
                      element.visibility = true;
                      element.marcadores.forEach((marker: any) => {
                        marker.visibility = true;
                      })
                    })
                    return data
                  }),
                )
              : of(null),
            (this.analysisRequired)
              ? this.layerService.getOwnerAnalysisLayers(data[0].id, range.fechaDesde, range.fechaHasta)
                .pipe(
                  takeUntil(this.unsubscribe$),
                  map((data: any) => {
                    if (data === null) {
                      return 'análisis';
                    };
                    if (data.length > 0) {
                      data.forEach((element: any) => {
                        element.visibility = true;
                      })
                    }
                    return data
                  }),
                  catchError((error) => {
                    if (error.error) {
                      return of(error.error.type)
                    }
                    return error
                  })
                )
              : of(null)
          ])
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(userData => {
                if (userData.some((data) => typeof data == "string")) {
                  let errors: string[] = []
                  userData.forEach(data => {
                    if (typeof data == "string") { //TODO: Make alert when the option is active
                      if ((data === 'analisis' || data === 'análisis') && this.analysisRequired) {
                        errors.push(data)
                      }
                      if (data === 'vuelo' && this.flightsRequired) {
                        errors.push(data)
                      }
                      if (data === 'observacion' && this.flightsRequired) {
                        errors.push(data)
                      }
                    }
                  })
                  this.loading = false;
                  errorAlert('No se pudo obtener toda la información del propietario', 'Error al obtener: ' + errors)
                }
                this.loading = false;
                return userData;
              }),
              map((userData: any[]) => userData.map(data => (typeof data == "string") ? null : data))
            )

        })
      )
  }

  filterElement(element: any) {
    if (!this.range.get('start')?.value && !this.range.get('end')?.value) {
      errorAlert('Debe seleccionar una fecha de inicio y una de fin')
      return;
    }
    switch (element) {
      case 'flights':
        this.flightsRequired = !this.flightsRequired
        document.getElementById("flights")?.classList.toggle('disabled');

        this.formatRangeDates();
        break;
      case 'observations':
        this.observationsRequired = !this.observationsRequired
        document.getElementById("observations")?.classList.toggle('disabled');
        this.formatRangeDates();
        break;
      case 'analysis':
        this.analysisRequired = !this.analysisRequired
        document.getElementById("analysis")?.classList.toggle('disabled');
        this.formatRangeDates();
        break;
    }
  }

  goToElement(data: any) {
    if (data.vueloId) {
      this.ownerService.openInfoDialog(data, 'flight');
      try {
        this.mapService.fitBoundsById([data.vueloId]);
      } catch (error) {
        return
      }
    }
    if (data.observacionId) {
      const idList: any[] = [];
      data.marcadores.forEach((m: any) => {
        idList.push(m.marcadorId)
      });
      this.ownerService.openInfoDialog(data, 'observation');
      try {
        this.mapService.fitBoundsById(idList);
      } catch (error) {
        return
      }
    }
    if (data.analisisId) {
      this.ownerService.openInfoDialog(data, 'analysis');
    }
  }

  hideShowLayer(event: any, data: any, marker?: any) {
    event.preventDefault();
    event.stopPropagation();
    data.visibility = !data.visibility;
    if (marker) {
      marker.visibility = !marker.visibility;
    }

    if (data.vueloId) {
      if (data.visibility) {
        this.mapService.addFlightToMap(data);
      } else {
        this.mapService.map$
          .subscribe((map: L.Map) => {
            map.eachLayer((layer: any) => {
              const id = layer.id;
              if (id === data.vueloId) {
                layer.remove();
              }
            })
          }).unsubscribe();
      }

    }
    if (data.analisisId) {
      if (data.visibility) {
        this.mapService.addAnalysisToMap(data);
      } else {
        this.mapService.map$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((map: L.Map) => {
            map.eachLayer((layer: any) => {
              const id = layer.id;
              if (id === data.analisisId) {
                layer.remove();
              }
            })
          })
      }
    }
    if (data.observacionId) {
      if (data.visibility) {
        data.marcadores.forEach((marker: any) => {
          this.mapService.addObservationToMap(marker, data);
        })
      } else {
        this.mapService.map$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((map: L.Map) => {
            map.eachLayer((layer: any) => {
              data.marcadores.forEach((marker: any) => {
                const id = layer.id;
                if (id === marker.marcadorId) {
                  map.removeLayer(layer)
                }
              })
            })
          })
      }
    }

  }

  sortOwnerData(ownerDataList: any) {
    if (!ownerDataList) return;
    this.sortingCriterion = !this.sortingCriterion;
    this.ownerDataList = this.ownerService.sortOwnerData(ownerDataList, this.sortingCriterion);
  }

  addObservation() {
    this.router.navigate(['add-observation'], { relativeTo: this.route });
  }

  generateReport(user: any) {
    this.dialog.open(ReportComponent, {
      autoFocus: true,
      disableClose: true,
      hasBackdrop: true,
      data: user.usuarioId
    });
  }

  ngOnDestroy(): void {
    this.mapService.clearMap();
    this.mapService.removeTimeslider();
    this.mapService.cleanView();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
