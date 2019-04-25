import { execute } from "../executor";
import { sheetsMatrixControl } from "../services/sheetMatrixServices";
import { fromEvent, range } from "rxjs";
import { filter, switchMap, map } from "rxjs/operators";
import { appStateStream$ } from "../app";
import { SheetMatrixActions } from "../data/actions";

export class SheetsMatrixView {

    constructor() {
        this.container = document.querySelector(".sheets-container");
        
        appStateStream$.pipe(
            filter(appState => !appState.appIsLoaded),
            switchMap(state => {
                this.state = state;
                this.container.innerHTML = "";
                return range(0, state.sheetsMatrix.count).pipe(
                    map(index => this.createSheet(index))
                )
            })).subscribe();
    }

    createSheet(id) {
        const sheet = document.createElement("div");
        sheet.className = "sheet";
        sheet.id = id;

        this.onMouseAction(sheet, { event: 'mouseenter', action: SheetMatrixActions.SET_HOVERED_SHEET });
        this.onMouseAction(sheet, { event: 'mouseleave', action: SheetMatrixActions.CLEAR_HOVERED_SHEET });
        this.onMouseAction(sheet, { event: 'click', action: SheetMatrixActions.SET_OPENED_SHEET });

        this.container.appendChild(sheet);
        return sheet;
    }

    onMouseAction(sheet, command) {
        fromEvent(sheet, command.event).pipe(
            filter(() => this.state.appIsLoaded)
        ).subscribe(() => {
            execute(sheetsMatrixControl, {
                action: command.action,
                parameters: [this.state, parseInt(sheet.id)]
            });
        });
    }
}