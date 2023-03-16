import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/services/api';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        products: [],
        cart: [],
    },
    mutations: {
        setProducts: (state, products) => {
            state.products = products;
        },
        addToCart: (state, product) => {
            product.isBtnActive = false;
            product.quantity = 1;
            state.cart.push(product);
            let result = []
            for (let item of state.cart) {
                result.push(item.price.toFixed(2) * item.quantity.toFixed(2))
            }
            result = result.reduce(function (sum, el) {
                return sum + el
            });
            window.Telegram.WebApp.MainButton.show()
            window.Telegram.WebApp.MainButton.enable()
            window.Telegram.WebApp.MainButton.setParams({
                text: 'Оплатить ' + result.toFixed(2).toLocaleString() + ' ₽'
            })
        },
        increaseQuantity: (state, productId) => {
            state.cart.map(product => {
                if (product.id === productId) {
                    product.quantity++;
                    if (product.quantity > 0) {
                        product.isBtnActive = false;
                        window.Telegram.WebApp.MainButton.show()
                        window.Telegram.WebApp.MainButton.enable() 
                    }
                    let result = [];
                    for (let item of state.cart) {
                        result.push(item.price.toFixed(2) * item.quantity.toFixed(2));
                    }
                    result = result.reduce(function (sum, el) {
                        return sum + el;
                    })
                    window.Telegram.WebApp.MainButton.setParams({
                        text: 'Оплатить ' + result.toFixed(2).toLocaleString() + ' ₽'
                    })
                }
            })
        },
        reduceQuantity: (state, productId) => {
            state.cart.map(product => {
                if (product.id === productId) {
                    if (product.quantity > 0) {
                        product.quantity--;
                        let result = [];
                        for (let item of state.cart) {
                            result.push(item.price.toFixed(2) * item.quantity.toFixed(2));
                        }
                        result = result.reduce(function (sum, el) {
                            return sum + el;
                        })
                        window.Telegram.WebApp.MainButton.setParams({
                            text: 'Оплатить ' + result.toFixed(2).toLocaleString() + ' ₽'
                        })
                    }
                    if (product.quantity === 0) {
                        product.isBtnActive = true;
                        state.cart = state.cart.filter(product => product.id !== productId);
                        if(state.cart.length === 0){
                            window.Telegram.WebApp.MainButton.hide();
                            window.Telegram.WebApp.MainButton.disable();
                        } else{
                            let result = [];
                            for (let item of state.cart) {
                                result.push(item.price.toFixed(2) * item.quantity.toFixed(2));
                            }
                            result = result.reduce(function (sum, el) {
                                return sum + el;
                            })
                            window.Telegram.WebApp.MainButton.setParams({
                                text: 'Оплатить ' + result.toFixed(2).toLocaleString() + ' ₽'
                            })
                        }
                    }
                }
            })
        }
    },
    actions: {
        async fetchProducts({commit}) {
            const response = await api.fetchProducts();
            commit('setProducts', response.data);
            window.Telegram.WebApp.isClosingConfirmationEnabled = true;
            window.Telegram.WebApp.expand();
            window.Telegram.WebApp.MainButton.setParams({
                color: '#27ae60',
                text_color: '#fff'
            });
        },
        backButtonShow(){
            window.Telegram.WebApp.BackButton.show();
        }
    },
})
