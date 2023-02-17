import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './pages/monitoramento/details/details.component';
import { MonitoramentoComponent } from './pages/monitoramento/monitoramento.component';

const monitoramento = () => import('./pages/monitoramento/monitoramento.module').then(x => x.MonitoramentoModule);

const routes: Routes = [
    { path: '', redirectTo: 'monitoramento', pathMatch: 'full'},
    { path: 'monitoramento', loadChildren: monitoramento }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
