<template>
    <div class="input-group col">
        <span class="input-group-text" v-if="prepend">{{ prepend }}</span>
        <slot></slot>
        <span class="input-group-text"  v-if="postpend">{{ postpend }}</span>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    prepend: {type: String, default: null},
    postpend: {type: String, default: null},
})
</script>

<style scoped>

</style>