import { useState, useEffect } from "react";
import Note from "./components/Note";
import Footer from "./components/Footer";
import noteService from "./services/notes";
import "./notes.css";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const addNote = (event) => {
    event.preventDefault();
    setErrorMessage(null)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };

    noteService
      .create(noteObject)
      .then((response) => {
        setNotes(notes.concat(response));
        setNewNote("");
      })
      .catch((error) => {
        console.log(`create error`, error);
        console.log(`create error`, error.response.data);
        setErrorMessage(`Error: ${error.response.data.error}`)
      });

    // setNotes(notes.concat(noteObject))
    setNewNote("");
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  useEffect(() => {
    noteService
      .getAll()
      .then((response) => {
        console.log("ueffect resp", response);
        setNotes(response); // Ensure notes is always an array
      })
      .catch((error) => {
        console.error("Failed to fetch notes:", error);
        setNotes([]); // Fallback to an empty array on error
      });
  }, []);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    console.log("note to update", changedNote);
    noteService
      .update(id, changedNote)
      .then((response) => {
        setNotes(notes.map((note) => (note.id === id ? response : note)));
      })
      .catch((error) => {
        setErrorMessage(`Note '${note.content}' -> error to update`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const Note = ({ note, toggleImportance }) => {
    const label = note.important ? "make not important" : "make important";

    return (
      <li key={note.id}>
        {note.content}
        <button onClick={toggleImportance}>{label}</button>
      </li>
    );
  };

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }

    return <div className="error">{message}</div>;
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>

      <ul>
        {notesToShow.map((note) => {
          console.log("note.id", note);
          return (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          );
        })}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
