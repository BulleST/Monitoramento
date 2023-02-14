import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as $ from 'jquery';
import { Crypto } from "./crypto";

@Injectable({
    providedIn: 'root'
})
export class Header {
    open = new BehaviorSubject<boolean>(false);
    menuHeaderOpen = new BehaviorSubject<boolean>(false);
    constructor(
        private crypto: Crypto, 
    ) {
    }
    public get aside(): boolean {
        var a = localStorage.getItem('navigation') ? this.crypto.decrypt(localStorage.getItem('navigation')) as boolean : false;
        this.setMenuAside(a);
        return this.open.value;
    }
    toggleMenuAside(): void {
        this.setMenuAside(!this.open.value);
    }
    setMenuAside(value: boolean) {
        var encryted = this.crypto.encrypt(value) ?? '';
        localStorage.setItem('navigation', encryted);
        this.open.next(value);
    }
    toggleMenuHeader(): void {
        this.menuHeaderOpen.next(!this.menuHeaderOpen.value);
    }
    openMenuHeader() {
        this.menuHeaderOpen.next(true);
    }
    closeMenuHeader() {
        this.menuHeaderOpen.next(false);
    }
    clickOut() {
        var classe = this;
        $('body').on('click', function (e) {
            classe.setMenuAside(false);
            classe.closeMenuHeader();
        });
        $('.header__userLogado').on('click', function (e) {
            e.stopPropagation();
        });
        $('.navigation__toggle').on('click', function (e) {
            e.stopPropagation();
        });
        $('.aside').on('click', function (e) {
            e.stopPropagation();
        });
    }
}