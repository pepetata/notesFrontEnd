// require("dotenv").config();
import axios from "axios";
let server = import.meta.env.VITE_API_URL;
server ||= process.env.BASEURL;
const baseUrl = server + "/api/notes";
console.log(`=============== baseUrl`, baseUrl);
// const baseUrl = '/api/notes' // when using webservices server

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  return axios
    .get(baseUrl) // Return the promise here
    .then((response) => response.data)
    .catch((error) => {
      console.error("Failed to fetch notes:", error);
      throw error; // Re-throw the error to handle it in the calling code
    });
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = (id, newObject) => {
  console.log("node.js update id=", id, newObject);
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Failed to update notes:", error);
      throw error; // Re-throw the error to handle it in the calling code
    });
};

export default { getAll, create, update, setToken };
