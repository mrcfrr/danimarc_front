import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import * as bootstrap from 'bootstrap';

import './assets/js/index.js';
import './assets/styles/main.scss';


import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

createApp(App).use(router).mount('#app')
