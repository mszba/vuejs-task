import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueMoment from 'vue-moment';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons';
import './assets/global.css';

Vue.config.productionTip = false;
Vue.component('v-icon', Icon);
Vue.use(VueMoment);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
