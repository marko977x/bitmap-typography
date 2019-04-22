import { map, filter } from "rxjs/operators";
import { fromEvent, merge } from "rxjs";
import { execute } from "../executor";
import { typingOverlayControl } from "../services/typingOverlayServices";
import {
    CLICKED_CELL_COLOR, DEFAULT_CELL_COLOR,
    LETTER_WIDTH_HEIGHT_PX, LOWERCASE_A_ASCII_KEY_CODE, LOWERCASE_Z_ASCII_KEY_CODE,
    BACKSPACE_ASCII_KEY_CODE
} from "../data/constants";

export class TypingOverlayView {
    constructor(appStateStream$) {
        this.typingOverlay = document.querySelector(".typing-overlay");
        this.typingLine = document.querySelector(".to-typing-line");

        this.handleAppStateStream(appStateStream$);
        this.handleTypingRendering();
        this.defineButtonsEvents();
    }

    handleAppStateStream(appStateStream$) {
        appStateStream$.subscribe(state => this.state = state);

        appStateStream$.pipe(
            map(state => state.typingOverlayIsShown)
        ).subscribe(overlayVisibility => {
            this.displayOverlay(overlayVisibility);
        });

        appStateStream$.pipe(
            filter(state => state.typedText.count > this.typingLine.children.length),
            map(state => state.sheetsMatrix.sheets[state.typedText.lastAddedSheedIndex])
        ).subscribe(sheet => this.drawLetter(sheet));

        appStateStream$.pipe(
            filter(state => state.typedText.count < this.typingLine.children.length)
        ).subscribe(() => this.removeLastLetter());
    }

    displayOverlay(overlayVisibility) {
        this.typingOverlay.style.height = overlayVisibility ? '100%' : '0%';
        this.typingLine.innerHTML = overlayVisibility ? this.typingLine.innerHTML : "";
    }

    drawLetter(sheet) {
        const letter = document.createElement("div");
        letter.className = "to-letter";
        letter.style.height = LETTER_WIDTH_HEIGHT_PX + 'px';
        letter.style.width = LETTER_WIDTH_HEIGHT_PX + 'px';
        sheet.cells.forEach(cell => this.drawCell(letter, cell));

        this.typingLine.appendChild(letter);
    }

    drawCell(container, cellData) {
        const cell = document.createElement("div");
        cell.className = "to-cell";
        cell.style.backgroundColor = cellData.isColored ?
            CLICKED_CELL_COLOR : DEFAULT_CELL_COLOR;
        cell.style.height = 100 / this.state.sheet.rows + '%';
        cell.style.width = 100 / this.state.sheet.columns + '%';

        container.appendChild(cell);
    }

    removeLastLetter() {
        this.typingLine.lastChild.remove();
    }

    handleTypingRendering() {
        const keyDown = fromEvent(this.typingOverlay, 'keydown');
        const keyUp = fromEvent(this.typingOverlay, 'keyup');

        const addLetter = (keyDown, keyUp).pipe(
            map(event => event.key.charCodeAt(0)),
            filter(code => code >= LOWERCASE_A_ASCII_KEY_CODE &&
                code <= LOWERCASE_Z_ASCII_KEY_CODE),
            map(code => ({ key: code, action: "addLetter" })));

        const removeLetter = (keyDown, keyUp).pipe(
            map(event => parseInt(event.keyCode)),
            filter(code => code == BACKSPACE_ASCII_KEY_CODE),
            map(code => ({ key: code, action: "removeLastLetter" })));

        merge(addLetter, removeLetter).subscribe(command => {
            execute(typingOverlayControl, {
                action: command.action,
                parameters: [this.state, command.key]
            })
        });
    }

    defineButtonsEvents() {
        const exitButton = document.querySelector(".to-exit-button");

        fromEvent(exitButton, 'click').subscribe(() => {
            execute(typingOverlayControl, {
                action: "hideOverlay",
                parameters: [this.state]
            })
        });
    }
} 