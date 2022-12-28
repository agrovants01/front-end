import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-sidebar-admin',
  host: { 'class': 'sidebar__content-flex' },
  templateUrl: './sidebar-admin.component.html',
  styles: [
  ]
})
export class SidebarAdminComponent implements OnInit {

  constructor(
    public sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
  }

}
