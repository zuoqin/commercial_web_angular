import { Component,Input,Output,EventEmitter,HostListener } from '@angular/core';

@Component({
    selector:"columns-filter",
    templateUrl:"./columns-filter.component.html",
    styleUrls:['./columns-filter.component.scss']
})
export class ColumnsFilterComponent{
    columnSelectShow:boolean = false;
    columnsCopy;
    @Input() columns;
    @Output() onSelectedColumns: EventEmitter<any> = new EventEmitter<any>();

    @HostListener('document:click', ['$event'])

  


    documentClick(event): void {
        if(!event.target.closest(".popup-form")){
            this.columnSelectShow = false;
        }
    }
    selectAllColumns(event,columns){
        if(event.target.checked){
            columns.map(item=>item.active=true)
        }else{
            columns.map(item=>item.active=false)
        }
    }

    showColumnsSelect(){
        this.columnsCopy = JSON.parse(JSON.stringify(this.columns))
        this.columnSelectShow = true;
    }
    closeColumnsSelect(){
        this.columnSelectShow = false;
    }
    saveColumnsSelect(){
        this.closeColumnsSelect()
        this.columns = JSON.parse(JSON.stringify(this.columnsCopy))
        this.onSelectedColumns.emit(this.columns)
    } 
 
}