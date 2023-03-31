<template>
  <div class="category-list" v-show="products" style="display: flex;flex-wrap: wrap;gap: 12px;">
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
  }
}
</script>

<style scoped>
  .catalog-list{
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>