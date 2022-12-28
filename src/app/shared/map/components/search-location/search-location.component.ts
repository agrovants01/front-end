import { AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styles: []
})
export class SearchLocationComponent implements OnChanges {

  @Input('map')
  map: any;

  constructor() { }

  initSearch() {
    //Add search box
    const providerOSM = new OpenStreetMapProvider();
    let geosearch = GeoSearchControl({
      provider: providerOSM,
      style: 'button',
      searchLabel: 'Buscar ubicación...',
      notFoundMessage: 'No se pudo encontrar la ubicación indicada.',
      autoClose: true,
    });
    this.map.addControl(geosearch);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      this.initSearch();
    }
  }


}
