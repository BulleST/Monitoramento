import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './pages/monitoramento/details/details.component';
import { MonitoramentoComponent } from './pages/monitoramento/monitoramento.component';

const routes: Routes = [
    { path: '', redirectTo: 'monitoramento', pathMatch: 'full'},
    { path: 'monitoramento', component: MonitoramentoComponent, children: [
        { path: ':id', component: DetailsComponent }
    ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
