<script lang="ts" setup>

import useLabsStore from "../store/labsStore";
import {storeToRefs} from "pinia";
import useDisciplineStore from "../store/disciplineStore";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {computed, ref, toRaw, watch} from "vue";
import {DisciplineDTO, LabDTO} from "../types";
import BModal from "../modals/BModal.vue";
import LabEditModal from "../modals/LabEditModal.vue";
import _ from 'lodash';
import BConfirmModal from "../modals/BConfirmModal.vue";
import {Sortable} from "sortablejs-vue3";
import {moveItemInArray} from "../utils";
import useConsoleStore from "../store/consoleStore";
import BOverlay from "../components/BOverlay.vue";

const labsStore = useLabsStore();
const disciplineStore = useDisciplineStore();
const consoleStore = useConsoleStore();
const route = useRoute()

const props = defineProps({
    id: {
        default: 0
    }
})

const {
    fetching,
    updating,
} = storeToRefs(labsStore)

const {
    activeDiscipline,
} = storeToRefs(disciplineStore)
const disciplineToEdit = ref<DisciplineDTO | null>()
const labEditModalRef = ref<any>();
const confirmModalRef = ref();
const labs = ref<LabDTO[]>([])

watch(() => props.id, () => {
    disciplineStore.setActiveDiscipline(props.id)
}, {immediate: true})

watch(activeDiscipline, () => {
    if (activeDiscipline.value) {
        disciplineToEdit.value = {...activeDiscipline.value};
        refetchLabs()
    }
})

const isSaveEnabled = computed(() => {
    if (!activeDiscipline.value)
        return

    return activeDiscipline.value.title != disciplineToEdit.value.title
        || activeDiscipline.value.jekyll_folder != disciplineToEdit.value.jekyll_folder
        || activeDiscipline.value.deploy_command != disciplineToEdit.value.deploy_command
        || activeDiscipline.value.site_url != disciplineToEdit.value.site_url
})


async function refetchLabs() {
    if (activeDiscipline.value)
        labs.value = await labsStore.fetchLabs(activeDiscipline.value.id)
}

async function onSaveClick() {
    if (disciplineToEdit.value) {
        await disciplineStore.upsertDiscipline(disciplineToEdit.value);
    }
}


async function onToggleEye(lab: LabDTO) {
    await labsStore.upsertLab({
        ...lab,
        visible: !lab.visible
    })
    await refetchLabs();
}

async function onToggleSecret(lab: LabDTO) {
    await labsStore.upsertLab({
        ...lab,
        secret: !lab.secret
    })
    await refetchLabs();
}


async function onLabTaskSortClick() {
    // (this.$refs.labTaskSorterRef as any).show();
}

async function onLabEditClick(lab: LabDTO) {
    let r = await labEditModalRef.value.show(lab);
    if (r) {
        await labsStore.upsertLab(r)
        await refetchLabs();
    }
}

async function onLabAddClick() {
    if (activeDiscipline.value) {
        let r = await labEditModalRef.value.show({
            alias: "",
            title: "Новая",
            order: (_(labs).map((x: LabDTO) => x.order).max() + 1) || 0,
            icon: "",
            type: 0,
            content: "",
            content_additional: "",
            remark: "",
            discipline_id: activeDiscipline.value.id,
        });
        if (r) {
            await labsStore.upsertLab(r)
            await refetchLabs();
        }
    }
}

async function onLabRemove(lab: LabDTO) {
    let r = await confirmModalRef.value.show(`Точно удалить лабу "${lab.title}"?`);
    if (r) {
        await labsStore.deleteLab(lab.id);
        await refetchLabs();
    }

}

async function onLabSortEnd(event: any) {
    if (labs.value) {
        moveItemInArray(labs.value, event.oldIndex, event.newIndex);
        await labsStore.updateLabsOrder(labs.value)
        await refetchLabs();
    }
}

async function onGenerateClick() {

}

async function onRunProcessClick() {
    if (activeDiscipline.value) {
        window.electronAPI.deployRunJekyllProcess(activeDiscipline.value.id)
    }
}

async function onDeployClick() {
    let r = await confirmModalRef.value.show("Создать коммит?")

    consoleStore.consoleActive = true;
    consoleStore.clearLog();
    if (activeDiscipline.value) {
        await disciplineStore.runDeployProcess(activeDiscipline.value.id, !!r)
    }
}

// private jekyllProcess!: any;

//
// markdownFileFormPermalink: string = "";
// markdownFileFormTitle: string = "";

//
// async onJekyllFolderSelect() {
//     let result = dialog.showOpenDialogSync({
//         defaultPath: this.activeDiscipline.jekyll_folder,
//         properties: ['openDirectory']
//     })
//     if (result) {
//         this.activeDiscipline.jekyll_folder = result[0];
//         await this.activeDiscipline.save()
//     }
// }
//
// async onGenerateClick() {
//     await this.activeDiscipline.generateLabsYaml()
// }
//
// onRunProcessClick() {
//     if (!this.jekyllProcess) {
//         this.$store.dispatch("runJekyllProcess")
//     } else {
//         this.$store.dispatch("killJekyllProcess")
//     }
// }

