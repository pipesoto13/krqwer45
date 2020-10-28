import React, { Component } from 'react';

/// Modifica el componente para que se puedan agregar tareas, tachar y destacharlas y error de validacion en el input

class App extends Component {
  constructor() {
    super()
    this.state = {
      tasks: [
        { id: 1, name: "Sacar la ropa", done: false },
        { id: 2, name: "Hacer la cama", done: true },
        { id: 3, name: "Leer un rato", done: false }
      ],
      newTask: '',
      clases: ''
    }
  }

  handleOnChange(event) {
    this.setState({
      newTask: event.target.value
    });
  }
  
  handleOnSubmit(event) {
    event.preventDefault();
    if (this.state.newTask === "") {
      this.setState({clases: 'error'})
    } else {
      this.setState({ 
        tasks: [
          ...this.state.tasks, 
          {id: this.state.tasks[this.state.tasks.length-1].id + 1, name: this.state.newTask, done: false}
        ],
        newTask: '',
        clases: ''
      });
    }
  }


  toogleDone(event) {
    const index = this.state.tasks.findIndex(task => task.name === event.target.innerHTML);
    this.setState({
      tasks: this.state.tasks.map((task, i) => i === index ? {id: task.id, name: task.name, done: !task.done} : task)
    });
  }

  render() {
    return (
      <div className="wrapper">
        <div className="list">
          <h3>Por hacer:</h3>
          <ul className="todo">
            {this.state.tasks.map((task, index) => <li key={task.id} className={task.done ? 'done' : ''} onClick={this.toogleDone.bind(this)}>{task.name}</li>)}
          </ul>
          <form onSubmit={this.handleOnSubmit.bind(this)}>
            <input type="text" id="new-task" placeholder="Ingresa una tarea y oprime Enter" className={this.state.clases} value={this.state.newTask} onChange={this.handleOnChange.bind(this)}/>
          </form>
        </div>
      </div>
    )
  }
}

export default App;

/* 
Una posible solución a este reto es la siguiente. En App.js:

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newTask: '',
      tasks: [
        { id: 1, name: "Sacar la ropa", done: false },
        { id: 2, name: "Hacer la cama", done: true },
        { id: 3, name: "Leer un rato", done: false }
      ],
      errors: {
        newTask: false
      }
    }
  }
  validateNewTask() {
    if (this.state.newTask === '') {
      this.setState({
        errors: {
          newTask: true
        }
      })
      return false
    }
    return true
  }
  addTask(event) {
    event.preventDefault()
    if (this.validateNewTask()) {
      let oldTasks = this.state.tasks
      let newTask = {
        id: Math.max(...oldTasks.map(task => task.id)) + 1,
        name: this.state.newTask,
        done: false
      }
      this.setState({
        tasks: [...oldTasks, newTask],
        newTask: ''
      })
    }
  }
  updateTask(event) {
    this.setState({
      newTask: event.target.value,
      errors: {
        newTask: false
      }
    })
  }
  toogleDone(id,event) {
    const newTasks = this.state.tasks.map(task => {
      if (task.id === id) {
        task.done = !task.done
        return task
      }
      return task
    })
    this.setState({
      tasks: newTasks
    })
  }
  renderTasks() {
    const tasks = this.state.tasks.map((task, index) => {
      return (
        <li
          className={task.done ? 'done' : null}
          key={task.id}
          onClick={this.toogleDone.bind(this, task.id)}>
          {task.name}
        </li>
      )
    })
    return tasks
  }
   render() {
    return (
      <div className="wrapper">
        <div className="list">
          <h3>Por hacer:</h3>
          <ul className="todo">
            {this.renderTasks()}
          </ul>
          <form onSubmit={this.addTask.bind(this)}>
          <input className={this.state.errors.newTask ? 'error' : null} type="text" id="new-task" placeholder="Ingresa una tarea y oprime Enter" value={this.state.newTask} onChange={this.updateTask.bind(this)}/>
          </form>
        </div>
      </div>
    )
  }
}
Lo que hicimos fue:

Como te habrás podido dar cuenta a diferencia del reto anterior, el estado de task en este componente no es un arreglo de string si no que es un arreglo de objetos. Este cambio es necesario para poder saber si una tarea se encuentra completada o no y el id nos sirve para encontrar fácilmente cada tarea dentro del arreglo de tareas.
Primero separamos todo el código para renderizar las tareas en una función aparte llamada renderTasks.Esto para limpiar un poco el código dentro de render y por otro lado como las tareas están ganando cada vez más funcionalidades es bueno irlas separando dado que lo mas seguro es que en el futuro se conviertan en su propio componente.
Dentro de renderTasks, cuando creamos cada li, le agregamos el atributo className el cual, como valor, tiene un operator ternario: javascript className={task.done ? 'done' : null} este mira si la tarea está completada o no, en caso de que lo este agrega la clase done al li.
A cada li le agregamos el evento onClick el cual va a disparar la función toggleDone. Esta función se encarga de completar o des-completar la tarea que disparó el evento y actualizar el estado para que incluya este cambio.
Creamos en el estado una nueva llave llamada errors esta llave tiene como valor un objeto, el cual va a contener el el nombre de cada input que estemos controlando y si este contiene errores o no:
errors: {
  newTask: false
}
Este objeto en el estado lo usamos para saber si en algún momento algunos de los inputs tiene un estado que contenga errores.

Creamos la función validateNewTask la cual en el caso de que el estado de newTask sea igual a '' cambia el estado del componente para que ese input ahora tenga un error y devuelva false, en caso de que newTask si tenga un valor válido devuelve true.
Dentro de la función addTask antes de hacer cualquier cosa llamamos validateNewTask para verificar que no tengamos errores en caso de que la validación pase creamos la tarea de lo contrario no hacemos nada.
Por último agregamos esta linea al input:
className={this.state.errors.newTask ? 'error' : null}
Dependiendo del estado de error de newTask esta linea agrega o no la clase error al input.
 */