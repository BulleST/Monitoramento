import { Component, OnInit } from '@angular/core';
import { Header } from 'src/app/utils/header';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

    menuOpen: boolean = false;

    constructor(
        private header: Header
    ) {
        this.menuOpen = this.header.aside;
        this.header.open.subscribe(res => this.menuOpen = res);
    }

    ngOnInit(): void {
    }

    toggleAside() {
        this.header.toggleMenuAside();
    }
}
