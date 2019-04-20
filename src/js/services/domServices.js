export function createDiv(data) {
    const div = document.createElement(data.tag);
    div.className = data.className;
    div.style.height = data.height;
    div.id = data.id;
    data.container.appendChild(div);
    return div;
}


// createDiv({
//     tag: "div",
//     className: "so-cell-row d-flex justify-content-center",
//     height: 100 / this.state.sheet.columns + '%',
//     id: column,
//     container: row
// });