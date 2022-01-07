import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyticketPage } from './myticket';

@NgModule({
  declarations: [
    MyticketPage,
  ],
  imports: [
    IonicPageModule.forChild(MyticketPage),
  ],
})
export class MyticketPageModule {}
