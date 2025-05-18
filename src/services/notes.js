// require("dotenv").config();
import axios from 'axios'
const server = import.meta.env.VITE_API_URL
const baseUrl = server+ '/api/notes'
// const baseUrl = '/api/notes' // when using webservices server

const getAll = () => {
    return axios.get(baseUrl) // Return the promise here
        .then(response => response.data)
        .catch(error => {
            console.error('Failed to fetch notes:', error)
            throw error // Re-throw the error to handle it in the calling code
        })
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    console.log('node.js update id=',id, newObject)
    return axios.put(`${baseUrl}/${id}`, newObject)
        .then(response => response.data)
        .catch(error => {
            console.error('Failed to update notes:', error)
            throw error // Re-throw the error to handle it in the calling code
        })
}


export default { getAll, create, update }
