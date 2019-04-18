import { AppState } from "./data/AppState";
import { BehaviorSubject } from "rxjs";
import { SheetsMatrix } from "./view/sheetsMatrix";
import { Sheet } from "./view/Sheet";

const appState = new AppState();
export const stream = new BehaviorSubject(appState);

new SheetsMatrix(stream);
new Sheet(stream);