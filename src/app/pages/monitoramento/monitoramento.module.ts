import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoramentoRoutingModule } from './monitoramento.routing';
import { MonitoramentoComponent } from './monitoramento.component';
import { DetailsComponent } from './details/details.component';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover-config';


@NgModule({
    declarations: [
        MonitoramentoComponent,
        DetailsComponent,
    ],
    imports: [
        CommonModule,
        MonitoramentoRoutingModule,
        FontAwesomeModule,
        FormsModule,
        SharedModule,
        NgbPopoverModule,
        NgbModule,
    ]
})
export class MonitoramentoModule { }
