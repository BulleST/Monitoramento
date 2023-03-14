import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from '../app.routing';
import { AppComponent } from '../app.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../parts/header/header.component';
import { FooterComponent } from '../parts/footer/footer.component';
import { NavigationComponent } from '../parts/navigation/navigation.component';
import { MonitoramentoComponent } from '../pages/monitoramento/monitoramento.component';
import { DetailsComponent } from '../pages/monitoramento/details/details.component';
import { LoadingComponent } from './loading/loading.component';
import { NodeFilterPipe } from '../utils/node-filter.pipe';
import { HighlightDirective } from '../utils/highlight.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';

@NgModule({
    declarations: [
        LoadingComponent,
        TableComponent,
    ],
    imports: [
        CommonModule,
        
    ],
    exports: [
        LoadingComponent,
        TableComponent,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class SharedModule { }
