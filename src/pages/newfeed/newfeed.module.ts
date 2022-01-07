import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsfeedPage } from './newfeed';
import { InViewportModule,  } from 'ng-in-viewport';



@NgModule({
  declarations: [
    NewsfeedPage,   
  ],
  imports: [
    IonicPageModule.forChild(NewsfeedPage),
    InViewportModule
  ],
})
export class NewsfeedPageModule {}
