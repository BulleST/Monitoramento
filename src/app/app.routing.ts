import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './pages/monitoramento/details/details.component';
import { MonitoramentoComponent } from './pages/monitoramento/monitoramento.component';

const database = () => import('./pages/database/database.module').then(x => x.DatabaseModule);
const rpas = () => import('./pages/rpas/rpas.module').then(x => x.RpasModule);
const services = () => import('./pages/services/services.module').then(x => x.ServicesModule);
const vms = () => import('./pages/vms/vms.module').then(x => x.VmsModule);
const webservices = () => import('./pages/webservices/webservices.module').then(x => x.WebservicesModule);
const monitoramento = () => import('./pages/monitoramento/monitoramento.module').then(x => x.MonitoramentoModule);
const disk = () => import('./pages/disk/disk.module').then(x => x.DiskModule);

const routes: Routes = [
    { path: '', redirectTo: 'monitoramento', pathMatch: 'full'},
    { path: 'database', loadChildren: database },
    { path: 'monitoramento', loadChildren: monitoramento },
    { path: 'rpas', loadChildren: rpas },
    { path: 'webservices', loadChildren: webservices },
    { path: 'vms', loadChildren: vms },
    { path: 'services', loadChildren: services },
    { path: 'disk', loadChildren: disk },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
