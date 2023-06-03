import DashboardView from "./views/DashboardView.vue";
import {createRouter, createWebHistory} from "vue-router";
import DisciplineView from "./views/DisciplineView.vue";
import LabView from "./views/LabView.vue";
import DbConnectionView from "./views/DbConnectionView.vue";

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
        {
            path: "/db-connection",
            name: "DbConnection",
            component: DbConnectionView,
        }
    ]
})

router.beforeEach(async (to, from) => {
    let status = await window.electronAPI.db.status()
    if (!status && to.name != 'DbConnection') {
        return {
            name: "DbConnection",
            query: {
                next: to.path
            },
        }
    }
    return true
})


export default router