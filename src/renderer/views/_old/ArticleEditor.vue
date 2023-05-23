<template>
    <div class="d-flex" style="height: 100%">
        <div class="d-flex flex-column w-100">
            <div class="p-2" style="background-color: #f1f1f1; border-top: 2px solid #e7e7e7">
                <b-container class="pr-4 d-flex justify-content-end">
                    <b-button type="success" size="sm" @click="onSaveClick">Сохранить</b-button>
                </b-container>
            </div>
            <MarkdownEditor
                max-height="800px"
                min-height="800px"
                v-model="text"
                :upload-func="uploadFileFuncProxy"
                :preview-render-func="previewRenderFuncProxy"
                :sideBySideFullscreen="false"
            />
        </div>
    </div>
</template>

<script lang="ts">
import {Prop, Vue, Watch} from "vue-property-decorator";
import Component from "vue-class-component";
import {previewRenderFunc, uploadFileFunc} from "../utils";
import MarkdownEditor from "./MarkdownEditor.vue";
import fs from "fs";
import path from "path";

@Component({
    components: {
        MarkdownEditor
    }
})
export default class ArticleEditor extends Vue {
    text: string = "";
    initText: string = "";

    @Watch("$route", {deep: true, immediate: true})
    async onRouteChange() {
        await this.$store.dispatch("setActiveDisciplineId", this.$route.params.disciplineId)
        this.openFile();
    }

    previewRenderFuncProxy(text: string) {
        return previewRenderFunc(text, this.$store.state.activeDiscipline.jekyll_folder)
    }

    uploadFileFuncProxy(file: File) {
        return uploadFileFunc(file, this.$store.state.activeDiscipline.jekyll_folder)
    }

    mounted() {
        document.addEventListener("keydown", this.onKey);
    }

    beforeDestroy() {
        document.removeEventListener("keydown", this.onKey);
    }

    onKey(e: any) {
        if (e.ctrlKey && (e.which == 83)) {
            e.preventDefault();
            this.onSaveClick()
        }
    }

    get fileName() {
        return path.join(
            this.$store.state.activeDiscipline.jekyll_folder,
            "common",
            this.$route.params.article
        );
    }

    openFile() {
        fs.readFile(this.fileName, 'utf8', (err, data) => {
            this.text = data;
            this.initText = this.text;
        });
    }

    onSaveClick() {
        fs.writeFile(this.fileName, this.text, err => {
            if (err) return console.log(err);
            this.$notify({
                group: 'messages',
                title: 'Файл',
                type: 'success',
                duration: 500,
                text: 'Успешно сохранился!'
            });
            this.initText = this.text;
        });
    }


}
</script>

<style scoped>

</style>