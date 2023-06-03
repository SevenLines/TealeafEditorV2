<script setup lang="ts">
import useDisciplineStore from "./store/disciplineStore";
import {storeToRefs} from "pinia";
import useLabsStore from "./store/labsStore";
import Console from "./components/Console.vue";
import {useRoute} from "vue-router";

const disciplineStore = useDisciplineStore();
const labsStore = useLabsStore();
const route = useRoute();

const {
    activeDiscipline
} = storeToRefs(disciplineStore)

const {
    activeLab
} = storeToRefs(labsStore)

async function onCreateBackupClick() {
    await window.electronAPI.db.backup();
}

</script>

<template>
    <console />
    <div style="display: grid; height: 100vh; grid-template-rows: auto 1fr">
        <nav class="navbar navbar-expand-sm bg-body-tertiary">
            <div class="container">
                <a class="navbar-brand" href="/">
                    <i class="fad fa-mug-hot"></i> Чаинка Натуральная
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-between w-100" id="navbarSupportedContent">
                    <div class="flex-grow-1"></div>
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="activeDiscipline">
                        <li>
                            <router-link  class="me-2" v-if="activeDiscipline" :to="`/discipline/${activeDiscipline.id}`">
                                {{ activeDiscipline.title }}
                            </router-link>
                             <router-link class="me-2" v-if="activeLab" :to="`/lab/${activeLab.id}`">
                                {{ activeLab.title }}
                            </router-link>
                        </li>
                    </ul>
                    <button class="btn btn-warning" @click="onCreateBackupClick">Создать бэкап</button>
                </div>
            </div>
        </nav>
        <div class="container-fluid" style="overflow-y: auto">
            <router-view/>
<!--            <router-view v-slot="{ Component }">-->
<!--              <transition name="fade" mode="out-in">-->
<!--                <component :is="Component" />-->
<!--              </transition>-->
<!--            </router-view>-->
        </div>
    </div>
</template>

<style lang="scss">
@import "assets/bootstrap-dark-theme.scss";
@import "assets/consts.scss";
@import "toastify-js/src/toastify.css";

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

#app {
  .breadcrumb {
    margin-bottom: 0;
  }
}

.dark {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #839496;
  text-align: left;
  background-color: #002b36;
}

.console {
  font-family: Courier, "Courier New", monospace;
  font-size: 14px;
  position: absolute;
  top: -100vh;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: black;
  color: white;
  z-index: 1000;
  box-sizing: border-box;
  opacity: 0;

  transition: all 0.3s;

  &.active {
    top: 0;
    opacity: 0.95;
  }
}
</style>
