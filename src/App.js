import { useState, useEffect } from 'react'
import axios from 'axios'
import React from 'react'


const Filter = (props) => { 

  const [filter, setFilter] = useState('Filter by name...')

  const handleFilterChange = (event) => {

    if(true)
      setFilter(event.target.value)
    else{
      alert("You can't continue")
    }
  }

  function filterItems(arr, query) {
    return arr.filter((el) => el.name.toLowerCase().includes(query.toLowerCase()));
  }

    if(filter === '')
      return(
        <div>
          filter shown with: <input onChange={handleFilterChange} value={filter}/>
        </div>
      )  
    else
      return(
        <div>
          filter shown with: <input onChange={handleFilterChange} value={filter}/>
          <Persons persons={filterItems(props.arrayOfPersons, filter)}/>
        </div>
      )
}

const PersonForm = (props) => {

  const addName = (event) => {

    event.preventDefault();
    
    if(isDuplicate()){
      alert(`${props.valueName} is in the list`)
      props.setNewName('Insert another name here...')
      props.setNewNumber('Insert another number here...')
    }
    else{
      
      const nameObject = {
        name: props.valueName,
        number: props.valueNumber
      }

      axios
      .post('http://localhost:3001/persons', nameObject)
      .then(response => {
        console.log(response)
        
        props.setNewName(response.data)
        props.setNewNumber()
      })
      .catch(
        error => {
          console.log('fail')
        }
      )

      props.setPersons(props.persons.concat(nameObject))
      props.setNewName('Insert another name here...')
      props.setNewNumber('Insert another number here...')
    }
  }

  function isDuplicate(){
    
    const arrayOfNames = props.persons.map((person) => person.name)

    if (arrayOfNames.includes(props.valueName))
      return true

    return false
  }

  return(
    <form onSubmit={addName}>
      <div>name: <input onChange={props.onChangeName} value={props.valueName}/></div>
      <div>number: <input onChange={props.onChangeNumber} value={props.valueNumber}/></div>
      <div><button type="submit">add</button></div>
    </form> 
  )
}

 const Persons = (props) => { 
  return (
    <ul>
      { props.persons.map(person => <ul key={person.id}>{person.name} {person.number}</ul>) }
    </ul>
  ) 
}

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('Insert a name here...')
  const [newNumber, setNewNumber] = useState('Insert a number here...')

  const handleNameChange   = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter arrayOfPersons = {persons}/>

      <h3>Add a new</h3>

      <PersonForm 
        
        onChangeName={handleNameChange}
        onChangeNumber={handleNumberChange}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        valueName = {newName}
        valueNumber = {newNumber}
        persons={persons}
        setPersons={setPersons}
      />

      <h3>Numbers</h3>
      <Persons persons={persons}/>
      
    </div>
  )
}

export default App