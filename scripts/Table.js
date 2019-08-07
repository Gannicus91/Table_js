const KEY_ENTER_CODE = 13;

function Table(fields, rows, meta, root) {
    /*класс представляет функционал по созданию html таблиц и работы с ними
      в конструктор передаются следующие параметры:
      fields - массив строк, содержит заголовки столбцов таблицы
      rows - число строк в создаваемой таблице
      meta - объект js с дополнительной информацией. Можно передать до трех css-классов отвечающих за оформление:
            1)заголовков таблицы (поле "head" объекта)
            2)четных строк (поле "even" объекта)
            3)нечетных строк (поле "odd" объекта)
      root - элемент html-страницы, дочерним к которому станет созданная таблица
      пример использования класса:
            let root = document.getElementById('main');
            let fields = ["A", "B", "C"];
            let rows = 2;
            let meta = {head: "table-head", odd: "odd-row", even: "even-row"};
            let table = new Table(fields, rows, meta, root);
    */
    this.insert_row = function (row_after_index) {
        /* функция вставляет строку в таблицу после указанной в параметре row_after_index*/
        let table_row = this.table.rows[row_after_index];
        let new_row = document.createElement("tr");
        for (let i=0; i<this.fields.length; i++){
            new_row.appendChild(create_td());
        }
        table_row.after(new_row);
        // после добовления новой строки меняем классы четных/нечетных строк
        for (let i=row_after_index; i<this.table.rows.length; ++i){
            if (i % 2 === 0){
                if (meta["even"]){
                    this.table.rows[i].classList.remove(meta["odd"]);
                    this.table.rows[i].classList.add(meta["even"])
                }
            }else {
                if (meta["odd"]){
                    this.table.rows[i].classList.remove(meta["even"]);
                    this.table.rows[i].classList.add(meta["odd"])
                }
            }
        }
        this.rows_count++;
    };

    this.add_row = function () {
        //функция добовляет строку в конец таблицы и ставит ей соответствующий класс четности/нечетности, если он был передан
        let table_row = document.createElement("tr");
        if (this.rows_count % 2 === 0){
            if (meta["odd"]){
                table_row.classList.add(meta["odd"])
            }
        }else {
            if (meta["even"]){
                table_row.classList.add(meta["even"])
            }
        }

        for (let i=0; i<fields.length; i++){
            table_row.appendChild(create_td());
        }
        this.table.appendChild(table_row);
        this.rows_count++;
    };
    function create_td() {
        /* функция создает ячейку таблицы и устанавливает ей обработчики событий:
         двойного клика - появляется поле ввода
         нажатия на энтер(в поле ввода) - введенное значение сохраняется в ячейку
        */
        let cell = document.createElement("td");
        cell.addEventListener("dblclick", () => {
            let input_field = document.createElement("input");
            input_field.value = cell.innerHTML;
            cell.innerHTML = "";
            input_field.addEventListener("keydown", (e) => {
                if (e.keyCode === KEY_ENTER_CODE){
                    cell.innerHTML = input_field.value;
                }
            });
            cell.appendChild(input_field);
            input_field.focus();
        });
        return cell;
    }
    this.get_data = function () {
        //функция создает массив объектов, где поля - это заголовки таблицы, а значения - содержимое ячеек и преобразует массив в строку json
        let table_data_arr = [];
        for (let i=1; i<this.table.rows.length; ++i){
            let row_obj = {};
            for (let j=0; j<this.table.rows[i].cells.length; ++j){
                 row_obj[this.table.rows[0].cells[j].innerHTML] = this.table.rows[i].cells[j].innerHTML
            }
            table_data_arr.push(row_obj);
        }
        return JSON.stringify(table_data_arr);
    };

    this.clean_table = function () {
        //функция очищает содержимое ячеек таблицы
        for (let i=1; i<this.table.rows.length; ++i){
            for (let j=0; j<this.table.rows[i].cells.length; ++j){
                this.table.rows[i].cells[j].innerHTML = "";
            }
        }
    };

    this.table = document.createElement("table"); //корневой элемент таблицы
    this.rows_count = 0; //счетчик строк таблицы
    let row = document.createElement("tr");
    for (let i=0; i<fields.length; ++i){
        let table_head = document.createElement("th");
        if (meta["head"])
            table_head.classList.add(meta["head"]);
        table_head.innerHTML = fields[i];
        row.appendChild(table_head);
    }
    this.table.appendChild(row);
    for (let i=1; i<=rows; ++i){
        this.add_row();
    }
    root.appendChild(this.table);
}

let el = document.getElementById('main');
let table = new Table(["A", "B", "C"], 2, {head: "table-head", odd: "odd-row", even: "even-row"}, el);

function insert_row() {
    let row_after_index = document.getElementById("row_index").value;
    table.insert_row(row_after_index);
}

function clean_table() {
    table.clean_table();
}

function to_json() {
    console.log(table.get_data());
}

function add_row() {
    table.add_row();
}