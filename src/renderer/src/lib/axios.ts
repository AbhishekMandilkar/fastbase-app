import axios from "axios";


export const api = axios.create({
  baseURL: 'https://fastbase.in/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

