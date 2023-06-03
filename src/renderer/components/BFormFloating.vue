<script setup lang="ts">
defineProps({
    title: {
        type: String,
        default: ""
    }
})
</script>

<template>
    <div class="form-floating">
        <slot></slot>
        <label for="" class="form-label">{{title}}</label>
    </div>
</template>

<style scoped>

</style>