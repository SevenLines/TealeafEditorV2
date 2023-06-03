<script setup lang="ts">

import {useRouter} from "vue-router";
import {useRoute} from "vue-router";
import {onBeforeMount, ref, toRaw, watch} from "vue";
import BFormFloating from "../components/BFormFloating.vue";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import useToastsStore from "../store/toastsStore";

const router = useRouter();
const route = useRoute();
const toastsStore = useToastsStore();

const connectionOptions = ref({
    host: "localhost",
    port: 5432,
    username: "postgres",
    database: "postgres",
    password: "",
})

onBeforeMount(async () => {
    let options = (await window.electronAPI.db.options()) as PostgresConnectionOptions
    connectionOptions.value.host = options.host ?? "localhost"
    connectionOptions.value.port = options.port ?? 5432
    connectionOptions.value.username = options.username ?? "postgres"
    connectionOptions.value.database = options.database ?? "postgres"
    connectionOptions.value.password = options.password as string ?? ""

    connectionOptions.value = {...connectionOptions.value}
})


const connecting = ref(false);
async function connect() {
    connecting.value = true
    try {
        let r = await window.electronAPI.db.connect(toRaw(connectionOptions.value))
        if (r) {
            if (route.query.next) {
                await router.push(route.query.next)
            } else {
                await router.push("/")
            }
        }
    } catch (e: any) {
        console.error(e)
        toastsStore.showDanger(e.toString())
    }
    connecting.value = false
}
</script>

<template>
    <div class="container">
        <h1>Подключение к БД</h1>
        <div class="row g-3">
            <div class="col-12">
                <b-form-floating title="Хост">
                    <input type="text" class="form-control" :disabled="connecting" v-model="connectionOptions.host">
                </b-form-floating>
            </div>
            <div class="col-12">
                <b-form-floating title="Порт">
                    <input type="text" class="form-control" :disabled="connecting" v-model="connectionOptions.port">
                </b-form-floating>
            </div>
            <div class="col-12">
                <b-form-floating title="База">
                    <input type="text" class="form-control" :disabled="connecting" v-model="connectionOptions.database">
                </b-form-floating>
            </div>
            <div class="col-12">
                <b-form-floating title="Юзер">
                    <input type="text" class="form-control" :disabled="connecting" v-model="connectionOptions.username">
                </b-form-floating>
            </div>
            <div class="col-12">
                <b-form-floating title="Пароль">
                    <input type="password" class="form-control" :disabled="connecting" v-model="connectionOptions.password">
                </b-form-floating>
            </div>
            <div class="col-12 text-end">
                <button class="btn btn-info" v-if="connecting">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                </button>
                <button v-else class="btn btn-info" @click="connect">Подключится</button>
            </div>
        </div>

    </div>
</template>

<style scoped>

</style>