//
// async onAddMarkdownFileOk() {
//     let pth = path.join(this.activeDiscipline.jekyll_folder, "common", `${this.markdownFileFormTitle}.md`)
//     let content = `---
// layout: page
// permalink: ${this.markdownFileFormPermalink}
// title: ${this.markdownFileFormTitle}
// toc: true
// ---`
//     await fs.writeFile(pth, content, err => {
//         if (err) {
//             console.error(err)
//         }
//         this.$store.dispatch("fetchActiveDisciplineArticles")
//     })
// }
//
// async onRemoveMarkdownFile(file) {
//     console.log(file)
//     let doDelete = await this.$bvModal.msgBoxConfirm(
//         `Точно удалить файл ${file.title}?`, {
//             title: 'Подтвердите',
//             size: 'sm',
//             buttonSize: 'sm',
//             okVariant: 'danger',
//             okTitle: 'Удалить',
//             cancelTitle: 'НЕЕЕЕТ!!!',
//             footerClass: 'p-2',
//             hideHeaderClose: false,
//             centered: true
//         })
//     if (doDelete) {
//         fs.unlinkSync(file.path)
//         await this.$store.dispatch("fetchActiveDisciplineArticles")
//     }
// }
//
// onOpenMarkdownLink(f) {
//     let href = `http://localhost:4000/${f.permalink}`
//     shell.openExternal(href);
// }
//
// onSiteUrlClick(f) {
//     shell.openExternal(this.activeDiscipline.site_url);
// }
</script>


