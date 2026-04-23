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
      title,
      description,
      completed: false,
    };

    // en la US4 se envía el POST al servidor
    console.log("Preparado para enviar a la API:", todo);

    // Simulación temporal para no romper la vista mientras refactorizamos
    const mockTodo = { id: Date.now(), ...todo };
    this.todos.push(mockTodo);
    return { ...mockTodo };
  }

  async toggleCompleted(id) {
    // Refactorización: preparación para PUT /api/tasks/:id
    console.log("Cambiando estado de tarea:", id);
  }

  async removeTodo(id) {
    // Refactorización: preparación para DELETE /api/tasks/:id
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  save() { // sobrante
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  findTodo(id) {
    return this.todos.findIndex((todo) => todo.id === id);
  }

  editTodo(id, values) {
    const index = this.findTodo(id);
    Object.assign(this.todos[index], values);
    this.save();
  }
}
