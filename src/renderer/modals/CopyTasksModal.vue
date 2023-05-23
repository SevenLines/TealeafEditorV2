<script lang="ts" setup>
import BModal from "./BModal.vue";
import {computed, ref, watch} from "vue";
import useDisciplineStore from "../store/disciplineStore";
import {storeToRefs} from "pinia";
import useLabsStore from "../store/labsStore";
import {DisciplineDTO, LabDTO, SelectOption, TaskDTO} from "../types";
import useTasksStore from "../store/tasksStore";
import TaskItem from "../views/partials/TaskItem.vue";
import BFormSelect from "../components/BFormSelect.vue";

const disciplineStore = useDisciplineStore();
const {
    disciplines,
    activeDiscipline
} = storeToRefs(disciplineStore)

const labsStore = useLabsStore();
const tasksStore = useTasksStore();


const modalRef = ref();

const activeCopyTasksDisciplineId = ref< number | null>(null);
const activeCopyTasksLabId = ref<number | null>(null);

const labs = ref<LabDTO[]>([]);
const tasks = ref<TaskDTO[]>([]);
const tasksToCopy = ref<TaskDTO[]>([]);


watch(activeCopyTasksDisciplineId, async () => {
    if (activeCopyTasksDisciplineId.value) {
        labs.value = await labsStore.fetchLabs(activeCopyTasksDisciplineId.value)
        tasks.value = []
    }
})

watch(activeCopyTasksLabId, async () => {
    if (activeCopyTasksLabId.value) {
        tasks.value = await tasksStore.fetchTasks(activeCopyTasksLabId.value)
    }
})


const copTasksDisciplinesOptions = computed(() => {
    return disciplines.value.map((d: DisciplineDTO) => {
        return {
            value: d.id,
            text: d.title,
        }
    })
})

const copTasksLabsOptions = computed(() => {
    return labs.value.map((l: LabDTO) => {
        return {
            value: l.id,
            text: l.title,
        }
    })
})

function onTaskClick(task: TaskDTO) {
    if (tasksToCopy.value.indexOf(task) >= 0) {
        tasksToCopy.value = tasksToCopy.value.filter(x => x != task)
    } else {
        tasksToCopy.value = [...tasksToCopy.value, task]
    }
}

defineExpose({
    async show() {
        await disciplineStore.fetchDisciplines()
        tasksToCopy.value = [];
        return modalRef.value.show();
    }
})
</script>

<template>
    <b-modal ref="modalRef" title="Скопировать задачи"
             size="lg"
             :resolve-value="tasksToCopy"
    >
        <b-form-select v-model="activeCopyTasksDisciplineId" :options="copTasksDisciplinesOptions"></b-form-select>
        <b-form-select v-if="copTasksLabsOptions" v-model="activeCopyTasksLabId" :options="copTasksLabsOptions"></b-form-select>

        <div v-for="task in tasks" :key="task.id">
            <task-item
                    :task="task"
                    :with-edit-bar="false"
                    :with-selected-check-box="true"
                    :selected="tasksToCopy.indexOf(task) >= 0"
                    @click="onTaskClick(task)"
            ></task-item>
        </div>
    </b-modal>
</template>

<style scoped>

</style>