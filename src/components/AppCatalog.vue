<template>
    <div class="catalog">
        <div class="header">
          <b-nav pills class="header-nav" slot="header" v-b-scrollspy:nav-scroller>
            <b-nav-item href="#cat1" @click="scrollIntoView">Кроссовки</b-nav-item>
            <b-nav-item href="#cat2" @click="scrollIntoView">Толстовки</b-nav-item>
          </b-nav>
        </div>
        <div 
          id="nav-scroller"
          ref="content"
          class="catalog-content"
        >
            <div class="catalog-box" id="cat1">
                <div class="catalog-title">Кроссовки</div>
                <div class="catalog-des">Описание категории, самые лучшие кроссовки, в описание вмещается до 256 символов</div>
                <div class="catalog-list">
                    <AppCatalogItem
                        v-for="product in products"
                        :key="product.id"
                        :product="product"
                        :categoryId="1"
                    />
                </div>
            </div>
            <div class="catalog-box" id="cat2">
                <div class="catalog-title">Толстовки</div>
                <div class="catalog-des">Описание категории, самые лучшие кроссовки, в описание вмещается до 256 символов</div>
                <div class="catalog-list">
                    <AppCatalogItem
                        v-for="product in products"
                        :key="product.id"
                        :product="product"
                        :categoryId="2"
                    />
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import AppCatalogItem from "@/components/AppCatalogItem";
  import 'bootstrap/dist/css/bootstrap.min.css'
  import {mapState, mapMutations, mapActions} from 'vuex';
  
  export default {
    name: "AppCatalog",
    components: {AppCatalogItem},
    computed: {
      ...mapState([
        "products"
      ]),
    },
    methods: {
      ...mapMutations([
          'increaseQuantity',
          'reduceQuantity'
      ]),
      ...mapActions([
        'fetchProducts'
      ]),
      scrollIntoView(event) {
        event.preventDefault()
        const href = event.target.getAttribute('href')
        const el = href ? document.querySelector(href) : null
        if (el) {
          this.$refs.content.scrollTop = el.offsetTop
        }
      }
    },
    mounted() {
      this.fetchProducts()
    }
  }
  </script>