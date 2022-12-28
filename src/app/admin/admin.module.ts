import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { UploadAnalysisLayerComponent } from './upload-analysis-layer/upload-analysis-layer.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { FrameworksModule } from '../frameworks/frameworks.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexesComponent } from './indexes/indexes.component';
import { BackupComponent } from './backup/backup.component';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { IndexFormComponent } from './components/index-form/index-form.component';
import { BackupFormComponent } from './components/backup-form/backup-form.component';


@NgModule({
  declarations: [
    SidebarAdminComponent,
    UploadAnalysisLayerComponent,
    UploadDataComponent,
    AdminComponent,
    IndexesComponent,
    BackupComponent,
    UsersComponent,
    UserFormComponent,
    IndexFormComponent,
    BackupFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FrameworksModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
