/*
 * @Author: Fellon 
 * @Date: 2022-01-16 23:09:15 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 23:09:15 
 */
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { DataService } from "./Data.service";
import { SelectorsService } from "./Selectors.service";

@Injectable()
export class RichTextService {

    private _focus$ = new BehaviorSubject<boolean>(false);

    get focus$(): Observable<boolean> {
        return this._focus$.asObservable();
    }

    constructor(
        private selectorsService: SelectorsService,
        private dataService: DataService,
    ) {}

    focus(state: boolean = false): void {
        this._focus$.next(state);
    }
}