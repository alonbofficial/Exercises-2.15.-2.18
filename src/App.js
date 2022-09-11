import { useState, useEffect } from 'react'
import React from 'react'
import phonebookService from './services/phonebook'

const Title = ({title}) => <h2>{title}</h2>
const FilterContacts = ({phonebookList}) => {

  const [filter, setFilter] = useState('Filter by name...')
  const handleFilterChange = (event) => setFilter(event.target.value)
  const filteredList = phonebookList.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase()));

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
        <DisplayContacts phonebookList={filteredList}/>
      </div>
    )
}
const InsertToPhonebook = (props) => {

  const [name, setName] = useState('')
  const [number, setNumber] = useState('')

  function handleNewContactName(contactName){
    setName(contactName)
  }
  function handleNewContactNumber(phoneNumber){
    setNumber(phoneNumber)
  }
  const addContact = event => {

    event.preventDefault();
    
    //Check if the name is already in the phonebook:
    const foundContact = props.phonebookList.find(record => record.name === name)
    if(foundContact === undefined){
      // No record found:
      phonebookService.create( { name, number } )
      .then(response => props.handlePhonebook(props.phonebookList.concat(response.data)))
    }else{
      // A record was found matching the given name then:
      alert(`${name} is already added to phonebook, replace the old number with a new one?`)
      phonebookService.update(foundContact.id, { name, number })
      .then(response => props.handlePhonebook(props.phonebookList.map(record => record.id === foundContact.id ? response : record)))
    }    
  }

  return(
    <form onSubmit={addContact}>
      <div>name: <input onChange={(event) => handleNewContactName(event.target.value)}/></div>
      <div>number: <input onChange={(event) => handleNewContactNumber(event.target.value)}/></div>
      <div><button type="submit">Add contact</button></div>
    </form> 
  )
}
const DisplayContacts = (props) => {

  return(
    <div>
      <table>
        <tbody>
          {props.phonebookList.map(record => 
          <tr key={record.id}>
            <td> {record.name} </td>
            <td> {record.number} </td>
            <td><Button id={record.id} name={record.name} phonebookList={props.phonebookList} handlePhonebook={props.handlePhonebook}/></td> 
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
const Button = (props) => {

  function handleClick(){
    
    if (window.confirm(`Do you really want to delete ${props.name}?`)) {
      
      phonebookService.deleteRecord(props.id)
      props.handlePhonebook(
        props.phonebookList.filter(record => record.id !== props.id)
        )
    }    
  }
  return <button onClick={handleClick}>delete</button>
}

const App = () => {
  
  const [phonebook, setPhonebook] = useState([])
  const handlePhonebook = nextRecord => setPhonebook(nextRecord)
  
  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => setPhonebook(response))
      .catch(error => console.log(error))
  }, [])

  return (

    <div>
      <Title title='Phonebook'/>
      <FilterContacts phonebookList={phonebook}/>
      <Title title='Add a new person'/>
      <InsertToPhonebook phonebookList={phonebook} handlePhonebook={handlePhonebook}/>
      <Title title='Numbers'/>
      <DisplayContacts phonebookList={phonebook} handlePhonebook={handlePhonebook}/>
    </div>
  )
}

export default App