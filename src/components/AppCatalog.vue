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
  import {api} from '@/services/api'
  
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
        const invoice = {
          provider_token: "1842663557:TEST:54fcd6df8cbdb866cbc53045a9bfa8f89b0bdb27",
          start_parameter: "get_access",
          title: "Тестовый магазин",
          description: "Тестовый магазин Карена",
          currency: "RUB",
          prices: this.cartList,
          payload: 'test',
          need_name: true,
          need_phone_number: true,
          need_email: false,
          need_shipping_address: true
        };
        axios.post(`https://api.telegram.org/bot5628922941:AAHibZzGLVFpG5ezw185_y-6h9gwLRePjf8/createInvoiceLink`, invoice).then(res => {
          if(res.data.result){
            let tg = window.Telegram.WebApp;
            tg.openInvoice(res.data.result, function(status) {
                if (status == 'paid') {
                    tg.WebApp.close();
                } else if (status == 'failed') {
                    tg.WebApp.HapticFeedback.notificationOccurred('error');
                } else {
                    tg.WebApp.HapticFeedback.notificationOccurred('warning');
                }
            });
          }
        });
      }
    },
    mounted() {
      this.loadData();
      this.fetchCategories();
      window.Telegram.WebApp.onEvent('mainButtonClicked', this.goPay);
    }
  }
  </script>