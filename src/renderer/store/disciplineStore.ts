import {defineStore} from "pinia";
import {ref, toRaw, unref} from "vue";
import {DisciplineDTO} from "../types";

const useDisciplineStore = defineStore("disciplineStore", () => {
    const disciplines = ref<DisciplineDTO[]>([]);
    const activeDiscipline = ref<DisciplineDTO|null>(null);
    const fetching = ref(false);
    const updating = ref(false);

    async function fetchDisciplines() {
        fetching.value = true;
        disciplines.value = await window.electronAPI.dbFetchDisciplines()
        fetching.value = false;
    }

    async function setActiveDiscipline(id: number) {
        activeDiscipline.value = await window.electronAPI.dbFetchDiscipline(id);
    }

    async function deleteDiscipline(id: number) {
        await window.electronAPI.dbDeleteDiscipline(id);
    }

    async function copyDiscipline(id: number) {
        await window.electronAPI.dbDisciplineCopy(id);
        await fetchDisciplines()
    }

    async function onRemoveImages(id: number) {
        await window.electronAPI.dbDisciplineRemoveUnusedImages(id);
    }

    async function upsertDiscipline(discipline: Partial<DisciplineDTO>) {
        updating.value = true;
        activeDiscipline.value = await window.electronAPI.dbUpsertDiscipline(toRaw(discipline));
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        updating.value = false;
    }

    async function runDeployProcess(disciplineId: number, createGitCommit: boolean) {
        await window.electronAPI.deployRunDeployProcess(disciplineId, createGitCommit)
    }

    return {
        disciplines,
        activeDiscipline,
        fetching,
        updating,

        fetchDisciplines,
        deleteDiscipline,
        setActiveDiscipline,
        upsertDiscipline,
        runDeployProcess,
        copyDiscipline,

    }
})

export default useDisciplineStore;