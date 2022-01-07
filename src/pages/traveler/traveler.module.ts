import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelerPage } from './traveler';

@NgModule({
  declarations: [
    TravelerPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelerPage),
  ],
})
export class TravelerPageModule {}
