import { ModuleWithProviders } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";

// 可注入指定的NgModule类型中
@Injectable({ providedIn: "root" })
export class RootScope {

    // @NgModule({})
    // 对NgModule及其相关的providers的包装
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootScope,
            providers: [RootScope]
        };
    }
    
    userName?: string;
    password?: string;
}