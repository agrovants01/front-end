import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrameworksModule } from '../frameworks/frameworks.module';
import { MapModule } from '../shared/map/map.module';
import { SharedModule } from '../shared/shared.module';
import { SearchComponent } from './components/search/search.component';
import { OwnerComponent } from './owner/owner.component';
import { OwnersComponent } from './owners/owners.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { AddObservationComponent } from './add-observation/add-observation.component';
import { ReportComponent } from './components/report/report.component';
import { AuthModule } from '../auth/auth.module';
import { OwnerDataInfoComponent } from './components/owner-data-info/owner-data-info.component';



@NgModule({
  declarations: [
    OwnersComponent,
    PagesComponent,
    SearchComponent,
    OwnerComponent,
    AddObservationComponent,
    ReportComponent,
    OwnerDataInfoComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    MapModule,
    FrameworksModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule
  ],
  exports: [
    OwnerDataInfoComponent,
  ]
})
export class PagesModule { }
