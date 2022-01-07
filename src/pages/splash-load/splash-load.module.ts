import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashLoadPage } from './splash-load';

@NgModule({
  declarations: [
    SplashLoadPage,
  ],
  imports: [
    IonicPageModule.forChild(SplashLoadPage),
  ],
})
export class SplashLoadPageModule {}
