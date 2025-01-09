import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Ensure router is imported correctly

createApp(App)
  .use(router) // Make sure router is applied to the app
  .mount('#app');
