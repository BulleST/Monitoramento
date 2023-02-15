import { AfterViewChecked, AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three'
import SpriteText from 'three-spritetext';
import {CSS2DRenderer, CSS2DObject} from 'three-css2drender-types';
import * as $ from 'jquery';
import { Grafico, Node } from 'src/app/model/servico.model';
import { GraficoService } from 'src/app/services/grafico.service';
import { Router } from '@angular/router';
import { Crypto } from 'src/app/utils/crypto';
declare var d3: any;
@Component({
  selector: 'app-monitoramento',
  templateUrl: './monitoramento.component.html',
  styleUrls: ['./monitoramento.component.css']
})
export class MonitoramentoComponent implements OnInit, AfterViewInit {
    graph: any;
    data: Grafico = new Grafico;
    dataStatusDanger: Node[] = [];
    loading = true;
    nodes: any[] = [];
    constructor(
        private graficoService: GraficoService,
        private router: Router,
        private crypto: Crypto,
    ) {
        this.graficoService.nodeSelected.subscribe(node => {
            if (!this.loading) {
                if (node) {
                    this.selectedNode(node);
                } else {
                    this.nodeFocusOut();
                }
            }
        })
    }
    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
        this.graficoService.getGrafico().subscribe();
        this.graficoService.graficoData.subscribe(res => {
            this.data = res;
            this.dataStatusDanger = res.nodes.filter(x => x.status == 'danger')
            this.setGrafico('init');
            this.loading = false;
        });
    }


    @HostListener('window:resize', ['$event'])
    setGrafico(oi :string){
        if (!this.loading && window && document.getElementById('3d-graph') ) {
            this.graph = ForceGraph3D({
                controlType: 'orbit',
            });
            
            this.graph(document.getElementById('3d-graph') as HTMLElement)
            .graphData(this.data)
            .showNavInfo(true)
            .backgroundColor('#ffffff00')
            .width(window.innerWidth)
            .nodeLabel('name')
            // Logo
            .nodeThreeObject((node: any) => {
                if (!this.nodes.find(x => x.id == node.id)) 
                    this.nodes.push(node)

                const imgTexture = new THREE.TextureLoader()
                .load(`./assets/img/${node.type}-${node.status}.png`);
                const material = new THREE.SpriteMaterial({ 
                    map: imgTexture,
                    fog: true
                 });
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(node.val, node.val, node.val);
                return sprite;
            })
            .linkDirectionalArrowLength(7)
            .linkDirectionalArrowRelPos(1)
            .linkCurvature(0.15)
            .onNodeClick((node: any) => {
                this.graficoService.setObject(node);
                let index = this.nodes.findIndex(x => x.id == node.id);
                this.nodes.splice(index, 1, node)
                this.graficoService.nodes.next(this.nodes)
            })
            .onNodeDragEnd((node: any) => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;

                let index = this.nodes.findIndex(x => x.id == node.id);
                this.nodes.splice(index, 1, node)
                this.graficoService.nodes.next(this.nodes)
            })
            .onBackgroundClick((event: any) => {
                this.graficoService.setObject(undefined);
                
            });
            // this.graph.d3Force('link')?.['distance']((link: any) => {
            //     let value = (link.source.val*10 + link.target.val*10) / 3;
            //     return value;
            // });

            

            this.graph.zoomToFit(3000, 0, (node: any) => true);
            console.log(this.nodes)
            this.graficoService.nodes.next(this.nodes)
        }

    }

    nodeFocus(node: any) {
        console.log(node)
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        const newPos = node.x || node.y || node.z
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)
        this.graph.cameraPosition(
            newPos, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
        );
    }

    nodeFocusOut() {
        this.graph.zoomToFit(3000, 0, (node: any) => true);
        this.router.navigate(['monitoramento']);
    }

    selectedNode(node: any) {
        this.nodeFocus(node);
        this.router.navigate(['monitoramento', this.crypto.encrypt(node.id)]);
    }
    
}

// Esfera
            // .nodeThreeObject((node: any) => {
            //     if (!this.nodes.find(x => x.id == node.id)) {
            //         this.nodes.push(node)
            //     }
            //     let color:string = '#fff';
            //     if (node.status == 'ok') color = '#008000';
            //     else if (node.status == 'warning') color = '#ffa500';
            //     else if (node.status == 'danger') color = '#ff0000';

            //     const geometry = new THREE.SphereGeometry( );
            //     const material = new THREE.MeshBasicMaterial( { 
            //         color: color
            //     } );
            //     const sphere = new THREE.Mesh( geometry, material );
            //     sphere.scale.set(node.val, node.val, node.val);
            //     return sphere;
            // })
// .nodeColor((node: any) => {
//     if (node.status == 'ok')
//         return '#008000';
//     else if (node.status == 'warning')
//         return '#ffa500';
//     else if (node.status == 'danger')
//         return '#ff0000';
//     else
//         return '#008000';
// })
        // HTML
        // .nodeThreeObject((node: any): any => {
        //     let color: string = '#fff';
        //     if (node.status == 'ok') color = '#008000';
        //     else if (node.status == 'warning') color = '#ffa500';
        //     else if (node.status == 'danger') color = '#ff0000';
        //     const nodeEl = document.createElement('div');
        //     nodeEl.className = 'node';
        //     $(nodeEl).append(`
        //         <div class="status" style="border-radius: 50%;
        //                                 width: ${node.val}px;
        //                                 height: ${node.val}px;
        //                                 background-color: ${color};"></div>
        //         <div class="text" style="font-size: 16px">${node.name}</div>
        //     `);
        //     $(nodeEl).css({
        //         'width': node.val + 'px',
        //         'height': node.val + 'px',
        //     })
        //     return new CSS2DObject(nodeEl);
        // })

        // Esfera
        // .nodeThreeObject((node: any) => {
        //     let color:string = '';
        //     if (node.status == 'ok')
        //         color = '#008000';
        //     else if (node.status == 'warning')
        //         color = '#ffa500';
        //     else if (node.status == 'danger')
        //         color = '#ff0000';
        //     else
        //         color = '#008000';
        //     const geometry = new THREE.SphereGeometry( );
        //     const material = new THREE.MeshBasicMaterial( { 
        //         color: color
        //     } );
        //     const sphere = new THREE.Mesh( geometry, material );
        //     sphere.scale.set(10, 10, 10);
        //     return sphere;
        // })

        // Logo
        // .nodeThreeObject((node: any) => {
        //     const imgTexture = new THREE.TextureLoader().load(`./assets/img/${node.img}`);
        //     console.log(imgTexture)
        //     const material = new THREE.SpriteMaterial({ map: imgTexture });
        //     const sprite = new THREE.Sprite(material);
        //     sprite.scale.set(10, 10, 10);
        //     return sprite;
        // })

        // Texto
        // .nodeThreeObject((node: any) => {
        //     let color: string = '#008000';
        //     if (node.status == 'ok') color = '#008000';
        //     else if (node.status == 'warning') color = '#ffa500';
        //     else if (node.status == 'danger') color = '#ff0000';
        //     const sprite = new SpriteText(node.name);
        //     sprite.material.depthWrite = false; // make sprite background transparent
        //     sprite.color = color;
        //     sprite.textHeight = 8;
        //     return sprite;
        // })
        
        