import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailfeedPage } from './detailfeed';

import { PipesModule } from '../../pipes/pipes.module';
import {AutosizeModule} from 'ngx-autosize';

@NgModule({
  declarations: [
    DetailfeedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DetailfeedPage),
    AutosizeModule
  ],
})
export class DetailfeedPageModule {}
