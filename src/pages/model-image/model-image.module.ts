import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModelImagePage } from './model-image';
import { CDVPhotoLibraryPipe } from '../../pipes/cdv-photo-library/cdv-photo-library';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [
    ModelImagePage,
  ],
  imports: [
    IonicPageModule.forChild(ModelImagePage),   
    PipesModule
  ],
})
export class ModelImagePageModule {}
