import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const create = record => axios.post(baseUrl, record)

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const deleteRecord = id => axios.delete(`${baseUrl}/${id}`)

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
  }

export default {create, getAll, deleteRecord, update}