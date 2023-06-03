<script setup lang="ts">

import BModal from "./BModal.vue";
import {ref} from "vue";
import useDisciplineStore from "../store/disciplineStore";
import {storeToRefs} from "pinia";
import MarkdownEditor from "../components/MarkdownEditor.vue";
import BCheckbox from "../components/BCheckbox.vue";
import {Lab} from "../../main/models/lab.entity";

const disciplineStore = useDisciplineStore();

const modalRef = ref()
const labToEditForm = ref<Partial<Lab>>({
    content: "",
    content_additional: "",
    icon: "",
    alias: "",
    discipline_id: 0,
    visible: true,
    group_id: 0,
    order: 0,
    remark: "",
    title: "",
    type: 0,
    id: 0,
    secret: false,
    modified_at: new Date(),
    tip: "",
})


const {
    activeDiscipline
} = storeToRefs(disciplineStore)

defineExpose({
    show(labToEdit: Lab) {
        labToEditForm.value = {...labToEdit};
        return modalRef.value.show()
    }
})

</script>

<template>
    <b-modal ref="modalRef" size="xl" :title="labToEditForm?.title" :resolve-value="labToEditForm">
        <div class="row">
            <div class="col">
                <label class="form-label">Название</label>
                <input type="text" class="form-control" v-model="labToEditForm.title">
            </div>
            <div class="col">
                <label class="form-label">Иконка</label>
                <div class="input-group">
                    <input type="text" class="form-control" v-model="labToEditForm.icon">
                    <span class="input-group-text"> <i :class="labToEditForm.icon"></i></span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <label class="form-label">Алиас</label>
                <input type="text" class="form-control" v-model="labToEditForm.alias">
            </div>
            <div class="col">
                <label class="form-label">Номер</label>
                <input type="text" class="form-control" v-model="labToEditForm.order">
            </div>
            <div class="col">
                <label class="form-label">Ремарка</label>
                <input type="text" class="form-control" v-model="labToEditForm.remark">
            </div>
        </div>

        <hr>


        <div class="row" >
            <div class="col">
                <div class="form-group">
                    <markdown-editor v-model="labToEditForm.content"
                                     min-height="200px"
                                     max-height="200px"
                    />
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <markdown-editor v-model="labToEditForm.content_additional"
                                     min-height="200px"
                                     max-height="200px"
                    />
                </div>
            </div>
             <div class="col">
                <div class="form-group">
                    <markdown-editor v-model="labToEditForm.tip"
                                     min-height="200px"
                                     max-height="200px"
                    />
                </div>
            </div>
        </div>
    </b-modal>
</template>

<style scoped>

</style>