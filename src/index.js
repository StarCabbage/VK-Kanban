/**Global Values */
window.absoluteCard = null;
window.highlight = false;
window.last_mouse_over_element = null;
window.timer_time_out = null;


/**Listeners */

function mousemoveWindowListener(event) {

    if (window.absoluteCard) {
        let eventDoc, doc, body;
        console.log(window.last_highlight);


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

        console.log(initialX + " " + initialY);
        console.log(event.clientX + " " + event.clientY);
        console.log(event);

        console.log(document.elementFromPoint(initialX, initialY));
        console.log(document.elementFromPoint(initialX, initialY).closest('.card') || document.elementFromPoint(initialX, initialY).closest('.column'));

        let trash = false;
        let over_element = document.elementFromPoint(initialX, initialY);
        if (over_element.closest('.task-block')) {
            over_element = over_element.closest('.task-block');
        } else if (over_element.closest('.column')) {
            over_element = over_element.closest('.column');
        } else if (over_element.closest('.absolute-trash')) {
            over_element = null;
            trash = true;
            window.absoluteCard.classList.add('absolute-half-visible-card');
        } else {
            over_element = null;
        }
        if (!trash && window.absoluteCard.classList.contains('absolute-half-visible-card')) window.absoluteCard.classList.remove('absolute-half-visible-card');

        window.absoluteCard.style.top = `${event.pageY - yOff}px`;
        window.absoluteCard.style.left = `${event.pageX - xOff}px`;


        if (over_element) {
            if (window.last_mouse_over_element) {
                if (window.last_mouse_over_element !== over_element) {
                    removeHighlight();
                    window.last_mouse_over_element = over_element;
                    addHighlight();
                }
            } else {
                window.last_mouse_over_element = over_element;
                addHighlight();
            }
        } else {
            if (window.last_mouse_over_element) {
                removeHighlight();
                window.last_mouse_over_element = null;
            }
        }

    }
}

function mousedownLocalListener(event) {
    event.preventDefault();
    if (event.button === 0 && (event.metaKey || event.ctrlKey)) {
        window.time_out = false;
        if (window.timer_time_out) {
            clearTimeout(window.timer_time_out);
        }
        window.timer_time_out = setTimeout(function () {
            window.time_out = true;
        }, 400);
        if (event.target.classList.contains('selectable-card')) {
            event.target.classList.remove('selectable-card');
        }

        if (event.type === "touchstart") {
            initialX = event.touches[0].clientX - xOffset;
            initialY = event.touches[0].clientY - yOffset;
        } else {
            initialX = event.clientX - xOffset;
            initialY = event.clientY - yOffset;
        }

        window.touched_element = event.target.closest('.task-block');

        window.touch_card = event.target;

        let clone_node = event.target.cloneNode(true);
        clone_node.classList.add('absolute-card');

        clone_node.removeAttribute('onmouseover');
        clone_node.removeAttribute('onmousedown');
        clone_node.style.height = `${event.target.offsetHeight - 20}px`;
        clone_node.style.width = `${event.target.offsetWidth - 20}px`;
        clone_node.classList.add('nice-font');
        window.event = null;
        xOff = event.offsetX;
        yOff = event.offsetY;

        document.body.appendChild(clone_node);

        if (yOff > 80) {
            yOff = 75;
        }
        clone_node.style.left = `${initialX - xOff}px`;
        clone_node.style.top = `${initialY - yOff}px`;
        window.absoluteCard = clone_node;
        document.getElementsByClassName('absolute-trash')[0].classList.add('transform-trash');

        event.target.classList.add('invisible-card');

        active = true;

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
        let highlight_cards = document.getElementsByClassName('highlight-card');
        if (event.target.closest('.absolute-trash')) {
            let touched_element = document.getElementById(window.touched_element.id);
            let oldColumnId = touched_element.closest('.column').id;
            console.log(oldColumnId+" "+touched_element.id);
            window.kanbanManager.removeColumnCard(touched_element.id, oldColumnId);
            removeElement(touched_element);
        } else {
            if (highlight_cards.length !== 0 && window.time_out) {
                let touched_element = document.getElementById(window.touched_element.id);
                let clone_node = touched_element.cloneNode(true);
                let oldColumnId = touched_element.closest('.column').id;
                removeElement(touched_element);
                let x_column = highlight_cards[0].closest('.column');
                let list_possible_highlights = x_column.getElementsByClassName('place-to-insert');
                let count = 0;
                let position = -1;
                for (let element of list_possible_highlights) {
                    if (element !== highlight_cards[0]) {
                        count += 1;
                    } else {
                        position = count;
                        break;
                    }
                }
                let cards_list = x_column.getElementsByClassName('cards-list')[0];
                clone_node.getElementsByClassName('white-card')[0].classList.remove('invisible-card');
                if (position === -1) {
                    cards_list.appendChild(clone_node);
                    cards_list.scrollTo(0, 9999);
                    window.kanbanManager.moveColumnCard(clone_node.id, oldColumnId, x_column.id, count + 1);
                } else {
                    let x_task_blocks = x_column.getElementsByClassName('task-block');
                    cards_list.insertBefore(clone_node, x_task_blocks[position]);
                    window.kanbanManager.moveColumnCard(clone_node.id, oldColumnId, x_column.id, position);
                }


            } else {


                document.getElementById(window.touched_element.id).getElementsByClassName('white-card')[0].classList.remove('invisible-card'); //это из-за веселого бага)))
                window.touch_card.classList.remove('invisible-card');


            }
        }
        removeHighlight();
        let absoluteCard = window.absoluteCard;
        window.absoluteCard = null;
        document.getElementsByClassName('absolute-trash')[0].classList.remove('transform-trash');
        setTimeout(function () {


            removeElement(absoluteCard);

            window.last_mouse_over_element = null;
            window.touch_card = null;
            window.touched_element = null;
            window.absoluteCard = null;
            document.body.style.pointerEvents = "auto";
        }, 200);


    }
}

