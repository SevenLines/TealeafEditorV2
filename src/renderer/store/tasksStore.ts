import {defineStore, storeToRefs} from "pinia";
import {ref, toRaw, watch} from "vue";
import {LabDTO, TaskDTO} from "../types";
import useDisciplineStore from "./disciplineStore";
import useLabsStore from "./labsStore";
import useToastsStore from "./toastsStore";

const useTasksStore = defineStore("tasksStore", () => {
    const labsStore = useLabsStore();
    const disciplineStore = useDisciplineStore();
    const toastsStore = useToastsStore();

    const activeTask = ref<TaskDTO|null>();

    const {
        activeLab
    } = storeToRefs(labsStore)

    const {
        activeDiscipline
    } = storeToRefs(disciplineStore)

    async function fetchTasks(labId: number): Promise<TaskDTO[]> {
        let tasks: TaskDTO[] = []
        if (activeLab.value) {
            tasks = await window.electronAPI.dbFetchTasks(labId)
        }
        return tasks
    }

    async function setActiveTask(id: number) {
        activeTask.value = await window.electronAPI.dbFetchTask(id);
    }

    async function upsertTask(task: TaskDTO) {
        toastsStore.showInfo("Начал обновлять задачу")
        await window.electronAPI.dbUpsertTask(toRaw(task));
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        toastsStore.showSuccess("Успешно обновил задачу")
    }

    async function updateTasksOrder(tasks: TaskDTO[]) {
        toastsStore.showInfo("Начал обновлять порядок")
        await window.electronAPI.dbUpdateTasksOrder(toRaw(tasks));
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        toastsStore.showSuccess("Успешно обновил порядок")
    }

    async function deleteTask(id: number) {
        toastsStore.showInfo("Начал удалять задачу")
        await window.electronAPI.dbDeleteTask(id);
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        toastsStore.showSuccess("Успешно удалил задачу")
    }

    return {
        fetchTasks,
        setActiveTask,
        upsertTask,
        updateTasksOrder,
        deleteTask,
    }
})

export default useTasksStore