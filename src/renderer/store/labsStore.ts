import {defineStore, storeToRefs} from "pinia";
import {ref, toRaw, watch} from "vue";
import {TaskDTO} from "../types";
import useDisciplineStore from "./disciplineStore";
import {Lab} from "../../main/models/lab.entity";

const useLabsStore = defineStore("labsStore", () => {
    const disciplineStore = useDisciplineStore();

    const activeLab = ref<Lab | null>(null)
    const labsLoading = ref(false);
    const fetching = ref(false);
    const updating = ref(false);

    const {
        activeDiscipline
    } = storeToRefs(disciplineStore)

    async function fetchLabs(disciplineId: number): Promise<Lab[]> {
        fetching.value = true;
        let value: Lab[] = []
        if (activeDiscipline.value) {
            value = await window.electronAPI.disciplineRepository.getLabs(disciplineId)
        }
        fetching.value = false;
        return value
    }

    async function setActiveLab(id: number) {
        activeLab.value = await window.electronAPI.labsRepository.get(id);
    }

    async function deleteLab(id: number) {
        updating.value = true;
        await window.electronAPI.labsRepository.remove(id);
        if (activeDiscipline.value) {
            await window.electronAPI.disciplineRepository.disciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        updating.value = false;
    }

    async function upsertLab(lab: Lab) {
        updating.value = true;
        await window.electronAPI.labsRepository.upsert(toRaw(lab));
        if (activeDiscipline.value) {
            await window.electronAPI.disciplineRepository.disciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        updating.value = false;
    }

    async function updateLabsOrder(labs: Lab[]) {
        await window.electronAPI.labsRepository.updateLabsOrder(toRaw(labs));
        if (activeDiscipline.value) {
            await window.electronAPI.disciplineRepository.disciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
    }

    async function labCopyTasksToLab(labId: number, jekyllFolder:string, tasksToCopy: TaskDTO[], activeTaskGroupId: number | null) {
        await window.electronAPI.dbLabCopyTasksToLab(
            labId,
            jekyllFolder,
            toRaw(tasksToCopy.map(x => toRaw(x))),
            activeTaskGroupId
        )
        if (activeDiscipline.value) {
            await window.electronAPI.disciplineRepository.disciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
    }


    return {
        activeLab,
        labsLoading,
        fetching,
        updating,

        setActiveLab,
        fetchLabs,
        upsertLab,
        deleteLab,
        updateLabsOrder,
        labCopyTasksToLab,
    }
})

export default useLabsStore