export default class Model {
  constructor() {
    this.view = null;
    this.todos = []; // inicia vacío ya que se llenará desde la API/BD
    this.baseUrl = "http://localhost:3000/api/taks"; // futuro servidor
  }

  setView(view) {
    this.view = view;
  }

  // obtiene tareas asíncrono
  async getTodos() {
    // local de momento, US4 hace fetch
    return this.todos.map((todo) => ({ ...todo }));
  }

  async addTodo(title, description) {
    const todo = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };
    this.todos.push(todo);
    return { ...todo };
  }

  async toggleCompleted(id) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos[index].completed = !this.todos[index].completed;
    }
  }

  async removeTodo(id) {
    // Refactorización: preparación para DELETE /api/tasks/:id
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  async editTodo(id, values) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    Object.assign(this.todos[index], values);
  }  
}
