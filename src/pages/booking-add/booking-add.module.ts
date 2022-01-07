import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingAddPage } from './booking-add';
import { CalendarModule } from 'ionic3-calendar-en';


@NgModule({
  declarations: [
    BookingAddPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingAddPage),
    CalendarModule,
  ],
})
export class BookingAddPageModule {}