/**App initiation */
window.onload = function () {
    initPage();

};


/**Usual functions */



function removeHighlight() {
    if (window.last_highlight) {
        if (window.last_highlight.element.classList.contains('removable')) {
            removeElement(window.last_highlight.element);
        } else {
            window.last_highlight.element.style.height = '0';
            window.last_highlight.element.classList.remove('highlight-card');
        }
    }
    window.last_highlight = null;
}

function addHighlight() {
    window.last_highlight = {};
    if (window.last_mouse_over_element.classList.contains('column')) {


        let cards_list = window.last_mouse_over_element.getElementsByClassName('cards-list')[0];
        cards_list.appendChild(createElementFromHTML(window.strings.removable_highlight.t()));

        cards_list.getElementsByClassName('removable')[0].style.height = `${window.absoluteCard.offsetHeight - 20}px`;
        window.last_highlight.element = cards_list.getElementsByClassName('removable')[0];
        cards_list.scrollTo(0, 9999);


    } else {

        let place_to_insert = window.last_mouse_over_element.getElementsByClassName('place-to-insert')[0];
        place_to_insert.classList.add('highlight-card');
        place_to_insert.style.height = `${window.absoluteCard.offsetHeight - 20}px`;
        place_to_insert.closest('.cards-list').scrollTo(0, place_to_insert.offsetTop - 100);
        window.last_highlight.element = place_to_insert;

    }


    window.last_highlight.offsetTop = window.last_mouse_over_element.offsetTop;
    window.last_highlight.offsetHeight = window.last_mouse_over_element.offsetHeight;
    window.last_highlight.offsetLeft = window.last_mouse_over_element.offsetLeft;
    window.last_highlight.offsetWidth = window.last_mouse_over_element.offsetWidth;

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

function closeColumn(ev) {

    removeElement(ev.closest('.column'));

}

function closeTaskInput(ev) {
    let card_container = ev.closest('.column-container');
    removeElement(ev.closest('.input_block'));
    card_container.appendChild(createElementFromHTML(window.strings.card_container_body_delete.t()));
}

function saveTaskName(ev) {

    if (!ev.shiftKey && ev.keyCode === 13 || !ev.type.localeCompare('click')) {


        let column = ev.target.closest('.column');
        let input = column.getElementsByClassName('textarea')[0];
        let title = input.value;

        title.replace(/^\s*\n/gm, "");
        if (isStringEmpty(title)) {
            title = "";

            input.value = "";
        }


        if (title !== "") {
            let id = kanbanManager.saveColumnCard(title, column.id);
            let card_container = ev.target.closest('.column-container');
            let input_block = card_container.getElementsByClassName('input_block')[0];
            removeElement(input_block);
            let cards_list = card_container.getElementsByClassName('cards-list')[0];
            cards_list.classList.remove('card-list-with-input');
            cards_list.appendChild(createElementFromHTML(window.strings.card_body.t(id, title)));

            card_container.appendChild(createElementFromHTML(window.strings.one_more_card_part.t()));


            card_container.getElementsByClassName('cards-list')[0].scrollTo({
                top: 9999,
                left: 0,
                behavior: 'smooth'
            });
        } else {
            alert('Заполните поле');
        }
    }
}

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function openTaskInput(ev) {
    let card_container = ev.closest('.column-container');
    removeElement(ev);
    let cards_list = card_container.getElementsByClassName('cards-list')[0];
    cards_list.classList.add('card-list-with-input');
    //card_container.innerHTML += window.strings.card_container_body_input_state.t();
    card_container.appendChild(createElementFromHTML(window.strings.card_container_body_input_state.t()));
    //cards-list.closest('.cards-list').scrollTo(0, 5999); //ne rabot
}

function isStringEmpty(str) {
    return (!str || /^\s*$/.test(str));
}

function saveColumnName(ev) {
    if (!ev.shiftKey && ev.keyCode === 13 || !ev.type.localeCompare('click')) {
        let column = ev.target.closest('.column');

        let input = column.getElementsByClassName('textarea')[0];
        let title = input.value;

        title.replace(/^\s*\n/gm, "");
        if (isStringEmpty(title)) {
            title = "";

            input.value = "";
        }

        if (title !== "") {
            ev.target.closest('.column').id = kanbanManager.saveColumn(title);
            if (title.length > 65) {
                title = title.substring(0, 60) + "...";
            }
            column.getElementsByClassName('column-container')[0].innerHTML = window.strings.column_name.t(title);
        } else {
            alert("Заполните поле")
        }
    }
}

function autoExpand(field) {

    field.style.height = 'inherit';


    let computed = window.getComputedStyle(field);


    let height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + parseInt(computed.getPropertyValue('padding-top'), 10)
        + field.scrollHeight
        + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';
}

function autoExpandTextArea() {
    document.addEventListener('input', function (event) {
        if (event.target.tagName.toLowerCase() !== 'textarea') return;
        autoExpand(event.target);
    }, false);
}

function addElement(parentId, elementTag, elementId, html) {

    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    p.appendChild(newElement);
}

// Эта функция инициирует приложение
function initPage() {
    //Устанавливаем фон приложения
    setBackground(window.strings.backgroundPath.t(), '20%', '60%');

    //Инициируем глобальные листнеры
    autoExpandTextArea();
    window.kanbanManager = new KanbanManager();
    document.onmousemove = mousemoveWindowListener;
    document.onmouseup = mouseupWindowListener;

}

let active = false;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let xOff = 0;
let yOff = 0;



































