import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RootScopeComponent } from "./RootScope.component";

const routes: Routes = [
    { path: '', component: RootScopeComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RootScopeRoutingModule {

}