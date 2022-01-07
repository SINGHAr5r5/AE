import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaveImagePage } from './save-image';

@NgModule({
  declarations: [
    SaveImagePage,
  ],
  imports: [
    IonicPageModule.forChild(SaveImagePage),
  ],
})
export class SaveImagePageModule {}
