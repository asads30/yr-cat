import axios from "axios";

const SERVER_URL = 'http://localhost:8080';

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