<template>
    <div class="catalog">
        <div class="header">
          <b-nav pills class="header-nav" slot="header" v-b-scrollspy:nav-scroller>
            <b-nav-item 
              v-for="category in getActiveCategories"
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
                <AppCatalogItem :id="category?.id" :name="category?.name" :description="category?.description" />
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import AppCatalogItem from "@/components/AppCatalogItem";
  import 'bootstrap/dist/css/bootstrap.min.css'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import { api } from '@/services/api'
  
  export default {
    name: "AppCatalog",
    components: {AppCatalogItem},
    computed: {
      ...mapState([
        "activeCategories",
        "categories",
        "cart"
      ]),
      ...mapGetters([
        "getProducts",
        "getActiveCategories"
      ])
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
        // const id = this.$route.params.id;
        // const tg = window.Telegram.WebApp;
        // tg.isClosingConfirmationEnabled = true;
        // tg.expand();
        // tg.BackButton.hide();
        // tg.MainButton.setParams({
        //     color: '#27ae60',
        //     text_color: '#fff'
        // });
        // localStorage.setItem('id_store', id);
        // localStorage.setItem('init_data', tg?.initData);
        // localStorage.setItem('user_id', tg?.initDataUnsafe.user.id);
        localStorage.setItem('id_store', 'fefc4f1e4705752a99644bd7769776e5049303a4c35131a512bedeaca59b3cd5');
        localStorage.setItem('init_data', 'query_id=AAG5iwoXAAAAALmLChc9Pr_G&user=%7B%22id%22%3A386567097%2C%22first_name%22%3A%22Asadbek%22%2C%22last_name%22%3A%22Ibragimov%22%2C%22username%22%3A%22wpbrouz%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1681148982&hash=4e2ba8f57396f29bf6d3b2f7d1ac39aedbf29c1c4ae017126427407d6e399f95');
        localStorage.setItem('user_id', 386567097)
      },
      async goPay(){
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
          await api.post(`product/${id_store}/createInvoiceLink`, invoice).then(res => {
            window.Telegram.WebApp.openInvoice(res.data, function(status) {
            if (status == 'paid' || status == 'pending') {
              tg.WebApp.close();
              tg.WebApp.HapticFeedback.notificationOccurred('success');
            } else if(status == 'cancelled' || status == 'failed') {
              tg.WebApp.HapticFeedback.notificationOccurred('error');
            } else{
              tg.WebApp.HapticFeedback.notificationOccurred('error');
            }
          });
          }).catch(e => {
            console.log(e)
          })
        } catch (err) {
            console.error(err)
        }
        window.Telegram.WebApp.offEvent('mainButtonClicked', this.goPay);
      }
    },
    mounted() {
      this.loadData();
      this.fetchCategories();
      // window.Telegram.WebApp.onEvent('mainButtonClicked', this.goPay);
    }
  }
  </script>