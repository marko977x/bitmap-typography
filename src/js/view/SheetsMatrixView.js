import { execute } from "../executor";
import { sheetsMatrixControl } from "../services/sheetMatrixServices";
import { fromEvent, range } from "rxjs";
import { filter } from "rxjs/operators";

export class SheetsMatrixView {

    constructor(appStateStream$, appState) {
        this.container = document.querySelector(".sheets-container");
        this.state = appState;

        appStateStream$.pipe(
            filter(appState => !appState.appIsLoaded)
        ).subscribe(appState => {
            this.state = appState;
            this.render();
        });
    }

    render() {
        this.container.innerHTML = "";
        range(0, this.state.sheetsMatrix.count).subscribe(index => {
            this.createSheet(index);
        });
    }

    createSheet(id) {
        const sheet = document.createElement("div");
        sheet.className = "sheet";
        sheet.id = id;

        this.onMouseAction(sheet, { event: 'mouseenter', action: "setHoveredSheet" });
        this.onMouseAction(sheet, { event: 'mouseleave', action: "clearHoveredSheet" });
        this.onMouseAction(sheet, { event: 'click', action: "setOpenedSheet" });

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