import { map, filter, debounceTime } from "rxjs/operators";
import { fromEvent, merge, interval } from "rxjs";
import { execute } from "../executor";
import { typingOverlayControl } from "../services/typingOverlayServices";
import {
    CLICKED_CELL_COLOR, DEFAULT_CELL_COLOR,
    LETTER_WIDTH_HEIGHT_PX, LOWERCASE_A_ASCII_KEY_CODE, LOWERCASE_Z_ASCII_KEY_CODE,
    BACKSPACE_ASCII_KEY_CODE
} from "../data/constants";
import html2canvas from 'html2canvas';
import { appStateStream$ } from "../app";
import { TypingOverlayActions } from "../data/actions";

const CURSOR_ANIMATION_DURATION = 400;
const TYPING_SPEED = 50;

export class TypingOverlayView {
    constructor() {
        this.typingOverlay = document.querySelector(".typing-overlay");
        this.typingLine = document.querySelector(".to-typing-line");

        this.handleAppStateStream();
        this.handleTypingRendering();
        this.defineButtonsEvents();
    }

    handleAppStateStream() {
        appStateStream$.subscribe(state => this.state = state);

        const displayOverlay = appStateStream$.pipe(
            map(state => state.typingOverlayIsShown));
            
        const insertLetter = appStateStream$.pipe(
            filter(state => state.typedText.count > this.calculateLetters()),
            map(state => state.sheetsMatrix.sheets[state.typedText.lastAddedSheetIndex]));
                
        const removeLetter = appStateStream$.pipe(
            filter(state => state.typedText.count < this.calculateLetters()));

        displayOverlay.subscribe(overlayVisibility => {
            this.displayOverlay(overlayVisibility);
        });

        insertLetter.subscribe(sheet => this.drawLetter(sheet));

        removeLetter.subscribe(() => this.removeLastLetter());

        merge(insertLetter, removeLetter, displayOverlay)
            .subscribe(() => this.updateTextCursorPosition());
    }

    calculateLetters() {
        return document.querySelectorAll(".to-letter").length;
    }

    displayOverlay(overlayVisibility) {
        this.typingOverlay.style.height = overlayVisibility ? '100%' : '0%';
        this.typingLine.innerHTML = overlayVisibility ? this.typingLine.innerHTML : "";
        this.typingOverlay.focus();
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
        this.typingLine.lastChild.previousSibling.remove();
    }

    updateTextCursorPosition() {
        let cursor = document.querySelector(".to-text-cursor");
        if(cursor) cursor.remove();
        cursor = this.drawTextCursor();

        this.animation(cursor);
    }

    drawTextCursor() {
        const cursor = document.createElement("div");
        cursor.className = "to-text-cursor";
        cursor.style.height = LETTER_WIDTH_HEIGHT_PX + 'px';
        this.typingLine.appendChild(cursor);
        return cursor;
    }

    animation(cursor) {
        interval(CURSOR_ANIMATION_DURATION).subscribe(value => {
            cursor.style.opacity = value % 2;
        });
    }

    handleTypingRendering() {
        const keyUp = fromEvent(this.typingOverlay, 'keyup');

        const addLetter = (keyUp).pipe(
            map(event => event.key.charCodeAt(0)),
            filter(code => code >= LOWERCASE_A_ASCII_KEY_CODE &&
                code <= LOWERCASE_Z_ASCII_KEY_CODE),
            debounceTime(TYPING_SPEED),
            map(code => ({ key: code, action: TypingOverlayActions.ADD_LETTER })));

        const removeLetter = (keyUp).pipe(
            map(event => parseInt(event.keyCode)),
            filter(code => code == BACKSPACE_ASCII_KEY_CODE),
            debounceTime(TYPING_SPEED),
            map(code => ({ key: code, action: TypingOverlayActions.REMOVE_LAST_LETTER })));

        merge(addLetter, removeLetter).subscribe(command => {
            execute(typingOverlayControl, {
                action: command.action,
                parameters: [this.state, command.key]
            })
        });
    }

    defineButtonsEvents() {
        fromEvent(document.querySelector(".to-exit-button"), 'click').subscribe(() => {
            execute(typingOverlayControl, {
                action: TypingOverlayActions.HIDE_OVERLAY,
                parameters: [this.state]
            })
        });

        fromEvent(document.querySelector(".to-save-button"), 'click').subscribe(() => {
            html2canvas(this.typingLine).then(canvas => {
                var tmpLink = document.createElement('a');  
                tmpLink.download = 'image.png';  
                tmpLink.href = canvas.toDataURL("image/png");

                document.body.appendChild(tmpLink);
                tmpLink.click();
                document.body.removeChild(tmpLink);
            })
        })
    }
} 