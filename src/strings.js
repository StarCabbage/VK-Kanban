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

    removable_highlight: new Word(`<div style=" margin-bottom: 8px;" class="removable norm-card"></div>`),
    column_name: new Word(`<div class="selectable" style="    font-weight: 800;
     padding-bottom: 5px;">
            %
        </div><div onmouseover="mouseover_listener(event)" class="cards_list card-list-normal" >


        </div><div class="grey-text-color" onmouseover="mouseover_listener(event)" onclick="openTaskInput(this)" style="display: flex;  font-weight: 400;
    align-items: center;"><i class="material-icons" style="padding-right: 5px;">
            add
        </i>
            <div>Добавить ещё одну карточку</div>
        </div>`),
    column_element: new Word(`<div class="card button column">
                                        <div class="card-container selectable nice-font">
                                            <div class="grey-text-color" style="display: flex;  font-weight: 400;
    align-items: center;"><i class="material-icons" style="padding-right: 5px;">
                                                                                        add
                                                                                     </i>
                                                  <div>Добавить ещё одну колонку</div>
                                            </div>
                                            </div>
                                        </div>`),
    card_container_body: new Word(`<div class="white-card" style="color: grey;

    font-weight: 300;">
  <textarea type="text" class="textarea" id="inp" placeholder="Введите название колонки" onkeyup="saveColumnName(event)" style="


"></textarea>
                </div><div class="grey-text-color" style="display: flex;  font-weight: 400; justify-content: space-between;
    align-items: center;">

                <div class="green-flat-button save_column_name" onclick="saveColumnName(event)">Добавить колонку</div>
                <i class="material-icons close_column" onclick="closeColumn(this);" style="padding-right: 5px;">
                    close
                </i>

            </div>`),
    card_container_body_delete: new Word(`<div class="grey-text-color" onclick="openTaskInput(this)" style="display: flex;  font-weight: 400;
    align-items: center;"><i class="material-icons" style="padding-right: 5px;">
            add
        </i>
            <div >Добавить ещё одну карточку</div>
        </div>`),
    card_body: new Word(`<div id="card_%"  onmouseover="mouseover_listener(event)"  class="task-block">
        <div class="place-to-insert">

        </div>
        <div  onmousedown="dragStart(event)"  class=" white-card">
            %
        </div>

    </div>`),
    one_more_card_part: new Word( `<div class="grey-text-color" onmouseover="mouseover_listener(event)" onclick="openTaskInput(this)" style="display: flex;  font-weight: 400;
    align-items: center;"><i class="material-icons" style="padding-right: 5px;">
            add
        </i>
            <div>Добавить ещё одну карточку</div>
        </div>`),
    card_container_body_input_state: new Word( `<div class="input_block">
                <div class="white-card" style="color: grey;

    font-weight: 300;">
  <textarea type="text" class="textarea" id="inp" onkeyup="saveTaskName(event)" placeholder="Введите название карточки" style="


"></textarea>
                </div>





            <div class="grey-text-color" style="display: flex;  font-weight: 400; justify-content: space-between;
    align-items: center;">

                <div class="green-flat-button save_column_name" onclick="saveTaskName(event)">Добавить карточку</div>
                <i class="material-icons close_column" onclick="closeTaskInput(this);" style="padding-right: 5px;">
                    close
                </i>

            </div></div>`),

};