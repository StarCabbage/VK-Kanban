/** Useful class for strings manage and strings array*/
class Word {
    constructor(text) {
        this.text = text;
    }

    t() {
        let args = [...arguments], i = 0;
        return this.text.replace(/%/g, () => {
            if (i + 1 <= args.length) {
                return args[i++]
            } else {
                return '';
            }
        });
    }
}


window.strings = {
    /**Usual strings */
    backgroundPath: new Word('background.png'),
    addCard: new Word('Добавить ещё одну карточку'),

    /**HTML strings */
    removable_highlight: new Word(`<div class="removable highlight-card"></div>`),
    column_name: new Word(`<div class="selectable-area column-header">
            %
        </div><div class="cards-list" >


        </div><div class="column-grey-footer" onclick="openTaskInput(this)"><i class="material-icons column-icon">
            add
        </i>
            <div>Добавить ещё одну карточку</div>
        </div>`),
    column_element: new Word(`<div class="column column-main-font button column">
                                        <div class="column-container selectable-area">
                                            <div class="column-grey-footer"><i class="material-icons column-icon">
                                                                                        add
                                                                                     </i>
                                                  <div>Добавить ещё одну колонку</div>
                                            </div>
                                            </div>
                                        </div>`),
    card_container_body: new Word(`<div><div class="white-card">
  <textarea type="text" class="textarea" placeholder="Введите название колонки" onkeyup="saveColumnName(event)"></textarea>
                </div><div class="column-grey-footer green-column-footer">

                <div class="green-flat-button save_column_name" onclick="saveColumnName(event)">Добавить колонку</div>
                <i class="material-icons close_column column-icon" onclick="closeColumn(this);">
                    close
                </i>

            </div></div>`),
    card_container_body_delete: new Word(`<div class="column-grey-footer" onclick="openTaskInput(this)"><i class="material-icons column-icon">
            add
        </i>
            <div >Добавить ещё одну карточку</div>
        </div>`),
    card_body: new Word(`<div id="card_%" class="task-block">
        <div class="place-to-insert">

        </div>
        <div onmousedown="mousedownLocalListener(event)" class="white-card">
            %
        </div>

    </div>`),
    one_more_card_part: new Word( `<div class="column-grey-footer" onclick="openTaskInput(this)"><i class="material-icons column-icon">
            add
        </i>
            <div>Добавить ещё одну карточку</div>
        </div>`),
    card_container_body_input_state: new Word( `<div class="input_block">
                <div class="white-card">
  <textarea type="text" class="textarea" onkeyup="saveTaskName(event)" placeholder="Введите название карточки"></textarea>
                </div>





            <div class="column-grey-footer green-column-footer">

                <div class="green-flat-button save_column_name" onclick="saveTaskName(event)">Добавить карточку</div>
                <i class="material-icons close_column column-icon" onclick="closeTaskInput(this);">
                    close
                </i>

            </div></div>`),
    column_ready_pattern: new Word(`<div id="column_%" class="column column-main-font button"><div class="column-container selectable-area">
<div class="column-header selectable-area">%</div>
<div class="cards-list">%</div>
<div class="column-grey-footer" onclick="openTaskInput(this)"><i class="material-icons column-icon">add</i><div>Добавить ещё одну карточку</div></div>
</div></div>`),
    card_ready_pattern: new Word(`<div id="card_%" class="task-block"><div class="place-to-insert"></div><div onmousedown="mousedownLocalListener(event)" class="white-card">%</div></div>`)

};