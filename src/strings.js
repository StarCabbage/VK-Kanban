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
    removableHighlight: new Word(`
<div class="removable highlight-card"></div>
`),
    columnName: new Word(`
<div class="selectable-area column-header">
   %
</div>
<div class="cards-list" ></div>
<div class="column-grey-footer" onclick="openTaskInput(this)">
   <i class="material-icons column-icon">
   add
   </i>
   <div>Добавить ещё одну карточку</div>
</div>
`),
    columnElement: new Word(`
<div class="column column-main-font button column">
   <div class="column-container selectable-area">
      <div class="column-grey-footer">
         <i class="material-icons column-icon">
         add
         </i>
         <div>Добавить ещё одну колонку</div>
      </div>
   </div>
</div>
`),
    cardContainerBody: new Word(`
<div>
   <div class="white-card">
      <textarea type="text" class="textarea" placeholder="Введите название колонки" onkeyup="saveColumnName(event)"></textarea>
   </div>
   <div class="column-grey-footer green-column-footer">
      <div class="green-flat-button" onclick="saveColumnName(event)">Добавить колонку</div>
      <i class="material-icons column-icon" onclick="closeColumn(this);">
      close
      </i>
   </div>
</div>
`),
    cardContainerBodyDelete: new Word(`
<div class="column-grey-footer" onclick="openTaskInput(this)">
   <i class="material-icons column-icon">
   add
   </i>
   <div >Добавить ещё одну карточку</div>
</div>
`),
    cardBody: new Word(`
<div id="card_%" class="task-block">
   <div class="place-to-insert">
   </div>
   <div onmousedown="mousedownLocalListener(event)" class="white-card">
      %
   </div>
</div>
`),
    oneMoreCardPart: new Word(`
<div class="column-grey-footer" onclick="openTaskInput(this)">
   <i class="material-icons column-icon">
   add
   </i>
   <div>Добавить ещё одну карточку</div>
</div>
`),
    cardContainerBodyInputState: new Word(`
<div class="input-block">
   <div class="white-card">
      <textarea type="text" class="textarea" onkeyup="saveTaskName(event)" placeholder="Введите название карточки"></textarea>
   </div>
   <div class="column-grey-footer green-column-footer">
      <div class="green-flat-button" onclick="saveTaskName(event)">Добавить карточку</div>
      <i class="material-icons column-icon" onclick="closeTaskInput(this);">
      close
      </i>
   </div>
</div>
`),
    columnReadyRattern: new Word(`
<div id="column_%" class="column column-main-font button">
   <div class="column-container selectable-area">
      <div class="column-header selectable-area">%</div>
      <div class="cards-list">%</div>
      <div class="column-grey-footer" onclick="openTaskInput(this)">
         <i class="material-icons column-icon">add</i>
         <div>Добавить ещё одну карточку</div>
      </div>
   </div>
</div>
`),
    cardReadyPattern: new Word(`
<div id="card_%" class="task-block">
   <div class="place-to-insert"></div>
   <div onmousedown="mousedownLocalListener(event)" class="white-card">%</div>
</div>
`)
};