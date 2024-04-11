import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { createPinia } from 'pinia';
import VueTheMask from 'vue-the-mask';
import config from '../config';

import VueTippy from 'vue-tippy';
// or
// import { plugin as VueTippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css'; // optional for styling

library.add(fas, far, fab);
router.beforeEach((to, from, next) => {
   document.title = to.meta.title || 'TradeTrove';
   next();
});

// router.afterEach((to, from) => {
//    document.title = to.meta.title || 'TradeTrove';
// });

const app = createApp(App);

// app.config.globalProperties.$config = config;

app.use(router)
   .use(
      VueTippy,
      // optional
      {
         directive: 'tippy', // => v-tippy
         component: 'tippy', // => <tippy/>
         componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
         defaultProps: {
            placement: 'auto-end',
            allowHTML: true,
         }, // => Global default options * see all props
      }
   )
   .use(createPinia())
   .use(VueTheMask)
   .component('font-awesome-icon', FontAwesomeIcon)
   .mount('#app');
