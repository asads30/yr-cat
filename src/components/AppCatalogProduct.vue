<template>
    <div class="item" v-if="product">
        <router-link class="item-top" :to="'/product/' + product.id">
            <div 
                :style="'background-image: url(' + background(product.thumbnail_buffer.data) + ');'"
                class="item-img"
            ></div>
        </router-link>
        <div class="item-info">
            <router-link class="item-name" :to="'/product/' + product.id">{{ product.name }}</router-link>
            <router-link class="item-des" :to="'/product/' + product.id">{{ product.description }}</router-link>
            <button
                v-if="btnActive"
                class="item-add"
                type="button"
                @click="addToCart"
            >{{ product.price.toLocaleString() }} ₽</button>
            <div v-if="!btnActive" class="quantity">
                <button class="quantity-item quantity-item--minus" type="button" @click="reduceQuantity"></button>
                <div class="quantity-val">{{ quantity }}</div>
                <button class="quantity-item quantity-item--plus" type="button" @click="increaseQuantity"></button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "AppCatalogProduct",
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      quantity: 0
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
    fetchData(){
      let current = this.$store.state.cart.find(product => product.id === this.product.id)?.quantity || null
      this.quantity = current
    }
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData'
  }
}
</script>