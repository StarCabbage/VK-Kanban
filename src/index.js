/**Global Values */
window.absoluteCard = null;
window.highlight = false;
window.lastMouseOverElement = null;
window.timerTimeOut = null;
let initialX = 0;
let initialY = 0;
let xOff = 0;
let yOff = 0;

/**Listeners */

//Mouse Listeners
function mousemoveWindowListener(event) {
    if (window.absoluteCard) {
        let eventDoc, doc, body;
        console.log(window.lastHighlight);

        event = event || window.event;

        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        initialX = event.pageX;
        initialY = event.pageY;

        let trash = false;
        let overElement = document.elementFromPoint(initialX, initialY);
        if (overElement.closest('.task-block')) {
            overElement = overElement.closest('.task-block');
        } else if (overElement.closest('.column') && overElement.closest('.column').id) {
            overElement = overElement.closest('.column');
        } else if (overElement.closest('.absolute-trash')) {
            overElement = null;
            trash = true;
            window.absoluteCard.classList.add('absolute-half-visible-card');
        } else {
            overElement = null;
        }
        if (!trash && window.absoluteCard.classList.contains('absolute-half-visible-card')) window.absoluteCard.classList.remove('absolute-half-visible-card');

        window.absoluteCard.style.top = `${event.pageY - yOff}px`;
        window.absoluteCard.style.left = `${event.pageX - xOff}px`;

        if (overElement) {
            if (window.lastMouseOverElement) {
                if (window.lastMouseOverElement !== overElement) {
                    removeHighlight();
                    window.lastMouseOverElement = overElement;
                    addHighlight();
                }
            } else {
                window.lastMouseOverElement = overElement;
                addHighlight();
            }
        } else {
            if (window.lastMouseOverElement) {
                removeHighlight();
                window.lastMouseOverElement = null;
            }
        }

    }
}

function mousedownLocalListener(event) {
    event.preventDefault();
    if (event.button === 0 && (event.metaKey || event.ctrlKey)) {
        window.timeOut = false;
        if (window.timerTimeOut) {
            clearTimeout(window.timerTimeOut);
        }
        window.timerTimeOut = setTimeout(function () {
            window.timeOut = true;
        }, 400);
        if (event.target.classList.contains('selectable-card')) {
            event.target.classList.remove('selectable-card');
        }

        if (event.type === "touchstart") {
            initialX = event.touches[0].clientX;
            initialY = event.touches[0].clientY;
        } else {
            initialX = event.clientX;
            initialY = event.clientY;
        }

        window.touchedElement = event.target.closest('.task-block');

        window.touchCard = event.target;

        let cloneNode = event.target.cloneNode(true);
        cloneNode.classList.add('absolute-card');

        cloneNode.removeAttribute('onmouseover');
        cloneNode.removeAttribute('onmousedown');

        cloneNode.style.height = `${event.target.offsetHeight - 20}px`;
        cloneNode.style.width = `${event.target.offsetWidth - 20}px`;

        cloneNode.classList.add('nice-font');

        window.event = null;

        xOff = event.offsetX;
        yOff = event.offsetY;

        document.body.appendChild(cloneNode);

        if (yOff > 80) {
            yOff = 75;
        }

        cloneNode.style.left = `${initialX - xOff}px`;
        cloneNode.style.top = `${initialY - yOff}px`;

        window.absoluteCard = cloneNode;
        document.getElementsByClassName('absolute-trash')[0].classList.add('transform-trash');
        event.target.classList.add('invisible-card');

    } else {
        if (!event.target.classList.contains('selectable-card')) {
            event.target.classList.add('selectable-card');
        } else {
            event.target.classList.remove('selectable-card');
        }
        selectText(event.target);
    }
}

