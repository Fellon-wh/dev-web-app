import { NgModule } from "@angular/core";
import { RootScope } from "./RootScope";
import { RootScopeComponent } from "./RootScope.component";
import { RootScopeRoutingModule } from "./RootScope.routing";

@NgModule({
    imports: [RootScopeRoutingModule],
    declarations: [RootScopeComponent],
    exports: [RootScopeComponent],
})
export class RootScopeModule {
    constructor(private rootScope: RootScope) {
        rootScope.userName = "userName";
        rootScope.password = "password";
        console.log(rootScope);
    }
}