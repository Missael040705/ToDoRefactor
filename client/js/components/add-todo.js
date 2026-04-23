import Alert from './alert.js';

export default class AddTodo {
    constructor() {
        this.btn = document.getElementById('add');
        this.title = document.getElementById('title');
        this.description = document.getElementById('description');

        this.alert = new Alert('alert');
    }

    onClick(callback) {
        this.btn.onclick = (event) => {
            event.preventDefault();

            const titleValue = this.title.value.trim();
            const descriptionValue = this.description.value.trim();

            if (!titleValue || !descriptionValue) {
                this.alert.show('Title and description are required');
            } else {
                this.alert.hide();
                callback(titleValue, descriptionValue);
                this.title.value = '';
                this.description.value = '';
            }
        }
    }
}
