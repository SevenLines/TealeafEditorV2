<script setup lang="ts">

import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import useConsoleStore from "../store/consoleStore";
import {storeToRefs} from "pinia";

const consoleStore = useConsoleStore();

const {
    jekyllProcessLog,
    consoleActive
} = storeToRefs(consoleStore)

const logRef = ref();

const klass = computed(() => {
    return {
        'active': consoleActive.value
    }
})


onMounted(() => {
    document.addEventListener("keydown", onKey);
})

onBeforeUnmount(() => {
    document.removeEventListener("keydown", onKey);
})


watch(consoleActive, () => {
    (logRef.value as Element).scrollTop = (logRef.value as Element).scrollHeight
})

watch(jekyllProcessLog, () => {
    nextTick(() => {
        (logRef.value  as Element).scrollTop = (logRef.value as Element).scrollHeight
    })
}, {
    deep: true
})


function onKey(e: any) {
    if (e.ctrlKey && (e.keyCode == 192)) {
        e.preventDefault();
        consoleActive.value = !consoleActive.value;
    }
}
</script>

<template>
    <div class="console overflow-auto p-3"  :class="klass" ref="logRef">
        <span v-for="(log, index) in jekyllProcessLog" :key="index" v-html="log"></span>
    </div>
</template>

<style lang="scss" scoped>
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

    & > span {
        display: block;
        max-width: 100%;
        overflow: hidden;
        &:before {
            content: "> "
        }
    }

    &.active {
        top: 0;
        opacity: 0.95;
    }
}
</style>