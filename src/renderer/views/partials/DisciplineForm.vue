<script setup lang="ts">

import BInputGroup from "../components/BInputGroup.vue";
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <b-input-group v-model="form.title"></b-input-group>
            </div>
            <div class="col">
                <b-form-group label="Путь к папке jekyll">
                    <b-input-group>
                        <b-input v-model="form.jekyll_folder"></b-input>
                        <b-input-group-addon>
                            <b-button variant="info" size="sm" @click="onJekyllFolderSelect">...</b-button>
                        </b-input-group-addon>
                    </b-input-group>
                </b-form-group>
            </div>
        </div>
        <b-form-group label="Скрипт для деплоя">
            <b-input v-model="form.deploy_command">
            </b-input>
        </b-form-group>
        <b-form-group label="Ссылка на сайт">
            <b-input-group>
                <b-input v-model="form.site_url">
                </b-input>
                <b-input-group-append>
                    <b-button @click="onSiteUrlClick" type="link"><i class="fas fa-link"></i></b-button>
                </b-input-group-append>
            </b-input-group>
        </b-form-group>
        <div class="d-flex justify-content-between">
            <b-button variant="info" @click="onSaveClick" :disabled="!isSaveEnabled">
                Сохранить
            </b-button>
            <div>
                <b-button class="ml-2" variant="warning" v-b-modal.labTaskSortedModal @click="onLabTaskSortClick">
                    Раскидать задачи
                </b-button>
                <b-button-group>
                    <b-button class="ml-2" variant="warning" @click="onGenerateClick">
                        Сгенерировать
                    </b-button>
                    <b-button class="ml-2" variant="warning" @click="onRunProcessClick">
                        <span v-if="!jekyllProcess">Запустить</span>
                        <span v-else>Остановить</span>
                    </b-button>
                </b-button-group>
                <b-button class="ml-2" variant="danger" @click="onDeployClick">
                    Задеплоить
                </b-button>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col">
                <h2>Лабы
                    <button v-b-modal.labEditModel class="btn btn-sm btn-primary" @click="onLabAddClick"><i
                            class="fas fa-plus"></i></button>
                </h2>
            </div>
            <div class="col ml-4">
                <h2>Статьи
                    <button class="btn btn-sm btn-warning" v-b-modal.addMarkdownFileModal><i
                            class="fas fa-plus"></i></button>
                </h2>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>