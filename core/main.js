const $_ = document.querySelector.bind(document);
const $__ = document.querySelectorAll.bind(document);
const openSheetButton = $__('[data-toggle="sheet"]');
let sheetHeight,sheetContents,draggableArea,sheet_current;
const setSheetHeight = (value) => {
    sheetHeight = Math.max(0, Math.min(100, value))
    if(!sheetContents) return;
        sheetContents.style.height = `${sheetHeight}vh`;
        sheetContents.classList.toggle("fullscreen",sheetHeight === 100);
}
const setIsSheetShown = (selector,value) => {
    $_(selector).setAttribute("aria-hidden", String(!value))
}
openSheetButton.forEach(elm => {
    let selector = elm.dataset.target;
    let sheet = $_(selector);
    let height = sheet.dataset.height || 50;
    elm.addEventListener("click", () => {
        sheet_current = selector;
        sheetContents = $_(selector).querySelector('.contents');
        draggableArea = $_(selector).querySelector('.draggable-area');
        draggableArea.addEventListener("mousedown", onDragStart);
        draggableArea.addEventListener("touchstart", onDragStart);
        setSheetHeight(height);
        setIsSheetShown(selector,true);
    });
    sheet.querySelector(".close-sheet").addEventListener("click", () => {
        setIsSheetShown(selector,false);
    });
    sheet.querySelector(".overlay").addEventListener("click", () => {
        setIsSheetShown(selector,false);
    });
});

const touchPosition = (event) =>
    event.touches ? event.touches[0] : event
let dragPosition;
const onDragStart = (event) => {
    dragPosition = touchPosition(event).pageY;
    sheetContents.classList.add("not-selectable");
    draggableArea.style.cursor = document.body.style.cursor = "grabbing";
}
const onDragMove = (event) => {
    if (dragPosition === undefined) return
    const y = touchPosition(event).pageY
    const deltaY = dragPosition - y
    const deltaHeight = deltaY / window.innerHeight * 100
    setSheetHeight(sheetHeight + deltaHeight)
    dragPosition = y
}
const onDragEnd = () => {
    dragPosition = undefined;
    if(!(sheetContents||draggableArea)) return;
    sheetContents.classList.remove("not-selectable");
    draggableArea.style.cursor = document.body.style.cursor = "";
    sheetHeight < 25 ? setIsSheetShown(sheet_current,false) : setSheetHeight(Math.ceil(sheetHeight/10)*10);
}
window.addEventListener("mousemove", onDragMove);
window.addEventListener("touchmove", onDragMove);
window.addEventListener("mouseup", onDragEnd);
window.addEventListener("touchend", onDragEnd);
