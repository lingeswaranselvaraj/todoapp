import logo from './logo.svg';
import './App_2.css';
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  }

  API_URL = "https://todoapp-production-3030.up.railway.app/";

  componentDidMount() {
    this.refreshNotes();
  }

  async refreshNotes() {
    try {
      const response = await fetch(this.API_URL + "api/todoapp/GetNotes");
      const data = await response.json();
      this.setState({ notes: data });
    } catch (error) {
      console.error("Error fetching notes:", error); // Log any errors
    }
  }

  addClick = async () => {
    var newNotes = document.getElementById("newNotes").value;
    var newNotesStatus = document.getElementById("newNotesStatus").value;
    const data = new FormData();
    data.append("newNotes", newNotes);
    data.append("newNotesStatus", newNotesStatus);
    
    try {
      await fetch(this.API_URL + "api/todoapp/AddNotes", {
        method: "POST",
        body: data
      });
      alert("Added Successfully");
      this.refreshNotes(); // Refresh the notes after adding
      document.getElementById("newNotes").value = ""; // Clear the input field
    } catch (error) {
      console.error("Error adding note:", error); // Log any errors
    }
  }

  async deleteClick(id) {
    try {
      await fetch(this.API_URL + "api/todoapp/DeleteNotes?id=" + id, {
        method: "POST"
      });
      alert("Deleted Successfully");
      this.refreshNotes(); // Refresh the notes after deletion
    } catch (error) {
      console.error("Error deleting note:", error); // Log any errors
    }
  }

  async completeClick(id) {
    try {
      // Create a data object with the new status
      const data = { status: 'Completed' };
      await fetch(`${this.API_URL}api/todoapp/UpdateNoteStatus?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      alert("Marked as completed successfully");
      this.refreshNotes(); // Refresh the notes after updating
    } catch (error) {
      console.error("Error completing note:", error); // Log any errors
    }
}

  render() {
    const { notes } = this.state;
    return (
      <div className="App">
      <h2 className="app-title">Todo App</h2>
      <div className="input-container">
        <input id="newNotes" type="text" className="note-input" placeholder="Enter your note here" />
        <select id="newNotesStatus" className="note-input">
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        </select>
        <button className="add-button" onClick={this.addClick}>Add</button>
      </div>

      <div className="notes-listing">
        <div className="notes-container">
        <div className="table-container pending-items">
          <h3>Pending Items</h3>
          <table className="notes-table_1">
          <thead>
            <tr>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.filter(note => note.status === 'Pending').map(note => (
            <tr key={note.id}>
              <td className="note-description">{note.description}</td>
              <td className="note-status">{note.status}</td>
              <td>
              <button className="delete-button" onClick={() => this.deleteClick(note.id)}>Delete</button> &nbsp;
              <button className="complete-button" onClick={() => this.completeClick(note.id)}>Completed</button>
              
              </td>
            </tr>
            ))}
          </tbody>
          </table>
        </div>

        <div className="table-container completed-items">
          <h3>Completed Items</h3>
          <table className="notes-table">
          <thead>
            <tr>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.filter(note => note.status === 'Completed').map(note => (
            <tr key={note.id}>
              <td className="note-description">{note.description}</td>
              <td className="note-status">{note.status}</td>
              <td>
              <button className="delete-button" onClick={() => this.deleteClick(note.id)}>Delete</button>
              </td>
            </tr>
            ))}
          </tbody>
          </table>
        </div>
        </div>
      </div>
      </div>
    );
  }
}

export default App;