import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    Authorization: 'query_id%3DAAG5iwoXAAAAALmLChdZm4w0%26user%3D%257B%2522id%2522%253A386567097%252C%2522first_name%2522%253A%2522Asadbek%2522%252C%2522last_name%2522%253A%2522Ibragimov%2522%252C%2522username%2522%253A%2522wpbrouz%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%257D%26auth_date%3D1680263589%26hash%3D6e0c3b3b4ff7777a55a87c80c7b9ed3cbbf2ba14509d7441c12c9ee169222655'
  }
})

export { api }