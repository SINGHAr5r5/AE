import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoconutPage } from './coconut';

@NgModule({
  declarations: [
    CoconutPage,
  ],
  imports: [
    IonicPageModule.forChild(CoconutPage),
  ],
})
export class CoconutPageModule {}
