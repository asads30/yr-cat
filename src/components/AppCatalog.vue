<template>
    <div class="catalog">
        <div class="header">
          <b-nav pills class="header-nav" slot="header" v-b-scrollspy:nav-scroller>
            <b-nav-item 
              v-for="category in categories"
              :key="category.id"
              :href="'#cat' + category.id" 
              @click="scrollIntoView"
            >
              {{ category.name }}
            </b-nav-item>
          </b-nav>
        </div>
        <div 
          id="nav-scroller"
          ref="content"
          class="catalog-content"
        >
            <div
              v-for="category in categories"
              :key="category.id"
              class="catalog-box"
              :id="'cat' + category.id"
            >
                <div class="catalog-title">{{ category.name }}</div>
                <div class="catalog-des">{{ category.description }}</div>
                <AppCatalogItem :id="category?.id" />
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import AppCatalogItem from "@/components/AppCatalogItem";
  import 'bootstrap/dist/css/bootstrap.min.css'
  import {mapState, mapMutations, mapActions} from 'vuex';
  import { api } from '@/services/api'
  
  export default {
    name: "AppCatalog",
    components: {AppCatalogItem},
    computed: {
      ...mapState([
        "categories",
        "cart"
      ]),
    },
    methods: {
      ...mapMutations([
          'increaseQuantity',
          'reduceQuantity'
      ]),
      ...mapActions([
        'fetchCategories'
      ]),
      scrollIntoView(event) {
        event.preventDefault()
        const href = event.target.getAttribute('href')
        const el = href ? document.querySelector(href) : null
        if (el) {
          this.$refs.content.scrollTop = el.offsetTop
        }
      },
      loadData(){
        const id = this.$route.params.id;
        localStorage.setItem('id_store', id);
        const tg = window.Telegram.WebApp;
        tg.isClosingConfirmationEnabled = true;
        tg.expand();
        tg.BackButton.hide();
        tg.MainButton.setParams({
            color: '#27ae60',
            text_color: '#fff'
        });
        localStorage.setItem('init_data', tg?.initData);
        localStorage.setItem('user_id', tg?.initDataUnsafe.user.id);
      },
      goPay(){
        let result = [];
        if (this.cart.length) {
          for (let product of this.cart) {
            for (let index = 0; index < product.quantity; index++) {
              result.push(product.post_id);
            }
          }
        }
        const invoice = {
          "arrayOfPostIds": result
        }
        const id_store = localStorage.getItem('id_store');
        try {
          api.post(`product/${id_store}/createInvoiceLink`, invoice).then(res => {
            this.goPayment(res.data);
          }).catch(e => {
            console.log(e)
          })
        } catch (err) {
            console.error(err)
        }
      },
      async goPayment(link){
        const tg = window.Telegram.WebApp;
        try {
          await tg.openInvoice(link, function(status) {
            if (status == 'paid') {
                tg.WebApp.close();
            } else if (status == 'failed') {
                tg.WebApp.HapticFeedback.notificationOccurred('error');
            } else {
                tg.WebApp.HapticFeedback.notificationOccurred('warning');
            }
          });
        } catch(err) {
          alert(err);
        }
      }
    },
    mounted() {
      this.loadData();
      this.fetchCategories();
      window.Telegram.WebApp.onEvent('mainButtonClicked', this.goPay);
    }
  }
  </script>