<script lang="ts" setup>
import useLabsStore from "../../store/labsStore";
import {storeToRefs} from "pinia";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {TaskDTO} from "../../types";
import useDisciplineStore from "../../store/disciplineStore";
import MarkdownEditor from "../../components/MarkdownEditor.vue";
import BCheckbox from "../../components/BCheckbox.vue";
import DifficultSelector from "./DifficultSelector.vue";
import {marked} from "marked";


const props = defineProps({
    task: {
        required: true,
        type: Object as () => TaskDTO | null
    }
})

const emit = defineEmits([
    "save",
    "cancel",
    "edit-subtask-clicked",
])

const disciplineStore = useDisciplineStore();
const {
    activeDiscipline
} = storeToRefs(disciplineStore)

const labsStore = useLabsStore();
const {
    labs
} = storeToRefs(labsStore)

const form = ref<any>({
    title: null,
    tags: null,
    order: null,
    group_id: null,
    custom_class: null,
    youtube_link: null,
    content: "",
    complexity: null,
    additional_content: "",
    visible: null,
    lab_id: null,
    show_help_in_modal: false,
})

watch(() => props.task, () => {
    form.value = {
        title: props.task ? props.task.title : null,
        tags: props.task ? props.task.tags : null,
        order: props.task ? props.task.order : null,
        group_id: props.task ? props.task.group_id : null,
        custom_class: props.task ? props.task.custom_class : null,
        youtube_link: props.task ? props.task.youtube_link : null,
        content: props.task ? props.task.content : "",
        complexity: props.task ? props.task.complexity : null,
        additional_content: props.task ? props.task.additional_content : "",
        visible: props.task ? props.task.visible : null,
        lab_id: props.task ? props.task.lab_id : null,
        show_help_in_modal: props.task ? props.task.show_help_in_modal : null,
    }
})

onMounted(() => {
        document.addEventListener("keydown", onKey);

})


onBeforeUnmount(() => {
        document.removeEventListener("keydown", onKey);

})


function onKey(e: any) {
    if (e.ctrlKey && (e.which == 83)) {
        e.preventDefault();
        onSaveClick(false)
    }
}

function onSaveClick(buttonClicked: any) {
    emit("save", form.value, buttonClicked)
}

</script>

<template>
    <div>
        <div class="d-flex justify-content-between mb-4">
            <button class="mr-2 btn btn-sm btn-danger" @click="onSaveClick(true);">Сохранить</button>
            <difficult-selector v-model="form.complexity"></difficult-selector>
            <button class="btn btn-sm btn-info" @click="$emit('cancel')">Отменить</button>
        </div>
        <div class="row mb-2">
            <div class="col">
                <input v-model="form.title" placeholder="Название" type="text" class="form-control">
            </div>
            <div class="col-auto">
                <div class="btn btn-info" @click="$emit('edit-subtask-clicked')">Сабтаски
                <span class="badge badge-light" v-if="task && task.subtasks">{{ task.subtasks.length }}</span></div>
            </div>
        </div>
        <div class="row align-items-end">
            <div class="col">
                <h2>Описание</h2>
            </div>
            <div class="col">
                <label>
                <b-checkbox class="ml-4" v-model="form.show_help_in_modal">модальное окно</b-checkbox>
                    <h2>Подсказка</h2>
                </label>
            </div>
        </div>
        <div class="row">
            <div class="col">

                <markdown-editor v-model="form.content"
                                 min-height="200px"
                                 max-height="200px"
                />
            </div>
            <div class="col">

                <markdown-editor v-model="form.additional_content"
                                 min-height="200px"
                                 max-height="200px"
                />
            </div>
        </div>
        <div class="row mb-2">
            <div class="col d-flex align-items-center">
                <div class="mr-2"><i class="fab fa-2x fa-youtube"></i></div>
                <input type="text" class="form-control" v-model="form.youtube_link">
            </div>
        </div>
        <div class="row">
            <div class="col d-flex align-items-center">
                <div class="flex-shrink-0 mr-2">Кастомный класс:</div>
                <input type="text" class="form-control" v-model="form.custom_class">
            </div>
        </div>
        <div class="row">
            <div class="col mt-2">
                <select class="form-control" v-model="form.lab_id">
                    <option :value="l.id" v-for="l in labs" :key="l.id">{{l.title}}</option>
                </select>
            </div>
        </div>
    </div>
</template>


<style scoped>

</style>