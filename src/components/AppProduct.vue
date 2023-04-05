<template>
    <div class="product">
        <div class="product-box">
            <div :style="'background-image: url(' + require('../assets/icons/' + product.image) + ' );'" class="product-img"></div>
            <div class="product-info">
                <div class="product-header">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-des">{{ product.short }}</div>
                </div>
                <div class="product-footer">
                    <router-link class="product-back" to="/">Назад</router-link>
                    <button v-if="btnActive" class="product-add" type="button" @click="addToCart">{{ product.price.toLocaleString()/100 }} ₽</button>
                    <div v-if="!btnActive" class="product-quantity">
                        <button class="product-quantity-item product-quantity--minus" type="button" @click="reduceQuantity"></button>
                        <div class="product-quantity-val">{{ quantity }}</div>
                        <button class="product-quantity-item product-quantity--plus" type="button" @click="increaseQuantity"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from "vuex";
    export default {
        name: 'AppProduct',
        data() {
            return {
                quantity: 0
            }
        },
        computed: {
            product(){
                let products = this.$store.state.products;
                let productId = this.$route.params.slug;
                let getProduct = products.find(product => product.id == productId);
                return getProduct;
            },
            btnActive() {
                return this.$store.state.cart.find(product => product.id === this.product.id) ? this.product.isBtnActive : true;
            },
        },
        methods: {
            addToCart() {
                this.$store.commit('addToCart', this.product)
                this.quantity++
            },
            reduceQuantity() {
                this.$store.commit('reduceQuantity', this.product.id)
                this.quantity--
            },
            increaseQuantity() {
                this.$store.commit('increaseQuantity', this.product.id)
                this.quantity++
            },
            fetchData(){
                let current = this.$store.state.cart.find(product => product.id === this.product.id)?.quantity || null
                this.quantity = current
            },
            ...mapActions([
                'backButtonShow'
            ]),
            goHome(){
                this.$router.push('/');
            },
        },
        mounted() {
            this.fetchData();
            this.backButtonShow();
            window.Telegram.WebApp.onEvent('backButtonClicked', this.goHome);
        },
        watch: {
            $route: 'fetchData',
        }
    }
</script>