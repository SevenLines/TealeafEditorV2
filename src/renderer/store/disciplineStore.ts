import {defineStore} from "pinia";
import {ref, toRaw, unref} from "vue";
import {Discipline} from "../../main/models/discipline.entity";

const useDisciplineStore = defineStore("disciplineStore", () => {
    const disciplines = ref<Discipline[]>([]);
    const activeDiscipline = ref<Discipline|null>(null);
    const fetching = ref(false);
    const updating = ref(false);

    async function fetchDisciplines() {
        fetching.value = true;
        disciplines.value = await window.electronAPI.disciplineRepository.list()
        fetching.value = false;
    }

    async function setActiveDiscipline(id: number) {
        activeDiscipline.value = await window.electronAPI.disciplineRepository.get(id);
    }

    async function deleteDiscipline(id: number) {
        await window.electronAPI.disciplineRepository.remove(id);
    }

    async function copyDiscipline(id: number) {
        await window.electronAPI.disciplineRepository.disciplineCopy(id);
        await fetchDisciplines()
    }

    async function onRemoveImages(id: number) {
        await window.electronAPI.disciplineRepository.disciplineRemoveUnusedImages(id);
    }

    async function upsertDiscipline(discipline: Partial<Discipline>) {
        updating.value = true;
        activeDiscipline.value = await window.electronAPI.disciplineRepository.upsert(toRaw(discipline));
        if (activeDiscipline.value) {
            await window.electronAPI.disciplineRepository.disciplineGenerateLabsYaml(activeDiscipline.value.id)
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