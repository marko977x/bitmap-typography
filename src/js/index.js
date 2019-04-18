import { AppState } from "./data/AppState";
import { BehaviorSubject } from "rxjs";
import { SheetsMatrixView } from "./view/SheetsMatrixView";
import { SheetView } from "./view/SheetView";

const appState = new AppState();
export const stream = new BehaviorSubject(appState);

new SheetsMatrixView(stream);
new SheetView(stream);