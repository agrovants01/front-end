import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { IndexesComponent } from './indexes/indexes.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { UploadAnalysisLayerComponent } from './upload-analysis-layer/upload-analysis-layer.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { BackupComponent } from './backup/backup.component';
import { UsersComponent } from './users/users.component';
import { OwnerGuard } from '../auth/guards/owner.guard';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    children: [
      { path: '', component: SidebarAdminComponent },
    ]
  },
  {
    path: 'upload-analysis',
    component: UploadAnalysisLayerComponent,
    children: [
      { path: '', component: SidebarAdminComponent },
    ]
  },
  {
    path: 'upload-flights',
    component: UploadDataComponent,
    children: [
      { path: '', component: SidebarAdminComponent },
    ]
  },
  {
    path: 'indexes',
    component: IndexesComponent,
    children: [
      { path: '', component: SidebarAdminComponent },
    ]
  },
  /*{
    path: 'backups',
    component: BackupComponent,
    children: [
      { path: '', component: SidebarAdminComponent },
    ]
  },*/
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: SidebarAdminComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
