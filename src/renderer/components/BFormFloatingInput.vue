<script setup lang="ts">
import BFormFloating from "./BFormFloating.vue";

defineProps({
    title: {
        type: String,
        default: ""
    },
    modelValue: {
    }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <b-form-floating :title="title">
        <input type="text" class="form-control" :value="modelValue" @input="emit('update:modelValue', $event.target.value)">
    </b-form-floating>
</template>

<style scoped>

</style>