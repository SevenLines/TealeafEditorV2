<script lang="ts" setup>

import {computed, ref, toRaw, watch} from "vue";
import useDisciplineStore from "../store/disciplineStore";
import useLabsStore from "../store/labsStore";
import {storeToRefs} from "pinia";
import useTasksStore from "../store/tasksStore";
import {TaskDTO} from "../types";
import * as electron from "electron";
import TaskItem from "./partials/TaskItem.vue";
import {Sortable} from "sortablejs-vue3";
import {moveItemInArray} from "../utils";
import TaskEditor from "./partials/TaskEditor.vue";
import BConfirmModal from "../modals/BConfirmModal.vue";
import BFormSelect from "../components/BFormSelect.vue";
import {ComplexityTypes} from "../consts";
import _ from "lodash";
import CopyTasksModal from "../modals/CopyTasksModal.vue";

const props = defineProps({
    id: {
        default: 0
    }
})

const disciplineStore = useDisciplineStore();
const labsStore = useLabsStore();
const tasksStore = useTasksStore();

const {
    activeLab
} = storeToRefs(labsStore)


const {
    activeDiscipline
} = storeToRefs(disciplineStore)

const activeTask = ref<TaskDTO | null>(null);
const confirmModalRef = ref()
const copyTasksModalRef = ref()

const activeTaskGroup = ref(-1);
const taskGroups = ref([])
const tasks = ref<TaskDTO[]>([]);

const taskGroupsOptions = computed(() => {
    return [{value: -1, text: "без группы"}, ...taskGroups.value.map(x => {
        return {
            // value: x.id,
            // text: x.title,
        }
    })]
})

watch(() => props.id, async () => {
    await labsStore.setActiveLab(props.id)
    if (activeLab.value) {
        await disciplineStore.setActiveDiscipline(activeLab.value.discipline_id)
        await fetchTasks()
    }
}, {immediate: true})

watch(activeLab, async () => {
    await fetchTasks();
})


async function fetchTasks() {
    if (activeLab.value) {
        tasks.value = await tasksStore.fetchTasks(activeLab.value.id);
    }
}

function onEdit(task: TaskDTO) {
    if (activeTask.value == task) {
        activeTask.value = null
    } else {
        activeTask.value = task;
    }
}

async function onEyeClick(task: TaskDTO) {
    await tasksStore.upsertTask({
        ...task,
        visible: !task.visible
    })
    await fetchTasks()
}

async function onRemove(task: TaskDTO) {
    let r = await confirmModalRef.value.show("Точно удалить задачу?")
    if (r) {
        await tasksStore.deleteTask(task.id)
        await fetchTasks();
    }
}


async function onTipClick(task: TaskDTO) {
    let href = `http://localhost:4000/tasks/${task.id}`
    // await electron.openExternal(href);
}

async function onTaskSortEnd(event: any) {
    if (tasks.value) {
        moveItemInArray(tasks.value, event.oldIndex, event.newIndex);
        await tasksStore.updateTasksOrder(tasks.value)
        await fetchTasks();
    }
}

async function onSaveTaskClick(task_form: any, buttonClicked: any) {
    if (activeTask.value) {
        activeTask.value.title = task_form.title;
        activeTask.value.order = task_form.order;
        activeTask.value.custom_class = task_form.custom_class;
        activeTask.value.content = task_form.content;
        activeTask.value.complexity = task_form.complexity;
        activeTask.value.additional_content = task_form.additional_content;
        activeTask.value.visible = task_form.visible;
        activeTask.value.youtube_link = task_form.youtube_link;
        activeTask.value.show_help_in_modal = task_form.show_help_in_modal;
        activeTask.value.lab_id = task_form.lab_id;

        await saveActiveTask(buttonClicked);
    }
}

async function saveActiveTask(buttonClicked = false) {
    if (activeTask.value) {
        await tasksStore.upsertTask(activeTask.value)
        // this.$notify({
        //     group: 'messages',
        //     title: 'Database',
        //     type: 'success',
        //     duration: 500,
        //     text: 'Successfully task saved!'
        // });

        let isNew = !activeTask.value.id;

        await fetchTasks()

        if (buttonClicked) {
            activeTask.value = null;
        }
    }
}


