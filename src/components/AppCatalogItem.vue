<template>
  <div class="category-list" v-show="products">
    <AppCatalogProduct 
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>

<script>
import { api } from '@/services/api'
import AppCatalogProduct from '@/components/AppCatalogProduct'
export default {
  name: "AppCatalogItem",
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  components: {
    AppCatalogProduct
  },
  data() {
    return {
      products: []
    }
  },
  mounted() {
    const id_store = localStorage.getItem('id_store')
    try {
      api.get(`/product/${id_store}/categories/${this.id}`).then((response) => {
        this.products = response.data.products
      })
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    background (buffer) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return 'data:image/png;base64,' + window.btoa( binary )
    }
  }
}
</script>