export default class Model {
    constructor() {
        this.view = null;
        this.todos = [];

        const runtimeApiBase = window.__API_BASE_URL__;
        const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
        const isFileProtocol = window.location.protocol === "file:";

        this.baseUrl = runtimeApiBase || (isLocal || isFileProtocol
            ? "http://localhost:3001/api/tasks"
            : "/api/tasks");
    }

    setView(view) {
        this.view = view;
    }

    // obtiene tareas asíncrono
    async getTodos() {
        try {
            const res = await fetch(this.baseUrl);
            if (!res.ok) throw new Error('Error al obtener tareas');
            this.todos = await res.json();
            return this.todos.map((todo) => ({...todo}));
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async addTodo(title, description, owner = "anon") {
        try {
            const res = await fetch(this.baseUrl, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, description, owner})
            });
            if (!res.ok) throw new Error('Error al crear tarea');
            const todo = await res.json();
            this.todos.push(todo);
            return {...todo};
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async toggleCompleted(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo) return null;
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    title: todo.title,
                    description: todo.description,
                    owner: todo.owner || "anon",
                    completed: !todo.completed
                })
            });
            if (!res.ok) throw new Error('Error al actualizar tarea');
            const updated = await res.json();
            Object.assign(todo, updated);
            return {...updated};
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async removeTodo(id) {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {method: "DELETE"});
            if (!res.ok) throw new Error('Error al eliminar tarea');
            this.todos = this.todos.filter(todo => todo.id !== id);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async editTodo(id, values) {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo) return null;
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    title: values.title || todo.title,
                    description: values.description || todo.description,
                    owner: values.owner || todo.owner || "anon",
                    completed: typeof values.completed === "boolean" ? values.completed : todo.completed
                })
            });
            if (!res.ok) throw new Error('Error al editar tarea');
            const updated = await res.json();
            Object.assign(todo, updated);
            return {...updated};
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}
