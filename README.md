# VK-Kanban

# Возможности, особенности решения:
* Добавлять новые колонки
* Добавлять новые карточки
* Выделять содержимое карточек
* Перемещать карточки между колонками; Зажав рукой клавишу ctrl(или command на mac), а после зажав карточку мышью
* Перемещать карточки относительно друг друга
* При перетаскивании элементов в колонках подсвечиваются области для возможного места вставки. При переполненном списке элементы автоматически будут прокручиваться, чтобы ровно встать под курсор
* Удалять карточки
* Количество элементов не ограниченно, можно создавать любое количество колонок, карточек. Конечно, пока память браузера не закончится.
* Автосохранение элементов доски: при перезагрузке страницы, все элементы возвращаются на свои места (С помощью LocalStorage сделано)
* Красивая, плавная анимация заставляющая пользователя залипнуть на неё
* Стилистика, верстка приложения выполнена в соответствии с макетом

## Решение масштабируемое
Если добавить ещё элементы на страницу, то например можно менять фон. (Для этого есть отдельная функция)
Есть возможность добавить отдельную кнопку для того, чтобы стереть содержимое всей страницы. Так-же есть возможность сделать удаление конкретных колонок.
Кроме того решение позволяет добавить физику для перетаскиваемых карточек. К сожалению в решении этого нельзя увидеть, т.к. я посчитал, что это будет излишняя анимация для пользователя, которая будет перегружать поступаемый объем информации.


Лицезреть решение можно по [ссылке](https://moor.one/VK-Kanban/)
