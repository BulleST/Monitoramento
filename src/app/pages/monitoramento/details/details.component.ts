import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheckCircle, faInfo, faInfoCircle, faTimes, faTimesCircle, faTriangleExclamation, faWarning } from '@fortawesome/free-solid-svg-icons';
import { Node } from 'src/app/model/servico.model';
import { GraficoService } from 'src/app/services/grafico.service';
import { Crypto } from 'src/app/utils/crypto';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
    faTimes = faTimes;
    faCheckCircle = faCheckCircle;
    faTimesCircle = faTimesCircle;
    faTriangleExclamation = faTriangleExclamation;
    faInfoCircle = faInfoCircle;
    animation = false;
    node: Node = new Node;
    origin: string = '';
    constructor(
        private crypto: Crypto,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private graficoService: GraficoService,
    ) {

        this.origin = environment.originUrl;
        this.node = this.graficoService.object as Node;
        activatedRoute.params.subscribe(p => {
            if (p['id'] && this.crypto.decrypt(p['id'])) {
                this.graficoService.nodeSelected.subscribe(res => {
                    if (!res) {
                        this.voltar();
                    } else {
                        this.node = res;
                        this.node.dependents = this.node.dependents ?? [];
                        this.node.dependsOn = this.node.dependsOn ?? [];
                        this.node.statusItems = this.node.statusItems ?? [];
                        setTimeout(() => {
                            this.animation = true;
                        }, 300);
                    }
                });
            } else {
                this.voltar();
            }
        });
    }

    ngOnInit(): void {

    }

    voltar() {
        this.animation = false;
        setTimeout(() => {
            this.router.navigate(['monitoramento']);
        }, 300);
    }

    selectNode(node: any) {
        var n = this.graficoService.graficoData.value?.nodes.find(x => x.id == node.id);
        console.log(n)
        if (n)
            this.graficoService.setObject(node);
    }

}