<template>
    <lab-edit-modal ref="labEditModalRef"/>
    <b-confirm-modal ref="confirmModalRef"/>
    <div class="container">
        <form class="row g-3 mb-3" v-if="disciplineToEdit">
            <div class="col-md-6">
                <label for="inputEmail4" class="form-label">Название</label>
                <input type="text" class="form-control" v-model="disciplineToEdit.title">
            </div>
            <div class="col-md-6">
                <label for="inputPassword4" class="form-label">Путь к папке jekyll</label>
                <input type="text" class="form-control" v-model="disciplineToEdit.jekyll_folder">
            </div>
            <div class="col-12">
                <label for="inputAddress" class="form-label">Скрипт для деполя</label>
                <input type="text" class="form-control" v-model="disciplineToEdit.deploy_command">
            </div>
            <div class="col-12">
                <label for="inputAddress2" class="form-label">Ссылка на сайт</label>
                <input type="text" class="form-control" v-model="disciplineToEdit.site_url">
            </div>
        </form>
        <div class="d-flex justify-content-between">
            <button class="btn btn-info" @click="onSaveClick" :disabled="!isSaveEnabled">
                Сохранить
            </button>
            <div>
                <!--                <button class="ms-2 btn btn-warning" @click="onLabTaskSortClick">-->
                <!--                    Раскидать задачи-->
                <!--                </button>-->
                <div class="btn-group">
                    <button class="ms-2 btn btn-warning" @click="onGenerateClick">
                        Сгенерировать
                    </button>
                    <button class="ml-2 btn btn-warning" @click="onRunProcessClick">
                        <span >Запустить</span>
                    </button>
                </div>
                <button class="ms-2 btn btn-danger" @click="onDeployClick">
                    Задеплоить
                </button>
            </div>
        </div>
        <hr>

    </div>
    <div class="container">
        <div class="row" style="height: 100%">
            <h2>Лабы
                <button class="btn btn-sm btn-info" @click="onLabAddClick">+</button>
            </h2>
            <div class="col overflow-auto" style="height: calc(100% - 2em)">
                <b-overlay :show="fetching || updating">
                <Sortable :list="labs" item-key="id" tag="div" :options="{handle: '.drag-item'}" @end="onLabSortEnd">
                    <template #item="{element, index}">
                        <div class="d-flex align-items-center justify-content-between border-bottom p-1 pl-0">
                            <div class="d-flex">
                                <div class="drag-item me-2 cursor-move">
                                    <i class="fa-solid fa-bars"></i>
                                </div>
                                <div>
                                    <!--                        <a href="#" @click="setActiveLabId(l.id)">-->
                                    <router-link :to="`/lab/${element.id}`">
                                        <i :class="element.icon"></i> {{ element.title }}
                                    </router-link>
                                    <!--                        </a>-->
                                </div>
                            </div>
                            <div>
                                <button class="ms-2 btn btn-sm btn-outline-info"
                                        @click="onToggleEye(element)">
                                    <i class="fad"
                                       :class="{'fa-eye': element.visible, 'fa-eye-slash': !element.visible}"></i>
                                </button>
                                 <button class="ms-2 btn btn-sm btn-outline-info"
                                        @click="onToggleSecret(element)">
                                    <i :class="{'fa-duotone fa-key': element.secret, 'fa-light fa-key': !element.secret}"></i>
                                </button>
                                <button class="ms-2  btn btn-sm btn-outline-info"
                                        @click="onLabEditClick(element)">
                                    <i class="fad fa-edit"></i>
                                </button>
                                <button class="ms-2  btn btn-sm btn-outline-danger" @click="onLabRemove(element)">
                                    <i class="fad fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </template>
                </Sortable>
                </b-overlay>
            </div>
            <!--             <div class="col ml-4 overflow-auto" style="height: calc(100% - 2em)">-->
            <!--                <div class="d-flex align-items-center justify-content-between border-bottom p-1 pl-0"-->
            <!--                     v-for="f in activeDisciplineArticles" :key="f.name">-->
            <!--                    <div>-->
            <!--                        <router-link :to="`/discipline/${activeDiscipline.id}/article/${f.title}`">-->
            <!--                            {{ f.title }}-->
            <!--                        </router-link>-->
            <!--                    </div>-->
            <!--                    <div>-->
            <!--                        <button @click="onOpenMarkdownLink(f)" class="ml-2  btn btn-sm btn-outline-info">-->
            <!--                            <i class="fad fa-link"></i>-->
            <!--                        </button>-->
            <!--                        <button class="ml-2 btn btn-sm btn-outline-danger"-->
            <!--                                  @click="onRemoveMarkdownFile(f)">-->
            <!--                            <i class="fad fa-trash"></i>-->
            <!--                        </button>-->
            <!--                    </div>-->
            <!--                </div>-->

            <!--            </div>-->
        </div>
    </div>
    <!--            <div class="container flex-grow-1 overflow-hidden">-->
    <!--                <div class="row" style="height: 100%">-->
    <!--                    <div class="col overflow-auto" style="height: calc(100% - 2em)">-->
    <!--                        <draggable v-model="labs" group="people" @start="drag=true" @end="drag=false">-->
    <!--                            <div class="d-flex align-items-center justify-content-between border-bottom p-1 pl-0"-->
    <!--                                 v-for="l in labs" :key="l.id">-->
    <!--                                <div>-->
    <!--                                    <a href="#" @click="setActiveLabId(l.id)">-->
    <!--                                        <router-link :to="`/lab/${l.id}`">-->
    <!--                                            <i :class="l.icon"></i> {{ l.title }}-->
    <!--                                        </router-link>-->
    <!--                                    </a>-->
    <!--                                </div>-->
    <!--                                <div>-->
    <!--                                    <b-button class="ml-2" size="sm" variant="outline-info"-->
    <!--                                              @click="onToggleEye(l)">-->
    <!--                                        <i class="fad" :class="{'fa-eye': l.visible, 'fa-eye-slash': !l.visible}"></i>-->
    <!--                                    </b-button>-->
    <!--                                    <b-button v-b-modal.labEditModel class="ml-2" size="sm" variant="outline-info"-->
    <!--                                              @click="onLabEditClick(l)">-->
    <!--                                        <i class="fad fa-edit"></i>-->
    <!--                                    </b-button>-->
    <!--                                    <b-button class="ml-2" size="sm" variant="outline-danger" @click="onRemove(l)">-->
    <!--                                        <i class="fad fa-trash"></i>-->
    <!--                                    </b-button>-->
    <!--                                </div>-->
    <!--                            </div>-->
    <!--                        </draggable>-->
    <!--                    </div>-->
    <!--                    <div class="col ml-4 overflow-auto" style="height: calc(100% - 2em)">-->
    <!--                        <div class="d-flex align-items-center justify-content-between border-bottom p-1 pl-0"-->
    <!--                             v-for="f in activeDisciplineArticles" :key="f.name">-->
    <!--                            <div>-->
    <!--                                <router-link :to="`/discipline/${activeDiscipline.id}/article/${f.title}`">-->
    <!--                                    {{ f.title }}-->
    <!--                                </router-link>-->
    <!--                            </div>-->
    <!--                            <div>-->
    <!--                                <b-button @click="onOpenMarkdownLink(f)" class="ml-2" size="sm" variant="outline-info">-->
    <!--                                    <i class="fad fa-link"></i>-->
    <!--                                </b-button>-->
    <!--                                <b-button class="ml-2" size="sm" variant="outline-danger"-->
    <!--                                          @click="onRemoveMarkdownFile(f)">-->
    <!--                                    <i class="fad fa-trash"></i>-->
    <!--                                </b-button>-->
    <!--                            </div>-->
    <!--                        </div>-->

    <!--                    </div>-->
    <!--                </div>-->
    <!--            </div>-->

    <!--            <lab-task-sorter :discipline="activeDiscipline" ref="labTaskSorterRef"/>-->

    <!--            <b-modal id="addMarkdownFileModal"-->
    <!--                     @show="markdownFileFormPermalink=''; markdownFileFormTitle=''"-->
    <!--                     @ok="onAddMarkdownFileOk"-->
    <!--                     ok-title="Добавить"-->
    <!--                     cancel-title="Отмена"-->
    <!--                     title="Добавление нового markdown файла"-->
    <!--            >-->
    <!--                <b-form-group label="permalink">-->
    <!--                    <b-input v-model="markdownFileFormPermalink"></b-input>-->
    <!--                </b-form-group>-->
    <!--                <b-form-group label="title">-->
    <!--                    <b-input v-model="markdownFileFormTitle"></b-input>-->
    <!--                </b-form-group>-->
    <!--            </b-modal>-->
</template>