<template>
    <b-modal ref="modal" size="xl" ok-title="Сохранить" сancel-title="Отмена" @ok="onOkClick">
        <div class="row align-items-center mb-2" v-if="activeTask">
            <div class="col">
                {{ activeTask.title }}
            </div>
            <div class="col-auto">
                <div class="btn btn-primary" @click="onAddClick">Добавить</div>
            </div>
        </div>
        <div class="sub-tasks">
            <draggable v-model="subtasks" group="people" @start="drag=true" @end="drag=false">
                <div class="sub-tasks--item row mb-2" v-for="(task, index) in subtasks" :key="index">
                    <div class="col item--content" v-html="contentRendered(task.content)"></div>
                    <div class="col-auto">
                        <div class="btn btn-success mr-2" @click="onEditClick(task)"><i class="fas fa-edit"></i></div>
                        <div class="btn btn-danger" @click="onRemoveClick(task)"><i class="fas fa-times"></i></div>
                    </div>
                </div>
            </draggable>
        </div>

        <b-modal ref="editSubtaskModal" @ok="onContentEditOk" ok-title="сохранить">
            <markdown-editor v-if="activeSubtask" v-model="activeSubtaskContent"
                :preview-render-func="previewRenderFuncProxy"
                :upload-func="uploadFileFuncProxy"
            ></markdown-editor>
        </b-modal>
    </b-modal>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {Prop, Vue, Watch} from "vue-property-decorator";
import Task, {Subtask} from "../models/Task";
import MarkdownEditor from "./MarkdownEditor.vue";
import {previewRenderFunc, uploadFileFunc} from "../utils";
import draggable from "vuedraggable";

@Component({
    components: {MarkdownEditor, draggable}
})
export default class  SubtaskModal extends Vue {
    @Prop() activeTask!: Task;
    public subtasks: Array<Subtask> = [];
    public activeSubtask: Subtask = null;
    public activeSubtaskContent: string = '';

    show() {
        this.subtasks = (this.activeTask.subtasks || []).map(x => ({...x}));
        (this.$refs.modal as any).show();
    }

    onAddClick() {
        this.subtasks.push({
            content: "новая таска"
        })
    }

    onContentEditOk() {
        this.activeSubtask.content = this.activeSubtaskContent;
    }

    onEditClick(subtask: Subtask) {
        (this.$refs.editSubtaskModal as any).show();
        this.activeSubtask = subtask;
        this.activeSubtaskContent = subtask.content;
    }

    onOkClick() {
        this.$emit("ok-clicked", this.subtasks)
    }

    previewRenderFuncProxy(text: string) {
        return previewRenderFunc(text, this.$store.state.activeDiscipline.jekyll_folder)
    }

    uploadFileFuncProxy(file: File) {
        return uploadFileFunc(file, this.$store.state.activeDiscipline.jekyll_folder)
    }

    contentRendered(content) {
        let text = previewRenderFunc(content, this.$store.state.activeDiscipline.jekyll_folder);
        return text
    }

    async onRemoveClick(task) {
        let doDelete = await this.$bvModal.msgBoxConfirm(
            'Точно удалить сабтаску?', {
                title: 'Подтвердите',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'Удалить',
                cancelTitle: 'НЕЕЕЕТ!!!',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })
        if (doDelete) {
            this.subtasks = this.subtasks.filter(x => x != task);
        }
    }
}
</script>

<style lang="scss" scoped>
    .sub-tasks {
        .sub-tasks--item {
            margin: 2px;
            padding: 0.5rem;
            background-color: #ffe6c1;
            .item--content {
                background-color: #fff3e3;
                border-radius: 4px;
            }
        }
    }
</style>