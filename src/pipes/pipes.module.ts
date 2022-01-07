import { NgModule } from '@angular/core';
import { ImageCommentPipe } from './image-comment/image-comment';
import { TimeCommentPipe } from './time-comment/time-comment';
import { CDVPhotoLibraryPipe } from './cdv-photo-library/cdv-photo-library';
@NgModule({
	declarations: [ImageCommentPipe,
    TimeCommentPipe,
    CDVPhotoLibraryPipe],
	imports: [],
	exports: [ImageCommentPipe,
    TimeCommentPipe,
    CDVPhotoLibraryPipe]
})
export class PipesModule {}
