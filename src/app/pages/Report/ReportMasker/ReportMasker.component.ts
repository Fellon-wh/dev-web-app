/*
 * @Author: Fellon 
 * @Date: 2022-01-16 21:38:58 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 21:38:58 
 */
import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'report-masker',
    templateUrl: './ReportMasker.component.html',
    host: {
        class: 'report-mask',
    },
})
export class ReportMaskerComponent implements OnInit {
    
    ngOnInit(): void {
        
    }
}