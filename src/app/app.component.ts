
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Grafico, Node } from './model/servico.model';
import ForceGraph3D from '3d-force-graph';
import { GraficoService } from './services/grafico.service';
import * as THREE from 'three'
import SpriteText from 'three-spritetext';
import {CSS2DRenderer, CSS2DObject} from 'three-css2drender-types';
import * as $ from 'jquery';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    graph = ForceGraph3D();
    data: Grafico = new Grafico;
    loading = true;
    constructor(
        private graficoService: GraficoService
    ) {
        this.graficoService.graficoData.subscribe(res => {
            this.data = res;
            this.setGrafico();
        });
        this.graficoService.getGrafico().subscribe();
    }
    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
        this.loading = false;
        this.setGrafico();  
    }


    @HostListener('window:resize', ['$event'])
    setGrafico(){
        if (!this.loading) {
            this.graph = ForceGraph3D({
                controlType: 'orbit',
            })(document.getElementById('3d-graph') as HTMLElement)
            .graphData(this.data)
            .backgroundColor('#141414')
            .width(window.innerWidth)
            .nodeLabel('name')
            // Esfera
            .nodeThreeObject((node: any) => {
                let color:string = '';
                if (node.status == 'ok')
                    color = '#27ff00';
                else if (node.status == 'warning')
                    color = '#fff700';
                else if (node.status == 'danger')
                    color = '#ff0000';
                else
                    color = '#27ff00';
                const geometry = new THREE.SphereGeometry( );
                const material = new THREE.MeshBasicMaterial( { 
                    color: color
                } );
                const sphere = new THREE.Mesh( geometry, material );
                sphere.scale.set(node.val, node.val, node.val);
                return sphere;
            })
            .linkDirectionalArrowLength(3)
            .linkDirectionalArrowRelPos(1)
            .linkCurvature(0.15)
            .onNodeClick((node: any) => {
                this.focusNode(node);
                this.selectedNode(node)
            })
            .onNodeDragEnd((node: any) => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
            })
            .onBackgroundClick((event: any) => {
                console.log(event)
                this.graph.zoomToFit(3000,150,node => true);
                this.selectedNode(undefined)
            });
            this.graph.d3Force('link')?.['distance']((link: any) => {
                let value = (link.source.val*10 + link.target.val*10) / 3;
                return value;
            });
        }
    }

    focusNode(node: any) {
        // Aim at node from outside it
        const distance = 300;
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

    selectedNode(node: any) {
        this.graficoService.setObject(node);
    }
    
}
// .nodeColor((node: any) => {
//     if (node.status == 'ok')
//         return '#27ff00';
//     else if (node.status == 'warning')
//         return '#fff700';
//     else if (node.status == 'danger')
//         return '#ff0000';
//     else
//         return '#27ff00';
// })
        // HTML
        // .nodeThreeObject((node: any): any => {
        //     let color: string = '#fff';
        //     if (node.status == 'ok') color = '#27ff00';
        //     else if (node.status == 'warning') color = '#fff700';
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
        //         color = '#27ff00';
        //     else if (node.status == 'warning')
        //         color = '#fff700';
        //     else if (node.status == 'danger')
        //         color = '#ff0000';
        //     else
        //         color = '#27ff00';
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
        //     let color: string = '#27ff00';
        //     if (node.status == 'ok') color = '#27ff00';
        //     else if (node.status == 'warning') color = '#fff700';
        //     else if (node.status == 'danger') color = '#ff0000';
        //     const sprite = new SpriteText(node.name);
        //     sprite.material.depthWrite = false; // make sprite background transparent
        //     sprite.color = color;
        //     sprite.textHeight = 8;
        //     return sprite;
        // })
        
        