<script setup lang="ts">
import BFormFloating from "./BFormFloating.vue";
import BFormSelect from "./BFormSelect.vue";
import {SelectOption} from "../typings/electron";


defineProps({
    title: {
        type: String,
        default: ""
    },
    options: {
        type: Object as () => SelectOption[],
        required: true
    },
    modelValue: {}
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <b-form-floating :title="title">
        <b-form-select
            :model-value="modelValue"
            @update:modelValue="emit('update:modelValue', $event)"
            :options="options"
        />
    </b-form-floating>
</template>

<style scoped>

</style>