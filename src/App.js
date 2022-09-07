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
    phonebookService.create( { name, number } )
    .then(response => {
      props.handlePhonebook(props.phonebookList.concat(response.data)) 
      setName('')
      setNumber('')
    })
  }

  return(
    <form onSubmit={addContact}>
      <div>name: <input onChange={(event) => handleNewContactName(event.target.value)}/></div>
      <div>number: <input onChange={(event) => handleNewContactNumber(event.target.value)}/></div>
      <div><button type="submit">Add contact</button></div>
    </form> 
  )
}
const DisplayContacts = ({phonebookList}) => {

  return(
    <div>
      <table>
        <tbody>
          {phonebookList.map(record => 
          <tr key={record.id}>
            <td> {record.name} </td><td> {record.number} </td> 
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  
  const [phonebook, setPhonebook] = useState([])
  const handlePhonebook = nextRecord => setPhonebook(nextRecord)
  
  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => {
        setPhonebook(response)  
        console.log(response)   
      })
      .catch(error => console.log(error))
  }, [])

  return (

    <div>
      <Title title='Phonebook'/>
      <FilterContacts phonebookList={phonebook}/>
      <Title title='Add a new person'/>
      <InsertToPhonebook phonebookList={phonebook} handlePhonebook={handlePhonebook}/>
      <Title title='Numbers'/>
      <DisplayContacts phonebookList={phonebook}/>
    </div>
  )
}

export default App