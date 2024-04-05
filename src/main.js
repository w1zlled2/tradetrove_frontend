import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { createPinia } from 'pinia';
library.add(fas, far, fab);
router.beforeEach((to, from, next) => {
   document.title = to.meta.title || 'TradeTrove';
   next();
});

// router.afterEach((to, from) => {
//    document.title = to.meta.title || 'TradeTrove';
// });

createApp(App).use(router).use(createPinia()).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
