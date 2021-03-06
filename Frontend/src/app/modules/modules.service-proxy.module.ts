import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AbpHttpInterceptor } from "abp-ng2-module/dist/src/abpHttpInterceptor";
import * as ApiServiceProxies from "../../shared/service-proxies/service-proxies";

@NgModule({
    providers: [
        ApiServiceProxies.Group6XeServiceProxy,
        ApiServiceProxies.Group4LoaiXeServiceProxy,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AbpHttpInterceptor,
            multi: true,
        },
    ],
})
export class ModulesServiceProxyModule { }
