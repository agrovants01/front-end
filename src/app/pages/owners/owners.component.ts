import * as L from 'leaflet';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { OwnerPreview } from '../owner/owner.interface';
import { OwnerService } from '../services/owner.service';
import { OrderCriterion } from '../components/search/orderCriterion.interface';
import { MapComponent } from '../../shared/map/map.component';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  selector: 'app-owners',
  host: { 'class': 'sidebar__content-flex' },
  templateUrl: './owners.component.html',
  styles: []
})
export class OwnersComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  title: string = 'Propietarios'; //Title of the Search Bar
  orderOptions: string[] = ['Propietario', 'Último Vuelo', 'Cant. Vuelos']; //Options to order menu, in Search Bar

  owners: OwnerPreview[] = [];

  constructor(
    private ownerService: OwnerService,
    public sidebarService: SidebarService,
    private router: Router,
    private mapService: MapService
  ) { }

  ngOnInit(): void {

    this.mapService.map$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((map: L.Map) => {
/*         const coordinates: [number, number][] = [
          [-32.832726481394324, -68.61285696497058],
          [-32.83363518632619, -68.60664492065206],
          [-32.83511986138191, -68.6068705809323],
          [-32.83431492015577, -68.61307410976855]
        ];

        const polygon = L.polygon(coordinates, {}).addTo(map);
        const bounds = polygon.getBounds();
        map.fitBounds(bounds); */
      })

    this.ownerService.searchOwners()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((owners) => {
        this.owners = owners;
      });

    //this.mapService.removeAllFeatures();
    //this.mapService.addFlightsToMap(fc);
  }

  updateValues(value: string): any {
    if (value === '' || !value) {
      this.ownerService.searchOwners()
        .pipe(
          takeUntil(this.unsubscribe$)
        )
        .subscribe((owners) => {
          this.owners = owners;
        });
      return;
    }

    /** Server **/

    this.ownerService.searchOwners(value)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.owners = data;
      });

    /** Fake **/
    /*this.ownerService.searchOwnersFake(value)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.owners = [];
        this.owners = data;
      });*/
  }

  /** Criterion Order:
   *  true -> Ascendent
   *  false -> Descendent
   * **/

  /*Backend*/
  orderOwners(orderCriterion: OrderCriterion) {
    const { option, criterion } = orderCriterion;
    this.ownerService.sortOwners(this.owners, option, criterion);
  }

  /** FakeBackend*/
  /*orderOwners(orderCriterion: OrderCriterion) {
    const { option, criterion } = orderCriterion;
    this.ownerService.sortOwnersFake(option, criterion)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.owners = [];
        this.owners = data;
      })

  }*/

  goToOwner(id: string): void {
    this.router.navigateByUrl(`owner/${id}`);
  }

}
