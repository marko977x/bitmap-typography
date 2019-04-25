import { partition } from "rxjs/operators";
import { CLICKED_CELL_COLOR, DEFAULT_CELL_COLOR } from "../data/constants";
import { range, from } from "rxjs";

export class SheetView {

    constructor(appStateStream$) {
        const stream = appStateStream$.pipe(
            partition(state => !state.appIsLoaded));

        const renderApp = stream[0];
        const updateSheets = stream[1];

        renderApp.subscribe(state => {
            this.state = state;
            this.render();
        });

        updateSheets.subscribe(state => {
            this.updateSheets(state)
        });
    }

    render() {
        from(document.querySelectorAll(".sheet")).subscribe(
            sheet => this.createCells(sheet));
    }

    createCells(sheet) {
        range(0, this.state.sheet.count).subscribe(cellId => {
            this.createCell(sheet, cellId);
        });
    }

    createCell(container, id) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = id;
        cell.style.width = 100 / this.state.sheet.columns + '%';
        container.appendChild(cell);
    }

    updateSheets(state) {
        from(document.querySelectorAll(".sheet")).subscribe(sheet => {
            this.updateSheet(state, sheet);
        });
    }

    updateSheet(state, sheet) {
        from(sheet.childNodes).subscribe(cell => {
            this.updateCell(state, sheet, cell);
        });
    }

    updateCell(state, sheet, cell) {
        const cellData = state.getCell(parseInt(sheet.id), parseInt(cell.id));
        cell.style.backgroundColor = cellData.isColored ?
            CLICKED_CELL_COLOR : DEFAULT_CELL_COLOR;
    }
}
