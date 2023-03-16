import axios from "axios";

const SERVER_URL = 'https://yr-cat.netlify.app';

const api = {
    async fetchProducts() {
        try {
            return axios(`${SERVER_URL}/products.json`);
        }
        catch (error) {
            console.error(error);
        }
    },
}

export default api;