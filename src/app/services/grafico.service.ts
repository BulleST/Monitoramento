import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, HostListener, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as THREE from 'three';
import { Grafico, Node } from '../model/servico.model';
import { Crypto } from '../utils/crypto';

@Injectable({
    providedIn: 'root'
})
export class GraficoService {

    graficoData: BehaviorSubject<Grafico | undefined> = new BehaviorSubject<Grafico | undefined>(undefined);
    loadingData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    nodes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    private _nodeSelected: BehaviorSubject<Node | undefined>;
    public nodeSelected: Observable<Node | undefined>;
    
    constructor(
        private http: HttpClient,
        private crypto: Crypto,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this._nodeSelected = new BehaviorSubject<Node | undefined>(undefined);
        this.nodeSelected = this._nodeSelected.asObservable();

        this.nodes.subscribe(res => {
            var grafico = this.graficoData.value;
            if (grafico && res && res.length > 0) {
                grafico.nodes = res as Node[] || undefined;
                this.graficoData.next(grafico);
            }
        })
    }

    public get nodeSelectedObject(): Node | undefined {
        if (!this._nodeSelected.value) {
            var e = localStorage.getItem('node') as string;
            if (e && e.trim()) {
                var node = this.crypto.decrypt(e);
                this._nodeSelected.next(node);
            }
        }
        return this._nodeSelected.value;
    }

    setObject(value: Node | undefined) {
        console.log('setObject', value)
        localStorage.setItem('node', this.crypto.encrypt(value) ?? '')
        this._nodeSelected.next(value);
    }

    getGrafico() {
        this.loadingData.next(true);
        return this.http.get<Grafico>(environment.originUrl + '/assets/data.json')
            .pipe(map(grafico => {
                grafico = new Grafico(grafico.nodes);
                this.graficoData.next(grafico)
                this.loadingData.next(false);
                return grafico;
            }));
    }

    



}
