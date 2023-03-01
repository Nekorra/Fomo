import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { AddEventComponent } from '../modals/add-event/add-event.component';
import { EventInfoComponent } from '../modals/event-info/event-info.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [
    HomePage, 
    AddEventComponent,
    EventInfoComponent,
  ]
})
export class HomePageModule {}
