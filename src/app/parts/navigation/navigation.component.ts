import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faBars, faMagnifyingGlass,faRightFromBracket,faSolarPanel } from '@fortawesome/free-solid-svg-icons';
import { GraficoService } from 'src/app/services/grafico.service';
import { Crypto } from 'src/app/utils/crypto';
import { Header } from 'src/app/utils/header';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
    faBars = faBars;
    faMagnifyingGlass = faMagnifyingGlass;
    faSolarPanel = faSolarPanel;
    faUser = faUser;
    faRightFromBracket = faArrowRightFromBracket;
    menuOpen: boolean = false;

    search: string = '';
    nodes: any[] = [];

    constructor(
        private header: Header,
        private graficoService: GraficoService,
        private router: Router,
        private crypto: Crypto,
    ) {
        this.menuOpen = this.header.aside;
        this.header.open.subscribe(res => this.menuOpen = res);
        this.graficoService.nodes.subscribe(res => {
            this.nodes = res;
        })
    }

    ngOnInit(): void {
    }

    toggleAside() {
        this.header.toggleMenuAside();
    }

    focusNode(node: any) {
        this.graficoService.setObject(node);
        this.router.navigate(['monitoramento', this.crypto.encrypt(node.id)]);
    }
}
