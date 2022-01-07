import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostphotoPage } from './postphoto';

@NgModule({
  declarations: [
    PostphotoPage,
  ],
  imports: [
    IonicPageModule.forChild(PostphotoPage),
  ],
})
export class PostphotoPageModule {}
