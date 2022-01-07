import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingExplorePage } from './booking-explore';

@NgModule({
  declarations: [
    BookingExplorePage,
  ],
  imports: [
    IonicPageModule.forChild(BookingExplorePage),
  ],
})
export class BookingExplorePageModule {}
