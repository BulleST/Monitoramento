import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Crypto } from './crypto';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgxMaskApplierService } from 'ngx-mask';
import { Column, MaskType } from './column.interface';
import { TableLink } from './table-links.interface';

@Injectable({
    providedIn: 'root'
})
export class Table {

    loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    selectedItems: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    selected: BehaviorSubject<any | undefined> = new BehaviorSubject<any | undefined>(undefined);

    constructor(
        private toastr: ToastrService,
        private crypto: Crypto,
        private currency: CurrencyPipe,
        private mask: NgxMaskApplierService,
        private datePipe: DatePipe,
    ) {
    }

    initialize() {
        this.resetSelection();
    }

    resetSelection() {
        this.selected.next(undefined)
        this.fecharMenuTable();
        this.selectedItems.next([]);
    }

    onRowSelect(event: any) {
        let row: any = event.data;
        if (row != undefined) {
            this.selected.next(row);
            let index = this.selectedItems.value.findIndex(n => n.id == row.id);
            if (index == -1) {
                let selectedItems = this.selectedItems.value;
                selectedItems.push(row);
                this.selectedItems.next(selectedItems);
            }
            this.exibirMenuTable();
        }
    }

    onRowUnselect(event: any) {
        let selectedItems = this.selectedItems.value;
        if (event.data) {
            let row = event.data;
            let index = this.selectedItems.value.findIndex(n => n.id == row.id);
            if (index != -1) {
                selectedItems.splice(index, 1);
                this.selectedItems.next(selectedItems);
            }
        }
        if (selectedItems.length > 0) {
            this.selected.next(selectedItems[selectedItems.length - 1]);
            this.exibirMenuTable();
        }
        else {
            this.selected.next(undefined)
            this.fecharMenuTable();
        }
    }

    onAllRowToggle(event: any) {
        if (event.checked == false) {
            this.selectedItems.next([]);
            this.selected.next(undefined);
        }
        this.fecharMenuTable();
    }

    fecharMenuTable() {
        $('.actions__nav').css({
            'display': 'none',
            'opacity': 0,
            'visibility': 'hidden',
        });
    }


    exibirMenuTable() {
      setTimeout(() => {
        let tr = $('tr.selected'); 
        if (tr) {
            let td = $(tr).find('.td-actions');
            if (td) {
                let top = ($(td).offset()?.top ?? 0);
                let left = ($(td).offset()?.left ?? 0);
                $('.actions__nav').css({
                    'display': 'flex',
                    'top': top + 'px',
                    'left': left + 'px',
                    'opacity': 1,
                    'visibility': 'visible',
                });
            }
        }
      }, 10);
    }

    
    getCellData(row: any, col: Column): any {
        const nestedProperties: string[] = col.field.split('.');
        let value: any = row;
        for (const prop of nestedProperties) {
            value = value[prop];
        }
        if (col.maskType && value != undefined && value.toString().trim() != '') {
            if (col.maskType == MaskType.percentage) {
                value = this.currency.transform(value.toString(), 'BRL', '', col.decimal) + '%';
            } else if (col.maskType == MaskType.money) {
                value = this.currency.transform(value, 'BRL', col.moeda, col.decimal)
            } else if (col.maskType == MaskType.cnpj) {
                value = this.mask.applyMask(value.toString().padStart(14, '0'), '00.000.000/0000-00');
            } else if (col.maskType == MaskType.cpf) {
                value = this.mask.applyMask(value.toString().padStart(11, '0'), '000.000.000-00');
            } else if (col.maskType == MaskType.rg) {
                value = this.mask.applyMask(value.toString().padStart(9, '0'), '00.000.000-0');
            } else if (col.maskType == MaskType.any && col.mask) {
                value = this.mask.applyMask(value, col.mask);
            } else if (col.maskType == MaskType.date) {
                value = this.datePipe.transform(value, 'dd/MM/yyyy', 'UTC');
                
            } else if (col.maskType == MaskType.dateTime) {

            } else {
                return value ?? '-';
            }
        }
        return value ?? '-';
    }

    encryptParams(tableLinks: TableLink[]) {
        return tableLinks.map(link => {
            if (link.paramsFieldName != undefined && link.paramsFieldName.length) {
                var paramnsMap = link.paramsFieldName.map(p => {
                    return this.crypto.encrypt(this.selected.value[p]) ?? '';
                })
                link.fullRoute = [].concat(link.routePath as never[], paramnsMap as never[])
            } else {
                link.fullRoute = link.routePath;
            }
            return link;
        });
    }


}
