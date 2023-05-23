import {defineStore, storeToRefs} from "pinia";
import {ref, toRaw, watch} from "vue";
import {LabDTO, TaskDTO} from "../types";
import useDisciplineStore from "./disciplineStore";
import useLabsStore from "./labsStore";

const useTasksStore = defineStore("tasksStore", () => {
    const labsStore = useLabsStore();
    const disciplineStore = useDisciplineStore();

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
        await window.electronAPI.dbUpsertTask(toRaw(task));
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
    }

    async function updateTasksOrder(tasks: TaskDTO[]) {
        await window.electronAPI.dbUpdateTasksOrder(toRaw(tasks));
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
    }

    async function deleteTask(id: number) {
        await window.electronAPI.dbDeleteTask(id);
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
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