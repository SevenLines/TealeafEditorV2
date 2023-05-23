<script setup lang="ts">
import {ref, watch} from "vue";
import BModal from "./BModal.vue";

type StringCallbackFunction = (value: string) => void

const props = defineProps({
    message: {
        type: String,
        default: "",
    },
})

const callback = ref<StringCallbackFunction | null>()
const modalRef = ref();
const inputValue = ref<string>("")

function show(defaultValue: string="") {
    inputValue.value = defaultValue;
    return modalRef.value.show()
}

function onOkClick() {
    if (callback.value)
        callback.value(inputValue.value);
}

defineExpose({
    show
})
</script>

<template>
    <b-modal ref="modalRef" v-bind="$attrs" :resolve-value="inputValue">
        <div>{{message}}</div>
        <input type="text" class="form-control mt-1" v-model="inputValue">
    </b-modal>
</template>


<style scoped>

</style>