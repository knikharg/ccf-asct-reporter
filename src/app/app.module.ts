import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SheetService } from './sheet.service';
import { NavbarComponent } from './navbar/navbar.component';
import { TreeComponent } from './tree/tree.component';
import { LogsComponent } from './logs/logs.component';
import { IndentComponent } from './indent/indent.component';

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";





let MatModules = [
  MatToolbarModule,
  MatButtonModule,
  MatSelectModule,
  MatSidenavModule,
  MatTreeModule,
  MatIconModule
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TreeComponent,
    LogsComponent,
    IndentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatModules
  ],
  providers: [
    SheetService
  ],
  exports: [
    MatModules
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }