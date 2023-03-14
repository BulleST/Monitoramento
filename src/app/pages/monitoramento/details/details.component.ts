import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheckCircle, faInfo, faInfoCircle, faMagnifyingGlassPlus, faTimes, faTimesCircle, faTriangleExclamation, faWarning } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { Node, ServicoSubtipo } from 'src/app/model/servico.model';
import { GraficoService } from 'src/app/services/grafico.service';
import { Crypto } from 'src/app/utils/crypto';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {
    faTimes = faTimes;
    faCheckCircle = faCheckCircle;
    faTimesCircle = faTimesCircle;
    faTriangleExclamation = faTriangleExclamation;
    faInfoCircle = faInfoCircle;
    faMagnifyingGlassPlus = faMagnifyingGlassPlus;
    animation = false;
    node: Node = new Node;
    origin: string = '';
    nodeSelectedSubs: Subscription;
    logo?: string;
    constructor(
        private crypto: Crypto,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private graficoService: GraficoService,
    ) {
        this.origin = environment.originUrl;
        let nodeSelected = this.graficoService.nodeSelectedObject;
        
        this.nodeSelectedSubs = this.graficoService.nodeSelected.subscribe(res => {
            let id = this.activatedRoute.snapshot.params['id']
            nodeSelected = this.graficoService.nodes.value.find(x => x.id == res?.id);
            if (id && this.crypto.decrypt(id) && (res || nodeSelected)) {
                    this.node = nodeSelected ?? res ?? new Node;
                    this.node.dependents = this.node.dependents ?? [];
                    this.node.dependsOn = this.node.dependsOn ?? [];
                    this.node.statusItems = this.node.statusItems ?? [];
                    this.logo = this.node.sub_Type ? ServicoSubtipo[this.node.sub_Type] + '.png' : undefined;
                    setTimeout(() => {
                        this.animation = true;
                    }, 300);
            } else {
                this.voltar();
            }
        })
    }

    ngOnInit(): void {

    }
    
    ngOnDestroy(): void {
        this.nodeSelectedSubs.unsubscribe();
    }

    voltar() {
        console.log('voltar')
        this.animation = false;
        setTimeout(() => {
            this.router.navigate(['monitoramento']);
        }, 300);
    }

    sair() {
        this.graficoService.setObject(undefined);
    }

    selectNode(node: any) {
        node = this.graficoService.nodes.value.find(x => x.id == node.id) ?? this.voltar();
        this.graficoService.setObject(node);
        if (node) {
            this.animation = false;
            this.router.navigate(['monitoramento', this.crypto.encrypt(node.id)]);
            setTimeout(() => {
                this.animation = true;
            }, 300);
        }
    }

}
