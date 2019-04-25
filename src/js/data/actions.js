export const AppActions = {
  ON_LOAD_WINDOW: "onLoadWindow"
}

export const SheetMatrixActions = {
  SET_HOVERED_SHEET: "setHoveredSheet",
  CLEAR_HOVERED_SHEET: "clearHoveredSheet",
  SET_OPENED_SHEET: "setOpenedSheet"
}

export const SidebarActions = {
  ON_CLICK_START_TYPING: "onClickStartTyping",
  RESET_ALL_CELLS_COLOR: "resetAllCellsColor"
}

export const SheetOverlayActions = {
  CHANGE_CELL_COLOR: "changeCellColor",
  HIDE_SHEET_OVERLAY: "hideSheetOverlay",
  RESET_CELLS_COLOR: "resetCellsColor",
  SHOW_NEXT_SHEET: "showNextSheet",
  SHOW_PREVIOUS_SHEET: "showPreviousSheet"
}

export const TypingOverlayActions = {
  ADD_LETTER: "addLetter",
  REMOVE_LAST_LETTER: "removeLastLetter",
  HIDE_OVERLAY: "hideOverlay"
}