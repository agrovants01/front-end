import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { SearchLocationComponent } from './components/search-location/search-location.component';
import { TimesliderComponent } from './components/timeslider/timeslider.component';
import { FrameworksModule } from 'src/app/frameworks/frameworks.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [
    MapComponent,
    SearchLocationComponent,
    TimesliderComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    FrameworksModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
