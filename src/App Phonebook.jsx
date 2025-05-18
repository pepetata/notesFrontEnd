import React, { useState, useRef, useEffect } from 'react';
import personService from './services/persons'
import Button from './components/Button'
import Notification from './components/Notification'
import './App.css';

// Needed to move it outside App as the field was loosing focus
const FilterName = ({ filterName, setFilterName }) => {
  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
    console.log('filterName', event.target.value);
  };

  return (
    <div>
      <div>
        filter shown with
        <input
          value={filterName}
          onChange={handleFilterNameChange}
        />
      </div>
    </div>
  );
};

const App = () => {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({ name: false, number: false });
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
  ]);
  const newPersonEmpty = { name: '', number: '', id:'' }
  const [newPerson, setNewPerson] = useState(newPersonEmpty); // Single state object
  const [filterName, setFilterName] = useState('');
  const noMessage = {type:'', message:''}
  const [msg, setMsg] = useState(noMessage)

  const Persons = ({ persons }) => {
    return (
      <div>
        <h2>Persons List</h2>
        {persons.map(person => { if (person.name.toLowerCase().includes(filterName.toLowerCase())) return <Person key={person.name} person={person} /> })}
      </div>
    )
  }

  const Person = ({ person }) => {
    return (
      <p>{person.name}  {person.number} <Button onClick={() => deletePerson(event, person.id)} text='delete' /></p>
    )
  }

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response); // Ensure notes is always an array
          // showMessage('success', 'dfgdfd')
      })
      .catch(error => {
        console.error('Failed to fetch notes:', error);
        setPersons([]); // Fallback to an empty array on error
      });
  }, []);

  const showMessage = (type, message) => {
    console.log('type', type, message);
            setMsg({type:type, message: message})
        setTimeout(() => {
          setMsg(noMessage)
        }, 5000)
  }



  const addPerson = (event) => {
    event.preventDefault();
    let focusTarget = null;
    const newErrors = { ...errors };

    //////////////////////////////////////////////////////////////////////
    //  check for errors
    console.log('newPerson', newPerson);
    if (persons.some(person => person.name === newPerson.name && person.number === newPerson.number)) {
      showMessage('error',`${newPerson.name} with phone ${newPerson.number} is already added to phonebook`);
      return;
    }
    if (newPerson.name === '') {
      newErrors.name = true;
      showMessage('error',`Name cannot be empty`);
      focusTarget = 'name';
    }
    if (newPerson.number === '') {
      if (!focusTarget) showMessage('error',`Number cannot be empty`);
      newErrors.number = true;
      focusTarget = focusTarget || 'number';
    }
    // if user exists and number is different, ask if want to update
    if (persons.some(person => person.name === newPerson.name)) {


      if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with the new one?`)) {

        const newPersonObject= persons.find(person => person.name === newPerson.name)
        newPerson.id = newPersonObject.id
        console.log('newPersonObject =========', newPerson);
        console.log('newPerson =========', newPerson);
        personService
          .update(newPersonObject.id, newPerson)
          .then(response => {
            // update persons
            setPersons(persons.map(person => person.id === newPersonObject.id ? response : person))
            showMessage('success', `Updated ${newPerson.name} with number ${newPerson.number}`)

          })
          .catch(error => {
            console.error('Failed to add person:', error);
          });
            setNewPerson(newPersonEmpty); // Reset the form
        return;
      }
      else {
        newErrors.name = true;
        showMessage('warning',`No action was taken!`);
        focusTarget = 'name';
      }
    }
    setErrors(newErrors);
    if (focusTarget) {
      const inputElement = formRef.current?.querySelector(`[name="${focusTarget}"]`);
      inputElement?.focus();
      return;
    }
    //////////////////////////////////////////////////////////////////////


    // save it to db
    const newPersonObject = {
      name: newPerson.name,
      number: newPerson.number,
    };
    personService
      .create(newPersonObject)
      .then(response => {
        setPersons([...persons, response])
        showMessage('success', `Added ${newPersonObject.name}`)
      })
      .catch(error => {
        console.error('Failed to add person:', error);
      });

    // setNotes(notes.concat(noteObject))
    setNewPerson(newPersonEmpty); // Reset the form
  };

  const deletePerson = (event, id) => {
    event.preventDefault();
    setNewPerson(newPersonEmpty)
    // get the person to delete
    const person = persons.find(p => p.id === id)



    // confirm to delete
    if (window.confirm(`Delete ${person.name}`)) {
      // delete it from db
      personService
        .deletePerson(id)
        .then(response => {
          console.log('deletePerson response', response);
          showMessage('success', `${person.name} was deleted!`)
        })
        .catch(error => {
          console.error('Failed to delete person:', error);
        });
      // refresh page
      const newPersons = persons.filter(person => person.id !== id);
      setPersons(newPersons)
    }

  };

  const handleInputChange = (event) => {
    setMsg(noMessage)
    const { name, value } = event.target;
    setNewPerson({ ...newPerson, [name]: value.trim() });
    setErrors({ ...errors, [name]: false });
  };


  return (
    <div>
      <h1>Phonebook</h1>
      <Notification type={msg.type} message={msg.message} />
      <FilterName filterName={filterName} setFilterName={setFilterName} />
      <h2>Add a new Person</h2>
      <form onSubmit={addPerson} ref={formRef}>
        <div>
          name: <input
            name="name"
            value={newPerson.name}
            onChange={handleInputChange}
            onFocus={(e) => e.target.classList.add('warning')}
            onBlur={(e) => e.target.classList.remove('warning')}
            className={errors.name ? 'error' : ''}
          />
        </div>
        <div>
          number: <input
            name="number"
            value={newPerson.number}
            onChange={handleInputChange}
            onFocus={(e) => e.target.classList.add('warning')}
            onBlur={(e) => e.target.classList.remove('warning')}
            className={errors.number ? 'error' : ''}
          />
        </div>
        <div>
          none: <input
            name="none"
            value={newPerson.none}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <Persons persons={persons} />
    </div>
  )
}

export default App
