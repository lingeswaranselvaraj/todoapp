import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      notes: []
    };
  }

  API_URL = "http://localhost:5038/";

componentDidMount(){
  this.refreshNotes();
}

async refreshNotes(){
fetch(this.API_URL + "api/todoapp/GetNotes").then(response => response.json()).then(data => {
  this.setState({notes: data});
}
);
}

addClick = async () => {
  var newNotes = document.getElementById("newNotes").value;
  const data = new FormData();
  data.append("newNotes", newNotes);
  fetch(this.API_URL + "api/todoapp/AddNotes", {
      method: "POST",
      body: data
  })
      alert("Added Successfully");
      this.refreshNotes();
  
}

async deleteClick(id){  
  fetch(this.API_URL + "api/todoapp/DeleteNotes?id=" + id, {
    method: "POST"
  });
  alert("Deleted Successfully");
  this.refreshNotes();
}


  render(){
    const { notes } = this.state;
    return(
      <div className="App">
        <h2>Todo App</h2>
        <input id="newNotes" type="text" placeholder="Enter your note here" />
        <button onClick={this.addClick}>Add</button>
        {notes.map(note => 
            <p>
              <b>*{note.description}</b>&nbsp;
            <button onClick={() => this.deleteClick(note.id)}>Delete</button>
          </p>
        )}
      </div>
    );
  }
}


export default App;
