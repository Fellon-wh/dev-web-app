import { NgModule } from "@angular/core";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";

@NgModule({
    exports: [
        NzLayoutModule,
        NzMenuModule,
        NzIconModule,
    ],
})
export class NgZorroAntdModule {}