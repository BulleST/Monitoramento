import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoramentoRoutingModule } from './monitoramento.routing';
import { MonitoramentoComponent } from './monitoramento.component';
import { DetailsComponent } from './details/details.component';
import { LoadingComponent } from 'src/app/parts/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    MonitoramentoComponent,
    DetailsComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    MonitoramentoRoutingModule,
    FontAwesomeModule,
    FormsModule,
  ]
})
export class MonitoramentoModule { }
