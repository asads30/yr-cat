import Vue from 'vue'
import VueRouter from 'vue-router'
import AppCatalog from "@/components/AppCatalog"
import AppProduct from "@/components/AppProduct"

Vue.use(VueRouter)

const routes = [
  {
    path: '/shop/:id',
    component: AppCatalog,
    name: 'catalog',
  },
  {
    path: '/product/:id',
    component: AppProduct,
    name: 'product'
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
