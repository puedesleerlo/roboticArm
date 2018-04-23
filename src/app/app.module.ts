import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SvgComponent } from './svg/svg.component';
import { MultiplierPipe } from './multiplier.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SvgComponent,
    MultiplierPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
