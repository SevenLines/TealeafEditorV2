<template>
    <select class="form-select"  v-model="v">
      <option :value="i.value" v-for="i in options">{{i.text}}</option>
    </select>
</template>

<script lang="ts" setup>
import {ref, toRefs, watch} from "vue";
import {SelectOption} from "../types";


const props = defineProps({
    options: {
        type: Object as () => SelectOption[],
        default: () => [],
        required: true
    },
    modelValue: {
        type: String,
        required: true
    }
})

const {modelValue} = toRefs(props)
const v = ref(props.modelValue);
const emit = defineEmits(['update:modelValue'])

watch(modelValue, () => {
    if (v.value != modelValue.value) {
        v.value = modelValue.value;
    }
})

watch(v, () => {
    emit('update:modelValue', v.value);
})

</script>

<style scoped>

</style>