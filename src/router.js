import { createRouter, createWebHistory } from 'vue-router';
import AppMain from './components/AppMain.vue';

const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'Main',
        component: AppMain,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
