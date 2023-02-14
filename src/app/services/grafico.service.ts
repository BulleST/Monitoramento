import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Grafico } from '../model/servico.model';

@Injectable({
    providedIn: 'root'
})
export class GraficoService {

    graficoData: BehaviorSubject<Grafico> = new BehaviorSubject<Grafico>(new Grafico);
    nodeSelected: BehaviorSubject<Grafico | undefined> = new BehaviorSubject<Grafico | undefined>(undefined);

    constructor(
        private http: HttpClient,
    ) { }

    getGrafico() {
        return this.http.get<Grafico>('/assets/data.json')
        .pipe(map(grafico => {
            this.graficoData.next(grafico)
            return grafico;
        }));
    }
}
