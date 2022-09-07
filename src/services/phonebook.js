import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const create = record => axios.post(baseUrl, record)

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

export default {create, getAll}