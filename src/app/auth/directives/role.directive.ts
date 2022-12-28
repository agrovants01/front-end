import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.viewContainer.clear();
    if (this.authService.auth.perfilUsuario.toLocaleLowerCase() === 'admin') {
      this.viewContainer.createEmbeddedView(this.templateRef)
    }
  }
}
