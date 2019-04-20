import { AppState } from "./data/AppState";
import { BehaviorSubject } from "rxjs";
import { SheetsMatrixView } from "./view/SheetsMatrixView";
import { SheetView } from "./view/SheetView";
import { SheetOverlayView } from "./view/SheetOverlayView";

const appState = new AppState();
export const appStateStream$ = new BehaviorSubject(appState);

new SheetsMatrixView(appStateStream$, appState);
new SheetView(appStateStream$);
new SheetOverlayView(appStateStream$);