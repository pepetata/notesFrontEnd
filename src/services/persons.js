import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl) // Return the promise here
        .then(response => response.data)
        .catch(error => {
            console.error('Failed to fetch persons:', error)
            throw error // Re-throw the error to handle it in the calling code
        })
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
        .then(response => response.data)
        .catch(error => {
            console.error('Failed to create a new person:', error)
            throw error
        })
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
        .then(response => response.data)
        .catch(error => {
            console.error('Failed to update persons:', error)
            throw error
        })
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Failed to delete persons:', error)
            throw error
        })
}


export default { getAll, create, update, deletePerson}
