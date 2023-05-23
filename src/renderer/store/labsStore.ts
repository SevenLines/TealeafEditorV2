import {defineStore, storeToRefs} from "pinia";
import {ref, toRaw, watch} from "vue";
import {DisciplineDTO, LabDTO, TaskDTO} from "../types";
import useDisciplineStore from "./disciplineStore";

const useLabsStore = defineStore("labsStore", () => {
    const disciplineStore = useDisciplineStore();

    const activeLab = ref<LabDTO | null>(null)
    const labsLoading = ref(false);
    const fetching = ref(false);
    const updating = ref(false);

    const {
        activeDiscipline
    } = storeToRefs(disciplineStore)

    async function fetchLabs(disciplineId: number): Promise<LabDTO[]> {
        fetching.value = true;
        let value: LabDTO[] = []
        if (activeDiscipline.value) {
            value = await window.electronAPI.dbFetchLabs(disciplineId)
        }
        fetching.value = false;
        return value
    }

    async function setActiveLab(id: number) {
        activeLab.value = await window.electronAPI.dbFetchLab(id);
    }

    async function deleteLab(id: number) {
        updating.value = true;
        await window.electronAPI.dbDeleteLab(id);
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        updating.value = false;
    }

    async function upsertLab(lab: LabDTO) {
        updating.value = true;
        await window.electronAPI.dbUpsertLab(toRaw(lab));
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
        }
        updating.value = false;
    }

    async function updateLabsOrder(labs: LabDTO[]) {
        await window.electronAPI.dbUpdateLabsOrder(toRaw(labs));
        if (activeDiscipline.value) {
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
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
            await window.electronAPI.dbDisciplineGenerateLabsYaml(activeDiscipline.value.id)
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