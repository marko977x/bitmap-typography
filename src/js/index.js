import { AppState } from "./data/AppState";
import { BehaviorSubject } from "rxjs";
import { SheetsMatrix } from "./view/sheetsMatrix";

const appState = new AppState();
export const stream = new BehaviorSubject(appState);

new SheetsMatrix(stream);

const button = document.querySelector(".btn-primary");
button.onclick = () => {
    stream.next(appState);
    console.log("Click");
}