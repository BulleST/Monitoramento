import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Grafico, Node } from '../model/servico.model';
import { Crypto } from '../utils/crypto';

@Injectable({
    providedIn: 'root'
})
export class GraficoService {

    graficoData: BehaviorSubject<Grafico> = new BehaviorSubject<Grafico>(new Grafico);
    nodes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

	nodeObjectSelected: BehaviorSubject<Node | undefined>;
    public nodeSelected: Observable<Node | undefined>;

    constructor(
        private http: HttpClient,
        private crypto: Crypto,
    ) { 
		this.nodeObjectSelected = new BehaviorSubject<Node | undefined>(undefined);
		this.nodeSelected = this.nodeObjectSelected.asObservable();
    }

    public get object()  {
        var e = localStorage.getItem('node') as string;
        if (e && e.trim()) {
            this.setObject(this.crypto.decrypt(e) as Node)
        }
        return this.nodeObjectSelected.value;
    }

    setObject(value: Node | undefined) {
        localStorage.setItem('node', this.crypto.encrypt(value) ?? '')
        this.nodeObjectSelected.next(value);
    }

    getGrafico() {
        return this.http.get<Grafico>('/assets/data.json')
        .pipe(map(grafico => {
            this.graficoData.next(grafico)
            return grafico;
        }));
    }
}