function mouseupWindowListener(event) {
    if (window.absoluteCard) {
        window.absoluteCard.classList.add('absolute-invisible-card');
        document.body.style.pointerEvents = "none";

        let highlightCards = document.getElementsByClassName('highlight-card');

        if (event.target.closest('.absolute-trash')) {
            let touchedElement = document.getElementById(window.touchedElement.id);
            let oldColumnId = touchedElement.closest('.column').id;
            console.log(oldColumnId + " " + touchedElement.id);
            window.kanbanManager.removeColumnCard(touchedElement.id, oldColumnId);
            removeElement(touchedElement);
        } else {
            if (highlightCards.length !== 0 && window.timeOut) {
                let localTouchedElement = document.getElementById(window.touchedElement.id);
                let cloneNode = localTouchedElement.cloneNode(true);
                let oldColumnId = localTouchedElement.closest('.column').id;
                removeElement(localTouchedElement);
                let xColumn = highlightCards[0].closest('.column');
                let listPossibleHighlights = xColumn.getElementsByClassName('place-to-insert');
                let count = 0;
                let position = -1;
                for (let element of listPossibleHighlights) {
                    if (element !== highlightCards[0]) {
                        count += 1;
                    } else {
                        position = count;
                        break;
                    }
                }
                let cardsList = xColumn.getElementsByClassName('cards-list')[0];
                cloneNode.getElementsByClassName('white-card')[0].classList.remove('invisible-card');
                if (position === -1) {
                    cardsList.appendChild(cloneNode);
                    cardsList.scrollTo(0, 9999);
                    window.kanbanManager.moveColumnCard(cloneNode.id, oldColumnId, xColumn.id, count + 1);
                } else {
                    let xTaskBlocks = xColumn.getElementsByClassName('task-block');
                    cardsList.insertBefore(cloneNode, xTaskBlocks[position]);
                    window.kanbanManager.moveColumnCard(cloneNode.id, oldColumnId, xColumn.id, position);
                }


            } else {


                document.getElementById(window.touchedElement.id).getElementsByClassName('white-card')[0].classList.remove('invisible-card'); //это из-за веселого бага)))
                window.touchCard.classList.remove('invisible-card');


            }
        }

        removeHighlight();
        let absoluteCard = window.absoluteCard;
        window.absoluteCard = null;
        document.getElementsByClassName('absolute-trash')[0].classList.remove('transform-trash');
        setTimeout(function () {


            removeElement(absoluteCard);

            window.lastMouseOverElement = null;
            window.touchCard = null;
            window.touchedElement = null;
            window.absoluteCard = null;
            document.body.style.pointerEvents = "auto";
        }, 200);
    }
}

//Others Listeners
function closeColumn(event) {

    removeElement(event.closest('.column'));

}

function closeTaskInput(event) {
    let cardContainer = event.closest('.column-container');
    removeElement(event.closest('.input-block'));
    cardContainer.appendChild(createElementFromHTML(window.strings.cardContainerBodyDelete.t()));
}

function saveTaskName(event) {

    if (!event.shiftKey && event.keyCode === 13 || !event.type.localeCompare('click')) {


        let column = event.target.closest('.column');
        let input = column.getElementsByClassName('textarea')[0];
        let title = input.value;

        title.replace(/^\s*\n/gm, "");
        if (isStringEmpty(title)) {
            title = "";

            input.value = "";
        }


        if (title !== "") {
            let id = kanbanManager.saveColumnCard(title, column.id);
            let cardContainer = event.target.closest('.column-container');
            let inputBlock = cardContainer.getElementsByClassName('input-block')[0];
            removeElement(inputBlock);
            let cardsList = cardContainer.getElementsByClassName('cards-list')[0];
            cardsList.classList.remove('card-list-with-input');
            cardsList.appendChild(createElementFromHTML(window.strings.cardBody.t(id, title)));

            cardContainer.appendChild(createElementFromHTML(window.strings.oneMoreCardPart.t()));


            cardContainer.getElementsByClassName('cards-list')[0].scrollTo({
                top: 9999,
                left: 0,
                behavior: 'smooth'
            });
        } else {
            alert('Заполните поле');
        }
    }
}