async function onAddSubtaskClicked() {
    // (this.$refs.editSubTasksModal as any).show()
}

async function onCopyTasksClick() {
    let tasksToCopy = await copyTasksModalRef.value.show()
    if (tasksToCopy) {
        console.log(toRaw(tasksToCopy))
        if (activeLab.value && activeDiscipline.value) {
            await labsStore.labCopyTasksToLab(
                activeLab.value.id,
                activeDiscipline.value.jekyll_folder,
                tasksToCopy,
                null
            )
            await fetchTasks()
        }
    }
}


async function onAddTaskClick() {
    if (!activeLab.value) {
        return
    }

    let _tasks = tasks.value ?? []

    activeTask.value = {
        title: "",
        order: ((_(_tasks).map(x => x.order).max() ?? 0) + 1) || 0,
        custom_class: "",
        youtube_link: "",
        content: "",
        complexity: ComplexityTypes.easy,
        additional_content: "",
        visible: true,
        group_id: activeTaskGroup.value == -1 ? null : activeTaskGroup.value,
        lab_id: activeLab.value.id,
    }
}


// public activeTask?: Task = null;
// public labs!: Array<Lab>;
// public activeTaskGroup = -1;
// public newTaskGroupTitle = "";
//
// @Watch("$route", {deep: true, immediate: true})
// onRouteChange() {
//     this.$store.dispatch("setActiveLabId", this.$route.params.labId)
// }
//
// get tasks() {
//     return this.$store.state.tasks.filter(x => {
//         return (this.activeTaskGroup == -1 && x.group_id == null) || x.group_id == this.activeTaskGroup
//     });
// }
//
// set tasks(tasks) {
//     this.$store.commit("setTasks", tasks)
//     this.$store.dispatch("updateTasksOrder", tasks)
// }
//
// get taskGroups() {
//     return this.$store.state.taskGroups;
// }
//
// set taskGroups(taskGroups) {
//     this.$store.commit("setTaskGroups", taskGroups)
//     this.$store.dispatch("updateTaskGroupsOrder", taskGroups)
// }
//

//

// async onSubtasksModalOkClicked(subtasks: Array<Subtask>) {
//     this.activeTask.subtasks = subtasks;
//     await this.SaveActiveTasks();
// }
//


//
// async onCreateTaskGroup() {
//     this.newTaskGroupTitle = ""
// }
//
// async onRemoveTaskGroup() {
//     let has_subtasks = await Task.count({
//         where: {group_id: this.activeTaskGroup}
//     })
//
//     if (has_subtasks) {
//         await this.$bvModal.msgBoxOk(
//             'У группы есть задачи, не могу ее удалить', {
//                 title: 'Бесполезно',
//                 size: 'md',
//                 okVariant: 'info',
//                 footerClass: 'p-2',
//                 hideHeaderClose: false,
//                 centered: true
//             })
//         return;
//     }
//
//     let doDelete = await this.$bvModal.msgBoxConfirm(
//         `Точно удалить группу?`, {
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
//         await TaskGroup.destroy({
//             where: {
//                 id: this.activeTaskGroup
//             }
//         });
//         await this.$store.dispatch("fetchTaskGroups")
//         this.activeTaskGroup = -1
//     }
// }
//
// async onCreateTaskGroupOkClicked() {
//     let order = _(this.taskGroups).map((x: TaskGroup) => x.order || 0).max()
//     let task_group = TaskGroup.build({
//         lab_id: this.activeLab.id,
//         title: this.newTaskGroupTitle,
//         type: this.activeLab.type,
//         order: order + 1,
//     })
//     await task_group.save()
//     await this.$store.dispatch("fetchTaskGroups")
//     this.activeTaskGroup = task_group.id
// }
//

</script>

