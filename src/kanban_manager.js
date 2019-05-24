/**App Data Manager */
class KanbanManager {
    constructor(kanbanTasks = []) {
        if (kanbanTasks.length === 0) {
            this.columns = 0;
            this.addColumn();
            this.columnArray = [];
            this.cardsArray = [];
            this.columnsData = {};
        }
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
        let card_id = parseInt(id.split('_')[1]);
        let index = this.columnsData[num].indexOf(card_id);
        if (!this.columnsData[num]) this.columnsData[num] = [];
        this.columnsData[num].splice(index, 1);
    }

    appendColumnCard(id, columnId, position) {
        let num = parseInt(columnId.split('_')[1]);
        let card_id = parseInt(id.split('_')[1]);
        let index = position;
        if (!this.columnsData[num]) this.columnsData[num] = [];
        this.columnsData[num].splice(index, 0, card_id);

    }

    saveColumn(name) {
        this.columnArray.push(name);
        this.writeLocal();
        return `column_${this.columnArray.length}`;
    }

    addColumn() {
        let columnButtonElement = window.strings.column_element.t();
        document.getElementById('columnBox').innerHTML += columnButtonElement;
        let column_element = document.getElementsByClassName("column");
        column_element = column_element[column_element.length - 1];

        column_element.addEventListener('click', () => {

            removeElement(column_element.getElementsByClassName('grey-text-color')[0]);
            let cardContainer = column_element.getElementsByClassName('column-container')[0];
            cardContainer.innerHTML += window.strings.card_container_body.t();
            this.addColumn();
        }, {once: true});



    }
}