function saveColumnName(event) {
    if (!event.shiftKey && event.keyCode === 13 || !event.type.localeCompare('click')) {
        let column = event.target.closest('.column');

        let input = column.getElementsByClassName('textarea')[0];
        let title = input.value;

        title.replace(/^\s*\n/gm, "");
        if (isStringEmpty(title)) {
            title = "";

            input.value = "";
        }

        if (title !== "") {
            event.target.closest('.column').id = kanbanManager.saveColumn(title);
            if (title.length > 65) {
                title = title.substring(0, 60) + "...";
            }
            column.getElementsByClassName('column-container')[0].innerHTML = window.strings.columnName.t(title);
        } else {
            alert("Заполните поле")
        }
    }
}

function openTaskInput(event) {
    let cardContainer = event.closest('.column-container');
    removeElement(event);
    let cardsList = cardContainer.getElementsByClassName('cards-list')[0];
    cardsList.classList.add('card-list-with-input');
    cardContainer.appendChild(createElementFromHTML(window.strings.cardContainerBodyInputState.t()));
}

/**App initiation */
window.onload = function () {
    initPage();
};


/**Usual functions: Take it and done it*/


function removeHighlight() {
    if (window.lastHighlight) {
        if (window.lastHighlight.element.classList.contains('removable')) {
            removeElement(window.lastHighlight.element);
        } else {
            window.lastHighlight.element.style.height = '0';
            window.lastHighlight.element.classList.remove('highlight-card');
        }
    }
    window.lastHighlight = null;
}

function addHighlight() {
    window.lastHighlight = {};
    if (window.lastMouseOverElement.classList.contains('column')) {


        let cardsList = window.lastMouseOverElement.getElementsByClassName('cards-list')[0];
        cardsList.appendChild(createElementFromHTML(window.strings.removableHighlight.t()));

        cardsList.getElementsByClassName('removable')[0].style.height = `${window.absoluteCard.offsetHeight - 20}px`;
        window.lastHighlight.element = cardsList.getElementsByClassName('removable')[0];
        cardsList.scrollTo(0, 9999);


    } else {

        let placeToInsert = window.lastMouseOverElement.getElementsByClassName('place-to-insert')[0];
        placeToInsert.classList.add('highlight-card');
        placeToInsert.style.height = `${window.absoluteCard.offsetHeight - 20}px`;
        placeToInsert.closest('.cards-list').scrollTo(0, placeToInsert.offsetTop - 100);
        window.lastHighlight.element = placeToInsert;

    }


    window.lastHighlight.offsetTop = window.lastMouseOverElement.offsetTop;
    window.lastHighlight.offsetHeight = window.lastMouseOverElement.offsetHeight;
    window.lastHighlight.offsetLeft = window.lastMouseOverElement.offsetLeft;
    window.lastHighlight.offsetWidth = window.lastMouseOverElement.offsetWidth;

}

function selectText(node) {


    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}

function setBackground(image, xCenter, yCenter) {
    document.body.style.background = `url('${image}') ${xCenter} ${yCenter} no-repeat fixed`;
}

function removeElement(elementId) {

    let element = elementId;
    if (typeof elementId !== typeof (null)) {
        element = document.getElementById(elementId);
    }
    element.parentNode.removeChild(element);
}

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function isStringEmpty(str) {
    return (!str || /^\s*$/.test(str));
}

function autoExpand(field) {
    field.style.height = 'inherit';
    let computed = window.getComputedStyle(field);
    let height = parseInt(computed.getPropertyValue('border-top-width'), 10) +
        parseInt(computed.getPropertyValue('padding-top'), 10) +
        field.scrollHeight +
        parseInt(computed.getPropertyValue('padding-bottom'), 10) +
        parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';
}


// Эта функция инициирует приложение
function initPage() {
    //Устанавливаем фон приложения
    setBackground(window.strings.backgroundPath.t(), '20%', '60%');

    //Инициируем глобальные листнеры
    document.addEventListener('input', function (event) {
        if (event.target.tagName.toLowerCase() !== 'textarea') return;
        autoExpand(event.target);
    }, false);
    window.kanbanManager = new KanbanManager();
    document.onmousemove = mousemoveWindowListener;
    document.onmouseup = mouseupWindowListener;

}