/**App Data Manager */
class KanbanManager {
    constructor(kanbanTasks = []) {
        if (window.localStorage.getItem('data')) {
            let data = JSON.parse(window.localStorage.getItem('data'));
            this.openTasks(data);
        } else {
            if (kanbanTasks.length === 0) {
                this.columns = 0;
                this.addColumn();
                this.columnArray = [];
                this.cardsArray = [];
                this.columnsData = {};
            }
        }
    }
    static isObjectEmpty(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    openTasks(data) {
        this.cardsArray = data.cardsArray;
        this.columnArray = data.columnArray;
        this.columnsData = data.columnsData;
        this.columns = data.columns;
        let columnsBody = document.getElementById('columnBox');
        for (let i = 0, length = this.columnArray.length; i < length; i++) {
            let cardsList = "";
            if (!KanbanManager.isObjectEmpty(this.columnsData)) {
                for (let j = 0, j_length = this.columnsData[i].length; j < j_length; j++) {
                    cardsList += window.strings.cardReadyPattern.t(this.columnsData[i][j], this.cardsArray[this.columnsData[i][j]]);
                }
            }
            let column = window.strings.columnReadyRattern.t(i, this.columnArray[i], cardsList);
            columnsBody.innerHTML += column;
        }
        let columnButtonElement = window.strings.columnElement.t();
        columnsBody.appendChild(createElementFromHTML(columnButtonElement));
        let columnElement = document.getElementsByClassName("column");
        columnElement = columnElement[columnElement.length - 1];

        columnElement.addEventListener('click', () => {

            removeElement(columnElement.getElementsByClassName('column-grey-footer')[0]);
            let cardContainer = columnElement.getElementsByClassName('column-container')[0];
            cardContainer.appendChild(createElementFromHTML(window.strings.cardContainerBody.t()));
            this.addColumn();
        }, {
            once: true
        });
    }

    writeLocal() {

        window.localStorage.setItem('data', JSON.stringify({
            columns: this.columns,
            columnArray: this.columnArray,
            cardsArray: this.cardsArray,
            columnsData: this.columnsData
        }))
    }

    saveColumnCard(name, columnId) {
        this.cardsArray.push(name);
        let cardId = this.cardsArray.length - 1;
        let num = parseInt(columnId.split('_')[1]);

        if (!this.columnsData[num]) this.columnsData[num] = [];
        this.columnsData[num].push(cardId);
        this.writeLocal();
        return cardId;
    }

    moveColumnCard(id, oldColumnId, newColumnId, newPosition) {
        this.removeColumnCard(id, oldColumnId);
        this.appendColumnCard(id, newColumnId, newPosition);

        this.writeLocal();
    }

    removeColumnCard(id, columnId) {
        let num = parseInt(columnId.split('_')[1]);
        let cardId = parseInt(id.split('_')[1]);
        let index = this.columnsData[num].indexOf(cardId);
        if (!this.columnsData[num]) this.columnsData[num] = [];
        this.columnsData[num].splice(index, 1);
        this.writeLocal();
    }

    appendColumnCard(id, columnId, position) {
        let num = parseInt(columnId.split('_')[1]);
        let cardId = parseInt(id.split('_')[1]);
        let index = position;
        if (!this.columnsData[num]) this.columnsData[num] = [];
        this.columnsData[num].splice(index, 0, cardId);

    }

    saveColumn(name) {
        this.columnArray.push(name);
        this.writeLocal();
        return `column_${this.columnArray.length - 1}`;
    }

    addColumn() {
        let columnButtonElement = window.strings.columnElement.t();
        document.getElementById('columnBox').appendChild(createElementFromHTML(columnButtonElement));
        let columnElement = document.getElementsByClassName("column");
        columnElement = columnElement[columnElement.length - 1];

        columnElement.addEventListener('click', () => {

            removeElement(columnElement.getElementsByClassName('column-grey-footer')[0]);
            let cardContainer = columnElement.getElementsByClassName('column-container')[0];
            cardContainer.appendChild(createElementFromHTML(window.strings.cardContainerBody.t()));
            this.addColumn();
        }, {
            once: true
        });


    }
}