<script lang="ts" setup>

import {ref} from "vue";
import {Subtask, Task} from "../../main/models/task.entity";
import BModal from "./BModal.vue";
import {Sortable} from "sortablejs-vue3";
import {previewRenderFunc} from "../utils";
import MarkdownEditor from "../components/MarkdownEditor.vue";
import BConfirmModal from "./BConfirmModal.vue";


const modalRef = ref();
const editSubtaskModalRef = ref();
const confirmModalRef = ref();

const activeTask = ref<Task|null>();
const subtasks = ref<Subtask[]>([])
const activeSubtask = ref<Subtask | null>()
const activeSubtaskContent = ref("")


function onAddClick() {
    subtasks.value.push({
        content: "новая таска"
    })
}

function onContentEditOk() {
    if (activeSubtask.value) {
        activeSubtask.value.content = activeSubtaskContent.value;
    }
}

function onEditClick(subtask: Subtask) {
    activeSubtask.value = subtask;
    activeSubtaskContent.value = subtask.content;
    editSubtaskModalRef.value.show();
}

function contentRendered(content: string) {
    let text = previewRenderFunc(content);
    return text
}

async function onRemoveClick(task: Subtask) {
    let r = await confirmModalRef.value.show("Точно удалить сабтаску?")
    if (r) {
        subtasks.value = subtasks.value.filter(x => x != task);
    }
}

function onSubTaskSortEnd() {
    console.log(subtasks.value)
}

defineExpose({
    async show(task: Task) {
        activeTask.value = task
        subtasks.value = (task.subtasks || []).map(x => ({...x}));
        return modalRef.value.show()
    }
})
</script>


<template>
    <b-modal ref="modalRef" size="xl" ok-title="Сохранить" сancel-title="Отмена" :resolve-value="subtasks">
        <div class="row align-items-center mb-2" v-if="activeTask">
            <div class="col">
                {{ activeTask.title }}
            </div>
            <div class="col-auto">
                <div class="btn btn-primary" @click="onAddClick">Добавить</div>
            </div>
        </div>
        <div class="sub-tasks">
            <Sortable class="" :list="subtasks"  tag="div" @end="onSubTaskSortEnd"
                      style="grid-area: B; overflow-y:  auto">
                <template #item="{element, index}">
                    <div class="sub-tasks--item row mb-2" :key="index">
                        <div class="col item--content" v-html="contentRendered(element.content)"></div>
                        <div class="col-auto">
                            <div class="btn btn-success btn-sm me-2" @click="onEditClick(element)"><i class="fas fa-edit"></i>
                            </div>
                            <div class="btn btn-danger btn-sm" @click="onRemoveClick(element)"><i class="fas fa-times"></i></div>
                        </div>
                    </div>
                </template>
            </Sortable>
        </div>

        <b-modal ref="editSubtaskModalRef" @ok-click="onContentEditOk" ok-title="сохранить">
            <markdown-editor v-if="activeSubtask" v-model="activeSubtaskContent"
            ></markdown-editor>
        </b-modal>

        <b-confirm-modal ref="confirmModalRef" />
    </b-modal>
</template>


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