import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { JWTInterceptor } from './auth/interceptors/jwt.interceptor';
import { ConfigModule } from './config/config.module';
import { FrameworksModule } from './frameworks/frameworks.module';
import { NotFound404Component } from './not-found404/not-found404.component';
import { PagesModule } from './pages/pages.module';



@NgModule({
  declarations: [
    AppComponent,
    NotFound404Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AdminModule,
    ConfigModule,
    CommonModule,
    BrowserAnimationsModule,
    //NoopAnimationsModule,
    HttpClientModule,
    AuthModule,
    FrameworksModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JWTInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
