import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import ProfilePage from '../components/ProfilePage.vue';
import Collection from '../components/Collection.vue';
import Wishlist from '../components/Wishlist.vue';

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage,
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection,
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist,
  },


  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
