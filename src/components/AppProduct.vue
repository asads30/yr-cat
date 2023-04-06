<template>
    <div class="product">
        <div class="product-box">
            <div :style="'background-image: url(' + background(product.thumbnail_buffer.data) + ');'" class="product-img"></div>
            <div class="product-info">
                <div class="product-header">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-des">{{ product.short }}</div>
                </div>
                <div class="product-footer">
                    <router-link class="product-back" to="/">Назад</router-link>
                    <button v-if="btnActive" class="product-add" type="button" @click="addToCart">{{ getPrice.toLocaleString() }} ₽</button>
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
import { api } from '@/services/api'

export default {
    name: 'AppProduct',
    computed: {
        product(){
            let products = this.$store.state.products;
            let productId = this.$route.params.slug;
            let getProduct = products.find(product => product.id == productId);
            return getProduct;
        },
        quantity() {
            return this.$store.state.cart.find(product => product.id === this.product.id)?.quantity || null;
        },
        btnActive() {
            return this.$store.state.cart.find(product => product.id === this.product.id) ? this.product.isBtnActive : true;
        },
        getPrice(){
            const price = this.product.price/100
            return price
        }
    },
    methods: {
        addToCart() {
            this.$store.commit('addToCart', this.product);
        },
        reduceQuantity() {
            this.$store.commit('reduceQuantity', this.product.id);
        },
        increaseQuantity() {
            this.$store.commit('increaseQuantity', this.product.id);
        },
        goHome(){
            this.$router.push({name: 'catalog'});
        },
        goPay(){
            let result = [];
            if (this.cart.length) {
            for (let product of this.cart) {
                result.push(product.post_id);
            }
            }
            const invoice = {
            "arrayOfPostIds": result
            }
            const id_store = localStorage.getItem('id_store')
            try {
                const res = api.post(`product/${id_store}/createInvoiceLink`, invoice)
                const tg = window.Telegram.WebApp;
                tg.openInvoice(res.data, function(status) {
                if (status == 'paid') {
                    tg.WebApp.close();
                } else if (status == 'failed') {
                    tg.WebApp.HapticFeedback.notificationOccurred('error');
                } else {
                    tg.WebApp.HapticFeedback.notificationOccurred('warning');
                }
            });
            } catch (err) {
                console.error(err)
            }
        },
        background (buffer) {
            var binary = '';
            var bytes = new Uint8Array( buffer );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            return 'data:image/png;base64,' + window.btoa( binary )
        }
    },
    mounted() {
        window.Telegram.WebApp.onEvent('backButtonClicked', this.goHome);
        window.Telegram.WebApp.onEvent('mainButtonClicked', this.goPay);
    }
}
</script>