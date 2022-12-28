import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string | null = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'x-token': token!
      });
      const currentRequest = request.clone({
        headers
      })

      request = currentRequest;

      return next.handle(request);
    }
    return next.handle(request)

  }
}
