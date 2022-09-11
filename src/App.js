/**
 * Basic phonebook application, offering the user variety of options such as creating/deleting etc. This 
 * application involving server handling and React promises.
 *
 * @version 1.0.0
 * @author [Alon Butbul](https://github.com/alonbofficial)
 * @visibleName Ponebook application 🐙
 * @see See [CSS-basics] (https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics) 
 */
import { useState, useEffect } from 'react'
import React from 'react'
import phonebookService from './services/phonebook'

const Title = ({title}) => <h1>{title}</h1>
const Message = ({newMessage})  => <h1 className='messageComponent'>{newMessage}</h1>

/**
 * Letting the user to search for a contact using among others the filter function
 * @param {Array} phonebookList - The list of all contacts in the phonebook
 * @return {div} - containing the input and the DisplayContacts component
 */
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
/**
 * Letting the user to enter a contact to the phonebook. The info is being written to server and gets updated in the application
 * @param {Array} props - phonebookList, the list of all contacts 
 * @param {function} props - handlePhonebook, setting the phonebook with a new array
 * @param {function} props - handleMessage, setting the message with different output each time
 * @return {div} - form with user input
 */
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
      .then(() => {
        props.handleMessage(`${name} were added to the phonebook`)   
        setTimeout(() => {          
          props.handleMessage(null)        
        }, 5000)
      })
    }else{
      // A record was found matching the given name then:
      phonebookService.update(foundContact.id, { name, number })
      .then(response => props.handlePhonebook(props.phonebookList.map(record => record.id === foundContact.id ? response : record)))
      .then(() => {
        props.handleMessage(`${name} is already added to phonebook, old number got replaced with the new number`)   
        setTimeout(() => {          
          props.handleMessage(null)        
        }, 5000)
      })
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
/**
 * Displaying the contacts upon request. This component is also making use of the button component
 * @param {Array} props - phonebookList, the list of all contacts 
 * @param {function} props - handlePhonebook, setting the phonebook with a new array
 * @param {function} props - handleMessage, setting the message with different output each time
 * @return {table} - contacts with a button to delete specific contact
 */
const DisplayContacts = (props) => {

  return(
    <div>
      <table>
        <tbody>
          {props.phonebookList.map(record => 
          <tr key={record.id}>
            <td> {record.name} </td>
            <td> {record.number} </td>
            <td>
              <Button 
              id={record.id} 
              name={record.name} 
              phonebookList={props.phonebookList} 
              handlePhonebook={props.handlePhonebook} 
              handleMessage={props.handleMessage}
              />
            </td> 
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
/**
 * Button component to delete a record from the phonebook
 * @param {Array} props - phonebookList, the list of all contacts 
 * @param {function} props - handlePhonebook, setting the phonebook with a new array
 * @param {function} props - handleMessage, setting the message with different output each time
 * @param {String} props - name, the name of a specific contact
 * @param {String} props - id, the id of a specific contact. That id will be used to find the contact in the server
 * @return {table} - contacts with a button to delete specific contact
 */
const Button = (props) => {

  function handleClick(){
    
    if (window.confirm(`Do you really want to delete ${props.name}?`)) {
      
      phonebookService.deleteRecord(props.id)
      .catch(error => {
        props.handleMessage(`${props.name} has already been removed from server`)   
        setTimeout(() => {          
          props.handleMessage(null)        
        }, 5000)
      })

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
  const [message, setMessage] = useState('')
  const handleMessage = nextMessage => setMessage(nextMessage)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => setPhonebook(response))
      .catch(error => console.log(error))
  }, [])

  return (

    <div>
      <Title title='Phonebook'/>
      {
        message !== '' && message !== null &&       
        <Message newMessage={message}/>    
      }
      <FilterContacts phonebookList={phonebook}/>
      <Title title='Add a new person'/>
      <InsertToPhonebook phonebookList={phonebook} handlePhonebook={handlePhonebook} handleMessage={handleMessage}/>
      <Title title='Numbers'/>
      <DisplayContacts phonebookList={phonebook} handlePhonebook={handlePhonebook} handleMessage={handleMessage}/>
    </div>
  )
}

export default App