import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditTagPage } from './edit-tag';

@NgModule({
  declarations: [
    EditTagPage,
  ],
  imports: [
    IonicPageModule.forChild(EditTagPage),
  ],
})
export class EditTagPageModule {}
