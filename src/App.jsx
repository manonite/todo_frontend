import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const fetchNotes = async () => {
    const res = await axios.get(`${import.meta.env.VITE_URI}/todo/get`);
    setNotes(res.data);
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  const addNote = async () => {
    await axios.post(`${import.meta.env.VITE_URI}/todo`, { title: text, description: "This is a note" });
    setText("");
    fetchNotes();
  };
  const deleteNote = async (id) => {
    await axios.delete(`${import.meta.env.VITE_URI}/todo/${id}`);
    fetchNotes();
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>Notes App</h2>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your note"
      />
      <button onClick={addNote}>Add</button>
      <ol>
        {notes && notes.map((note) => (
          <li key={note._id}>
            {note.title}{" "}
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note._id)}>Delete</button>
          </li>
        ))}
      </ol>
    </div>
  );
}
export default App;