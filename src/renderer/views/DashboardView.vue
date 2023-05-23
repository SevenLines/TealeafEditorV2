<script lang="ts" setup>

// import {Vue, Watch} from "vue-property-decorator";
// import {mapActions, mapState} from "vuex";
// import Component from "vue-class-component";
// import Discipline from "../models/Discipline";
// import {shell} from "electron";
// import Lab from "../models/Lab";
// import fs from "fs";
// import {getFiles} from "../utils";


import {DisciplineDTO} from "../types";
import {computed, onBeforeMount, ref} from "vue";
import useDisciplineStore from "../store/disciplineStore";
import {storeToRefs} from "pinia";
import BCheckbox from "../components/BCheckbox.vue";
import BOverlay from "../components/BOverlay.vue";
import BInputModal from "../modals/BInputModal.vue";
import BModal from "../modals/BModal.vue";
import BInputGroup from "../components/BInputGroup.vue";
import {useRouter} from "vue-router";
import BConfirmModal from "../modals/BConfirmModal.vue";

const disciplineStore = useDisciplineStore();
const router = useRouter()

const {
    disciplines,
    fetching,
    updating,
} = storeToRefs(disciplineStore)
const showArchive = ref(false);
const confirmModalRef = ref();
const addDisciplineModelRef = ref();
const newDisciplineTitle = ref("")
const newDisciplineJekyllFolder = ref("")


onBeforeMount(() => {
    disciplineStore.fetchDisciplines();
})

async function  onAddDisciplineClick() {
    let r = await addDisciplineModelRef.value.show()
    if (r) {
        await disciplineStore.upsertDiscipline({
            jekyll_folder: newDisciplineJekyllFolder.value,
            title: newDisciplineJekyllFolder.value,
        })
        await disciplineStore.fetchDisciplines();
    }
}

async function  onRemove(discipline: DisciplineDTO) {
    let r = await confirmModalRef.value.show(`Точно удалить дисциплину ${discipline.title}?`)
    if (r) {
        await disciplineStore.deleteDiscipline(discipline.id)
        await disciplineStore.fetchDisciplines();
    }
}

async function  onRemoveImages(discipline: DisciplineDTO) {
    // await discipline.removeUnusedImages();
}

async function  onCopy(discipline: DisciplineDTO) {
    await disciplineStore.copyDiscipline(discipline.id)
    await disciplineStore.fetchDisciplines()
}

function onSiteUrlClick(d: DisciplineDTO) {
    window.electronAPI.fsOpenUrlInBrowser(d.site_url)
    // shell.openExternal(d.site_url);
}

async function onArchiveClick(d: DisciplineDTO) {
    await disciplineStore.upsertDiscipline({
        ...d,
        archive: !d.archive,
    })
    await disciplineStore.fetchDisciplines();
}

const disciplinesFiltered = computed(() => {
    return disciplines.value.filter(x => !x.archive || showArchive.value);
})
// }
</script>


<template>
    <b-confirm-modal ref="confirmModalRef"/>
    <b-modal ref="addDisciplineModelRef" title="Добавить дисциплину">
        <b-input-group prepend="Название" class="mb-2">
            <input class="form-control" type="text" v-model="newDisciplineTitle">
        </b-input-group>
        <b-input-group prepend="Папка jekyll">
            <input class="form-control" type="text" v-model="newDisciplineJekyllFolder">
        </b-input-group>
    </b-modal>

    <div class="container mt-4">
        <div class="d-flex align-items-center">
        <h2>Дисциплины
            <button class="btn btn-sm btn-primary" @click="onAddDisciplineClick">
                <i class="fas fa-plus"></i></button>
        </h2>
            <b-checkbox class="ms-4" v-model="showArchive">архивные</b-checkbox>
        </div>
        <b-overlay :show="fetching || updating">
        <div class="d-flex align-items-center justify-content-between border-bottom p-1 pl-0" v-for="d in disciplinesFiltered"
             :key="d.id">
            <div>
                <button v-if="d.site_url" class="me-2 btn btn-outline-primary btn-sm" @click="onSiteUrlClick(d)">
                    <i class="fad fa-link"></i>
                </button>
                <router-link :to="`/discipline/${d.id}`">
                    {{ d.title }}
                </router-link>
            </div>
            <div>
                <button class="ms-4 btn btn-sm" :class="{'btn-info': d.archive, 'btn-outline-info': !d.archive}" @click="onArchiveClick(d)">
                    <span class="me-2" v-if="d.archive">В архиве</span>
                    <i class="fad fa-file-archive"></i>
                </button>
                <button class="ms-2 btn btn-outline-success" @click="onCopy(d)">
                    <i class="fad fa-copy"></i>
                </button>
                <button class="ms-2 btn btn-outline-danger btn-sm" @click="onRemoveImages(d)">
                    <i class="fad fa-image"></i>
                </button>
                <button class="ms-2 btn btn-outline-danger btn-sm"  @click="onRemove(d)">
                    <i class="fad fa-trash"></i>
                </button>
            </div>
        </div>
        </b-overlay>
    </div>
</template>

