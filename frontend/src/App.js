import { useState, useEffect } from 'react'
import personService from './services/persons'

const SuccessNotification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  const notificationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={deletePerson}>delete</button>
    </div>
  )
}

const Filter = ({ handleShowNameChange }) => {
  return (
    <div>
      filter shown with <input onChange={handleShowNameChange} />
    </div>
  )
}

const PersonForm = ({ addPerson, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input onChange={handleNameChange} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ personsToShow, deletePersonOf }) => {
  return (
    <div>
      {personsToShow.map(person => 
        <Person key={person.id} person={person} deletePerson={() => deletePersonOf(person.id)} />
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showName, setShowName] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(showName.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    const personNames =  persons.map(person => person.name)
    const personObject = {
      name: newName,
      number: newNumber
    }
    if(personNames.includes(newName)){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const foundPerson = persons.filter(person => person.name === newName)[0]
        personService
          .update(foundPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name !== returnedPerson.name ? person : returnedPerson))
            setSuccessMessage(
              `Updated ${newName}`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `${error.response.data.error}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }
    else{
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setSuccessMessage(
            `Added ${newName}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `${error.response.data.error}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const deletePersonOf = (id) => {
    const deletedPersonName = persons.filter(person => person.id === id)[0].name
    if (window.confirm(`Delete ${deletedPersonName} ?`)) {
      personService
        .deletePerson(id)
        .then(returnedPerson => {
          setPersons(persons.filter(person => person.id !== id))
          setSuccessMessage(
            `Deleted ${deletedPersonName}`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          setPersons(persons.filter(person => person.id !== id))
          setErrorMessage(
            `${deletedPersonName} was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleDelete = (id) => {}

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleShowNameChange = (event) => {
    setShowName(event.target.value)
  }


  return (
    <div>

      <h2>Phonebook v1.0</h2>

      <SuccessNotification message={successMessage} />

      <ErrorNotification message={errorMessage} />

      <Filter handleShowNameChange={handleShowNameChange} />

      <h2>add a new</h2>

      <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>

      <Persons personsToShow={personsToShow} deletePersonOf={deletePersonOf} />


    </div>
  )
}

export default App