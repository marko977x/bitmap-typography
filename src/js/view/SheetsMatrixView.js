import { execute } from "../executor";
import { sheetsMatrixControl } from "../services/sheetMatrixServices";
import { fromEvent, range } from "rxjs";
import { filter, map } from "rxjs/operators";

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
        let matrix = this.state.sheetsMatrix;
        range(0, matrix.rows).pipe(
            map(row => this.createRow(row))
        ).subscribe(rowContainer => {
            range(0, matrix.columns).pipe(
                filter(column => this.isMatrixFull(parseInt(rowContainer.id), column))
            ).subscribe(column => {
                this.createSheet(rowContainer, column);
            })
        });
    }

    createRow(id) {
        const row = document.createElement("div");
        row.className = "sheet-row";
        row.id = id;
        this.container.appendChild(row);
        return row;
    }

    isMatrixFull(row, column) {
        return row * this.state.sheetsMatrix.columns + column + 1
            <= this.state.sheetsMatrix.count;
    }

    createSheet(container, id) {
        const sheet = document.createElement("div");
        sheet.className = "sheet";
        sheet.id = id;

        this.onMouseAction(sheet, { event: 'mouseenter', action: "setHoveredSheet" },
            ({ row: parseInt(container.id), column: id }));
        this.onMouseAction(sheet, { event: 'mouseleave', action: "clearHoveredSheet" },
            ({ row: parseInt(container.id), column: id }));
        this.onMouseAction(sheet, { event: 'click', action: "setOpenedSheet" },
            ({ row: parseInt(container.id), column: id }));

        container.appendChild(sheet);
        return sheet;
    }

    onMouseAction(sheet, command, params) {
        fromEvent(sheet, command.event).pipe(
            filter(() => this.state.appIsLoaded)
        ).subscribe(() => {
            execute(sheetsMatrixControl, {
                action: command.action,
                parameters: [this.state, params.row, params.column]
            });
        });
    }
}