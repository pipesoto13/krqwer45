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
