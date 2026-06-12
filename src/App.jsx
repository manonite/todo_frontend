import { useEffect, useState } from "react";
import axios from "axios";
const import_vite = import.meta.env.VITE_URI;

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const fetchNotes = async () => {
    const res = await axios.get(`${import_vite}/todo/get`);
    setNotes(res.data);
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  const addNote = async () => {
    await axios.post(`${import_vite}/todo`, { title: text, description: description });
    setText("");
    setDescription("");
    fetchNotes();
  };
  const deleteNote = async (id) => {
    await axios.delete(`${import_vite}/todo/${id}`);
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
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter your description"
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