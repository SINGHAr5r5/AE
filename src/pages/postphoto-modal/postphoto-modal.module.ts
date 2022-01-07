import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostphotoModalPage } from './postphoto-modal';

@NgModule({
  declarations: [
    PostphotoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PostphotoModalPage),
  ],
})
export class PostphotoModalPageModule {}
