import { createRouter, createWebHistory } from 'vue-router';
import AppMain from './components/AppMain.vue';

const routes = [
    {
        path: '/nas',
        name: 'Main',
        component: AppMain,
        props: route => {
            const initialPath = route.query.path ? decodeURIComponent(route.query.path) : '';
            console.log("Router is passing initialPath as:", initialPath);
            return { initialPath };
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: (to) => {
            const { query } = to;
            if (query.path) {
                // Se il path è presente, redirige con il path come query
                return { path: '/nas', query: { path: query.path } };
            } else {
                // Altrimenti redirige alla main directory senza alcun path
                return { path: '/nas' };
            }
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    console.log('Navigating from', from.fullPath, 'to', to.fullPath);
    if (to.query.path) {
        console.log('Query path is', to.query.path);
        next();
    } else {
        console.warn('No path found in query, staying in main directory');
        next();
    }
});

router.afterEach((to) => {
    console.log('Navigation complete to', to.fullPath);
});

export default router;
