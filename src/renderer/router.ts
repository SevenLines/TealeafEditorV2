import DashboardView from "./views/DashboardView.vue";
import {createRouter, createWebHistory} from "vue-router";
import DisciplineView from "./views/DisciplineView.vue";
import LabView from "./views/LabView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'DashboardView',
            component: DashboardView,
        },
        {
            path: '/discipline/:id',
            name: 'DisciplineView',
            component: DisciplineView,
            props: true,
        },
        {
            path: '/lab/:id',
            name: 'LabView',
            component: LabView,
            props: true,
        },
    ]
})

export default router