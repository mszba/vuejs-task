import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Icon from 'vue-awesome/components/Icon.vue';
import VueMoment from 'vue-moment';
import 'vue-awesome/icons';
import './assets/global.css';

Vue.config.productionTip = false;
Vue.component('v-icon', Icon);
Vue.use(VueMoment);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
