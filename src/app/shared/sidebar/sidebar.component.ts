import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GlobalsService } from '../services/globals.service';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  host: { 'class': 'flex' },
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private _authService: AuthService,
    public globalsService: GlobalsService
  ) { }

  ngOnInit(): void { }

  goToAdmin() {
    // Administration redirect
    this.router.navigateByUrl('/admin');
  }

  goToConfiguration() {
    // Configuration redirect
    this.router.navigateByUrl('/config');
  }

}
