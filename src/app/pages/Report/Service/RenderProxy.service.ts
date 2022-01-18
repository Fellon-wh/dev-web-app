import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

type RenderType = 'all' | 'body';

@Injectable()
export class RenderProxyService {

    private _shouldRender$ = new BehaviorSubject<{ type: RenderType }>({ type: 'all' });

    get shouldRender$(): Observable<{ type: RenderType }> {
        return this._shouldRender$.asObservable();
    }

    render(type: RenderType): void {
        this._shouldRender$.next({ type });
    }
}