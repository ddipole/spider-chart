import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonsModule, ImageCardModule } from 'nextsapien-component-lib';

@NgModule({
  declarations: [],
  imports: [CommonModule, ButtonsModule, ImageCardModule],
  exports: [ButtonsModule, ImageCardModule],
})
export class EssentialsModule {}
