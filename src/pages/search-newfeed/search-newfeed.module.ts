import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchNewfeedPage } from './search-newfeed';

@NgModule({
  declarations: [
    SearchNewfeedPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchNewfeedPage),
  ],
})
export class SearchNewfeedPageModule {}
