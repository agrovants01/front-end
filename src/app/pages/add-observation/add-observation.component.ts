import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { GlobalsService } from 'src/app/shared/services/globals.service';
import { MapService } from 'src/app/shared/services/map.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { LessThanTodayService } from 'src/app/shared/validators/less-than-today.service';
import { confirmAlert, cancelAlert, successAlert, errorAlert } from 'src/app/shared/services/alerts';
import { ObservationsService } from '../services/observations.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-observation',
  host: { 'class': 'sidebar__content-flex' },
  templateUrl: './add-observation.component.html',
  styles: [
  ]
})
export class AddObservationComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  userId = localStorage.getItem('id');
  markers: any[] = [];
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  observationForm: FormGroup = this.fb.group({
    markersObservation: ['', [Validators.required]],
    dateObservation: [new Date(), [Validators.required], [this.dateValidator]],
    descriptionObservation: ['', [Validators.required]]
  });

  constructor(
    public sidebarService: SidebarService,
    public globalsService: GlobalsService,
    public mapService: MapService,
    public observationsService: ObservationsService,
    private fb: FormBuilder,
    private dateValidator: LessThanTodayService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.mapService.addDrawControls();
    this.mapService.map$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(map => {
        map.on('pm:create', (e: any) => {
          this.markers.push(e);
        })
        map.on('pm:remove', e => {
          this.markers.splice(this.markers.lastIndexOf(e), 1);
        })
      })

  }

  ngOnDestroy(): void {
    this.mapService.clearMap();
    this.mapService.removeDrawControls();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getMarkers() {
    this.mapService.removeDrawControls();
    const features: any[] = [];
    this.markers.forEach(marker => features.push(marker.layer.toGeoJSON()));
    this.observationForm.get('markersObservation')?.setValue(features);
  }

  saveObservation() {
    if (this.observationForm.invalid) {
      this.observationForm.markAllAsTouched();
      return;
    }
    confirmAlert().then((result: any) => {
      if (result.isConfirmed) {

        this.route.params
          .pipe(
            takeUntil(this.unsubscribe$),
            switchMap((params) => {
              const featureCollection = {
                "type": "FeatureCollection",
                "features": this.observationForm.value.markersObservation
              }
              //const todayDate = this.globalsService.formatDate(new Date());
              const req = {
                descripcionObservacion: this.observationForm.value.descriptionObservation,
                fk_Usuario: this.userId,
                propietarioObservacion: params.id,
                featureCollection: featureCollection,
                fechaObservacion: this.observationForm.value.dateObservation
              }
              return this.observationsService.saveObservation(req)
            })
          ).subscribe((_) => {
            successAlert('La observación ha sido agregada')
              .then(() => { this.globalsService.return() });
          }, (error: any) => {
            errorAlert('La observación no ha sido agregada', error.error.errors[0].msg)
              .then(() => { this.globalsService.return() });
          })
      }
    })
  }

  cancelObservation() {
    cancelAlert().then((result: any) => {
      if (result.isConfirmed) {
        this.globalsService.return();
      }
    })
  }

  onFileChanged(event: any) {
    const selectedFile = event.target.files[0];
  }

}
