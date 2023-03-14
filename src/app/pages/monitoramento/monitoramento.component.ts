import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three'
import { Grafico, Link, Node, ServicoTipo } from 'src/app/model/servico.model';
import { GraficoService } from 'src/app/services/grafico.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Crypto } from 'src/app/utils/crypto';
import { environment } from 'src/environments/environment';
import { lastValueFrom, Subscription } from 'rxjs';
import { faTable } from '@fortawesome/free-solid-svg-icons';
@Component({
    selector: 'app-monitoramento',
    templateUrl: './monitoramento.component.html',
    styleUrls: ['./monitoramento.component.css']
})
export class MonitoramentoComponent implements OnInit, AfterViewInit {
    graph = ForceGraph3D({
        controlType: 'orbit',
    })
    faTable = faTable;
    data: Grafico = new Grafico;
    dataStatusDanger: Node[] = [];
    loading = false;
    nodes: any[] = [];
    origin: string = environment.originUrl;

    constructor(
        private graficoService: GraficoService,
        private router: Router,
        private crypto: Crypto,
        private activatedRoute: ActivatedRoute,
    ) {

        this.graficoService.loadingData.subscribe(res => this.loading = res);
        this.graficoService.nodes.subscribe(res => {
            this.nodes = res;
        })
    }

    ngOnInit(): void {
    }

    async ngAfterViewInit(): Promise<void> {
        this.data = await lastValueFrom(this.graficoService.getGrafico());
        this.dataStatusDanger = this.data.nodes.filter(x => x.status == 'danger');
        this.buildGrafico(this.data); 
        this.updateNodesList();
        var nodeSelected = this.graficoService.nodeSelectedObject;
        this.graficoService.nodeSelected.subscribe(res => {
            this.updateNodesList();
            nodeSelected = this.graficoService.nodes.value.find(x => (x.id == res?.id) ?? false);
            if (res && nodeSelected) {
                this.graph = this.graph.enableNodeDrag(false);
                setTimeout(() => {
                    this.nodeFocus(nodeSelected);
                }, 600);
            } else {
                this.nodeFocusOut();
                this.graph = this.graph.enableNodeDrag(true);
            }
        })
    }


    buildGrafico(data: Grafico) {
        let highlightLinks: any[] = [];
        let hoverNode: any = null;
        let opacity = 0.2;
        this.nodes = [];
        this.graph = ForceGraph3D({
            controlType: 'orbit',
        })
        this.graph = this.graph(document.getElementById('3d-graph') as HTMLElement)
            .graphData(data)
            .showNavInfo(true)
            .backgroundColor('#ffffff00')
            .width(window.innerWidth)
            .linkDirectionalArrowLength((link: any) => {
                var has = highlightLinks.filter(x => x.source.id == link.source.id && x.target.id == link.target.id)
                return has.length > 0 ? link.target.val / 2 : link.target.val / 5;
            })
            .linkCurvature(0.30)
            .linkDirectionalArrowRelPos(1)
            .linkDirectionalParticles((link: any) => {
                var has = highlightLinks.filter(x => x.source.id == link.source.id && x.target.id == link.target.id)
                return has.length > 0 ? 4 : 0;
            })
            .linkDirectionalParticleWidth(4)
            .linkWidth((link: any) => {
                var has = highlightLinks.filter(x => x.source.id == link.source.id && x.target.id == link.target.id)
                return has.length > 0 ? 3 : 1;
            })
            .linkColor((link: any) => {
                var has = highlightLinks.filter(x => x.source.id == link.source.id && x.target.id == link.target.id)
                return has.length > 0 ? '#3964a3' : '#ffffff5e';
            })
            .linkOpacity(opacity)
            .nodeLabel('name')
            // Logo
            .nodeThreeObject((node: any) => {
                var status = node.status.toLowerCase();
                var type = ServicoTipo[node.type];
                const imgTexture = new THREE.TextureLoader()
                    .load(`${environment.originUrl}/assets/img/nodes-types-icon/${type}-${status}.png`);
                const material = new THREE.SpriteMaterial({
                    map: imgTexture,
                });
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(node.val, node.val, node.val);
                return sprite;
            })
            .onNodeClick((node: any) => {
                this.updateNodesList();
                this.selectNode(node);
            })
            .onNodeHover((node: any) => {
                highlightLinks = [];
                opacity = 0.2;
                if (node) {
                    data.links.filter((x: any) => x.target.id == node.id || x.source.id == node.id)
                        .forEach((link: any) => {
                            highlightLinks.push(link)
                        });
                    hoverNode = node || null;
                    opacity = 1;
                }
                this.updateHighlight();
            })
            .onLinkHover((link: any) => {
                highlightLinks = [];
                if (link) {
                    highlightLinks.push(link);
                }
                this.updateHighlight();
            })
            .onNodeDragEnd((node: any) => {
                this.updateNodesList();

            })
            .onBackgroundClick((event: any) => {
                console.log('onBackgroundClick')
                this.graficoService.setObject(undefined);
                this.nodeFocusOut();
                this.updateNodesList();
            });

        this.graph.d3Force('link')?.['distance']((link: any) => {
            let value = (link.source.val * 10 + link.target.val * 10) / 3;
            return value;
        });

        this.updateNodesList();
    }

    updateHighlight() {
        this.graph = this.graph
            .linkOpacity(this.graph.linkOpacity())
            .linkWidth(this.graph.linkWidth())
            .linkDirectionalParticles(this.graph.linkDirectionalParticles());
    }

    @HostListener('window:resize', ['$event'])
    updateWidth() {
        this.graph = this.graph.width(window.innerWidth);
    }

    selectNode(node: any) {
        this.graficoService.setObject(node);
        var idEncrypted = this.crypto.encrypt(node.id);
        this.router.navigate(['monitoramento', idEncrypted]);
        this.nodeFocus(node);

    }

    nodeFocus(node: any, distance = 80) {
        node = this.nodes.find(x => x.id == node.id);
       if (node) {
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        const newPos = node.x || node.y || node.z
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)
            
        this.graph = this.graph.cameraPosition(
            newPos, // new position
            node, // lookAt ({ x, y, z })
            2000  // ms transition duration
        );
       }
    }
    
    nodeFocusOut() {
        this.graph = this.graph.zoomToFit(1000, 0, (node: any) => true)
                    .cameraPosition({ z: 600 });
        this.router.navigate(['monitoramento']);
        return this.graph;
    }

    updateNodesList() {
        this.graficoService.nodes.next(this.graph.graphData().nodes); // Update nodes position on model
    }
}
