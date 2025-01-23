import React, { Component } from 'react';
import './App_2.css'; // Ensure this styling file is in place

class App_1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      userEmail: sessionStorage.getItem('userEmail') || 'Guest' // Retrieve email once here
    };
  }

  // API_URL = "https://todoapp-production-3030.up.railway.app/"; // Your API endpoint for the todo app
  API_URL = "http://localhost:5038/";

  componentDidMount() {
    const userId = sessionStorage.getItem('userId');
    this.refreshNotes(userId); // Pass the userId to refreshNotes
  }
  
  async refreshNotes(userId) {
    try {
      const response = await fetch(`${this.API_URL}api/todoapp/GetNotes/${userId}`); // Fetch notes for the specific user
      const data = await response.json();
      this.setState({ notes: data }); // Update state with fetched notes
    } catch (error) {
      console.error("Error fetching notes:", error); // Log any errors
    }
  }

  addClick = async () => {
    const newNotes = document.getElementById("newNotes").value;
    const newNotesStatus = document.getElementById("newNotesStatus").value;
    const data = new FormData();
    const userId = sessionStorage.getItem('userId'); // Get the user ID
    data.append("newNotes", newNotes);
    data.append("newNotesStatus", newNotesStatus);
    data.append("userId", userId); // Append userId to the request
  
    try {
      await fetch(this.API_URL + "api/todoapp/AddNotes", {
        method: "POST",
        body: data
      });
      alert("Added Successfully");
      this.refreshNotes(userId); // Refresh the notes after adding with userId
      document.getElementById("newNotes").value = ""; // Clear the input field
    } catch (error) {
      console.error("Error adding note:", error); // Log any errors
    }
  }

  async deleteClick(id) {
    const userId = sessionStorage.getItem('userId'); // Get the user ID
    try {
      await fetch(`${this.API_URL}api/todoapp/DeleteNotes?id=${id}&userId=${userId}`, {
        method: "POST"
      });
      alert("Deleted Successfully");
      this.refreshNotes(userId); // Refresh the notes after deletion
    } catch (error) {
      console.error("Error deleting note:", error); // Log any errors
    }
  }

  async completeClick(id) {
    try {
        const userId = sessionStorage.getItem('userId'); // Get the user ID
        const data = {
            status: 'Completed',
            userId: userId // Include user ID in the data
        };

        await fetch(`${this.API_URL}api/todoapp/UpdateNoteStatus?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Send the updated data
        });

        alert("Marked as completed successfully");
        this.refreshNotes(userId); // Refresh the notes after updating
    } catch (error) {
        console.error("Error completing note:", error); // Log any errors
    }
}

  render() {
    const { notes, userEmail } = this.state; // Destructure notes and userEmail from state
    return (
      <div className="App">
        <div className="user-info" style={{ float: 'right', padding: '10px' }}>
          <p>Welcome, {userEmail}</p> {/* Display the user's email */}
        </div>
        <div className="header">
          <h2 className="app-title">Todo App</h2>
        </div>

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
                       <button className="delete-button" onClick={() => this.deleteClick(note.id )}>Delete</button> &nbsp;
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

export default App_1; // Ensure you export the component properly