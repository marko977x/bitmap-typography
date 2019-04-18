import { map, filter } from "rxjs/operators";
import { merge } from "rxjs";

export class SheetView {

    constructor(appStateStream) {
        this.letterWindow = document.querySelector(".letter-window");

        this.handleHoveringOverSheet(appStateStream);
    }

    handleHoveringOverSheet(appStateStream) {
        const hoveredLetter = appStateStream.pipe(
            filter(state => state.hoveredSheet.row != -1),
            map((state) => {
                const sheet = state.hoveredSheet;
                return state.sheetsMatrix.sheets[
                    sheet.row * state.sheetsMatrix.columns + sheet.column].letter;
            }));

        const noHoveredLetter = appStateStream.pipe(
            filter(state => state.hoveredSheet.row == -1),
            map(() => ""));

        merge(hoveredLetter, noHoveredLetter).subscribe(
            value => this.setLetterWindow(value));
    }

    setLetterWindow(value) {
        this.letterWindow.innerHTML = value;
    }
}
