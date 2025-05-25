import { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer";
import noteService from "./services/notes";
import loginService from "./services/login";
import "./notes.css";
import Note from "./components/Note";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable ";
import NoteForm from "./components/NoteForm";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const noteFormRef = useRef();

  const addNote = (noteObject) => {
    event.preventDefault();
    setErrorMessage(null);
    noteFormRef.current.toggleVisibility();

    noteService
      .create(noteObject)
      .then((response) => {
        setNotes(notes.concat(response));
        // setNewNote("");
      })
      .catch((error) => {
        console.log(`create error`, error);
        console.log(`create error`, error.response.data);
        setErrorMessage(`Error: ${error.response.data.error}`);
      });

    // setNotes(notes.concat(noteObject))
    setNewNote("");
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
    noteService
      .getAll()
      .then((response) => {
        console.log("useffect resp", response);
        setNotes(response); // Ensure notes is always an array
      })
      .catch((error) => {
        console.error("Failed to fetch notes:", error);
        setNotes([]); // Fallback to an empty array on error
      });
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      console.log(`========== user`, username, password);
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

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

      {!user && (
        <Togglable buttonLabel="log in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      )}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}

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

      <Footer />
    </div>
  );
};

export default App;
