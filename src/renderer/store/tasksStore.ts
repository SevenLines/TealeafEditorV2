import {defineStore, storeToRefs} from "pinia";
import {ref, toRaw, watch} from "vue";
import useDisciplineStore from "./disciplineStore";
import useLabsStore from "./labsStore";
import useToastsStore from "./toastsStore";
import {Task} from "../../main/models/task.entity";

const useTasksStore = defineStore("tasksStore", () => {
    const labsStore = useLabsStore();
    const disciplineStore = useDisciplineStore();
    const toastsStore = useToastsStore();

    const activeTask = ref<Task|null>();

    const {
        activeLab
    } = storeToRefs(labsStore)

    const {
        activeDiscipline
    } = storeToRefs(disciplineStore)

    async function fetchTasks(labId: number): Promise<Task[]> {
        let tasks: Task[] = []
        if (activeLab.value) {
            tasks = await window.electronAPI.labsRepository.getTasks(labId)
        }
        return tasks
    }

    async function setActiveTask(id: number) {
        activeTask.value = await window.electronAPI.taskRepository.get(id);
    }

    async function upsertTask(task: Task) {
        toastsStore.showInfo("Начал обновлять задачу")
        await window.electronAPI.taskRepository.upsert(toRaw(task));
        if (activeDiscipline.value) {
            await window.electronAPI.disciplineRepository.disciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        toastsStore.showSuccess("Успешно обновил задачу")
    }

    async function updateTasksOrder(tasks: Task[]) {
        toastsStore.showInfo("Начал обновлять порядок")
        await window.electronAPI.taskRepository.updateTasksOrder(toRaw(tasks));
        if (activeDiscipline.value) {
            await window.electronAPI.disciplineRepository.disciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        toastsStore.showSuccess("Успешно обновил порядок")
    }

    async function deleteTask(id: number) {
        toastsStore.showInfo("Начал удалять задачу")
        await window.electronAPI.taskRepository.remove(id);
        if (activeDiscipline.value) {
            await window.electronAPI.disciplineRepository.disciplineGenerateLabsYaml(activeDiscipline.value.id)
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