<template>
    <b-confirm-modal ref="confirmModalRef"/>
    <div class="lab-view-container">
        <div class="p-2" style="background-color: #f1f1f1; border-top: 2px solid #e7e7e7; grid-area: H;">
            <div class="container pr-4 d-flex justify-content-end">
                <b-form-select size="sm" :options="taskGroupsOptions" v-model="activeTaskGroup"></b-form-select>
                <div class="btn-group flex-shrink-0">
                    <!--                        <button class="ml-2 flex-shrink-0" size="sm" variant="warning" @click="onCreateTaskGroup"-->
                    <!--                                  v-b-modal.newTaskGroupModal>Создать группу-->
                    <!--                        </button>-->
                    <!--                        <button class="ml-2 flex-shrink-0" size="sm" variant="warning"-->
                    <!--                                  v-b-modal.orderGroupsModal>Упорядочить группы-->
                    <!--                        </button>-->
                    <!--                        <button v-if="activeTaskGroup != -1" class="ml-2 flex-shrink-0 btn btn-sm btn-danger"-->
                    <!--                                  @click="onRemoveTaskGroup">Удалить группу-->
                    <!--                        </button>-->
                </div>
                <button class="ms-2 btn btn-sm btn-info" @click="onCopyTasksClick">Скопировать</button>
                <button class="ms-2 btn btn-sm btn-info" @click="onAddTaskClick">Добавить</button>
            </div>
        </div>
        <Sortable class="" :list="tasks" item-key="id" tag="div" @end="onTaskSortEnd" style="grid-area: B; overflow-y:  auto">
            <template #item="{element, index}">
                <div class="container">
                <task-item class="m-2"
                           :task="element"
                           :key="element.id"
                           :active-task="activeTask"
                           @edit="onEdit(element)"
                           @eye="onEyeClick(element)"
                           @remove="onRemove(element)"
                           @tip="onTipClick(element)"
                ></task-item>
                </div>
            </template>
        </Sortable>
        <div style="grid-area: R">
            <div class="task-editor" :class="{'active': !!activeTask}">
            <task-editor class="task-editor-inner"
                         :task="activeTask"
                         @cancel="activeTask=null"
                         @save="onSaveTaskClick"
                         @edit-subtask-clicked="onAddSubtaskClicked"
            >
            </task-editor>
            </div>
        </div>

        <copy-tasks-modal ref="copyTasksModalRef"/>
        <!--        <b-modal id="newTaskGroupModal" title="Создать новую группу" @ok="onCreateTaskGroupOkClicked">-->
        <!--            <b-form-group>-->
        <!--                <b-input v-model="newTaskGroupTitle"></b-input>-->
        <!--            </b-form-group>-->
        <!--        </b-modal>-->
        <!--        <b-modal id="orderGroupsModal" title="Упорядочить группы">-->
        <!--            <b-list-group>-->
        <!--                <draggable v-model="taskGroups" group="people" @start="drag=true" @end="drag=false">-->
        <!--                    <b-list-group-item v-for="g in taskGroups" :key="g.id">-->
        <!--                        {{ g.title }}-->
        <!--                    </b-list-group-item>-->
        <!--                </draggable>-->
        <!--            </b-list-group>-->
        <!--        </b-modal>-->
        <!--        <SubtaskModal  ref="editSubTasksModal" :activeTask="activeTask" @ok-clicked="onSubtasksModalOkClicked"/>-->
    </div>
</template>

<style lang="scss">
.lab-view-container {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto minmax(0, 1fr);
  grid-template-areas:
          "H H"
          "B R";
}

.task-editor {
  grid-area: R;
  width: 0;
  position: relative;
  height: 100%;

  &.active {
    padding: 1em;
    overflow-y: auto;
    flex-basis: 0;
    flex-grow: 1;
    visibility: visible;
    width: 500px;
    max-width: 500px;

    .task-editor-inner {
      padding: 1rem;

      position: absolute;
      max-width: 100%;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }
  }


  flex-basis: 0;
  flex-grow: 0;
  overflow: hidden;

  box-shadow: 0 0 4px silver;

  background-color: white;
  transition: all 0.5s;
  animation-timing-function: ease-in-out;
  visibility: hidden;

}


</style>


