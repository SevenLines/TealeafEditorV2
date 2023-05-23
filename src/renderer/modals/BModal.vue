<script setup lang="ts">
import {computed, onMounted, ref, toRefs, unref} from "vue";
import { Modal } from 'bootstrap';

const modal = ref()
const modalInstance = ref();

const props = defineProps({
    title: {
        default: "Modal title",
        type: String
    },
    okTitle: {
        default: "Ok"
    },
    okBtnClass: {
        default: "btn-danger"
    },
    cancelTitle: {
        default: "Отмена"
    },
    resolveValue: {
        default: true,
    },
    size: {
        default: "",
        type: String
    },
    centered: {
        default: false
    }
})

const emit = defineEmits(['cancel-click', 'ok-click'])

const {size} = toRefs(props);
let promise: Promise<boolean> | null = null;
let resolve: Function | null = null;

function show() {
    promise = new Promise((res, rej) => {
        resolve = res;
    });

    (modalInstance.value as any).show();
    return promise;
}

const klass = computed(() => {
    return {
        "modal-lg": size.value == 'lg',
        "modal-sm": size.value == 'sm',
        "modal-xl": size.value == 'xl',
        "modal-dialog-centered": props.centered,
    }
})


function onCancelClick() {
    if (resolve)
        resolve(false);
    emit('cancel-click');
}

function onOkClick () {
    if (resolve) {
        resolve(unref(props.resolveValue));
    }
    emit('ok-click');
}

onMounted(() => {
    modalInstance.value = new Modal(modal.value);
})

defineExpose({
    show
})
</script>


<template>
    <Teleport to="body">
        <div class="modal fade" ref="modal" tabindex="-1" >
            <div class="modal-dialog" :class="klass">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ title }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div class="modal-footer" v-if="okTitle || cancelTitle">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="onCancelClick"
                                v-if='cancelTitle'
                                v-html="cancelTitle"></button>
                        <button type="button" class="btn btn-primary" :class="{[okBtnClass]: true}" data-bs-dismiss="modal" @click="onOkClick"
                                v-if='okTitle'
                                v-html="okTitle"></button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>

</style>