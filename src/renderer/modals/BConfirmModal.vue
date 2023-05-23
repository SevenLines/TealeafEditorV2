<script setup lang="ts">
import BModal from "./BModal.vue";
import {ref} from "vue";

const modalRef = ref();
const text = ref("")
const size = ref("sm")

function show( _text: string="", _size: string="sm") {
    text.value = _text;
    size.value = _size

    return modalRef.value.show()
}

defineExpose({
    show
})
</script>

<template>
    <b-modal title="Подтверждение" :centered="true" :size="size" ref="modalRef" v-bind="$attrs">
        <slot>{{text}}</slot>
    </b-modal>
</template>


<style scoped>

</style>