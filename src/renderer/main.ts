import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import {createPinia} from "pinia";
import "bootstrap/dist/css/bootstrap.css"
import "./assets/fontawesome/css/all.min.css";
import "./assets/base.scss"
// import "./assets/bootstrap.lumen.min.css"


const app = createApp(App);

app.use(createPinia())
app.use(router)

app.mount('#app');
