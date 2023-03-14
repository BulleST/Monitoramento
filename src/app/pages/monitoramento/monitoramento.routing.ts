import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { MonitoramentoComponent } from './monitoramento.component';

const routes: Routes = [
    { path: '', component: MonitoramentoComponent, children: [
        { path: ':id', component: DetailsComponent }
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoramentoRoutingModule { }
