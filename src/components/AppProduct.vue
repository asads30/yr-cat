<template>
    <div class="product" v-if="product">
        {{ product }}
    </div>
  </template>
  
<script>
    import { api } from '@/services/api'
    export default {
        name: "AppCatalogProduct",
        data() {
            return {
                quantity: 0,
                product: null
            }
        },
        computed: {
            btnActive() {
                return this.$store.state.cart.find(product => product.id === this.product.id) ? this.product.isBtnActive : true;
            }
        },
        methods: {
            addToCart() {
                this.$store.commit('addToCart', this.product);
                this.quantity++
            },
            reduceQuantity() {
                this.$store.commit('reduceQuantity', this.product.id);
                this.quantity--
            },
            increaseQuantity() {
                this.$store.commit('increaseQuantity', this.product.id);
                this.quantity++
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
            try {
                api.get(`/product/${id_store}/products/${product_id}`).then((response) => {
                    this.product = response
                })
            } catch (error) {
                console.log(error)
            }
        }
  }
  </script>