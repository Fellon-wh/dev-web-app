import { Component, HostListener, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { RootScope } from "./RootScope";

@Component({
    selector: 'root-scope',
    templateUrl: './RootScope.component.html',
})
export class RootScopeComponent implements OnInit {

    constructor(public rootScope: RootScope) {
    }
    
    ngOnInit(): void {
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event: BeforeUnloadEvent) {
        if (environment.production) { // 让你进你再进来
            return false;
        }

        return true;
    }

}