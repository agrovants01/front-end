import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { AddObservationComponent } from './add-observation/add-observation.component';
import { OwnerComponent } from './owner/owner.component';
import { OwnersComponent } from './owners/owners.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    children: [
      {
        path: 'owners', component: OwnersComponent,
        canActivate: [OwnerGuard]
      },
      {
        path: 'owner/:id',
        children: [
          {
            path: '',
            component: OwnerComponent
          },
          {
            path: 'add-observation',
            component: AddObservationComponent
          }
        ],
        canActivate: [OwnerGuard]
      },
      { path: '', redirectTo: 'owners', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
