import {DisciplineDTO, LabDTO, TaskDTO, TaskGroupDTO} from "../types";

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
    sendMessage: (message: string) => void;
    onPushJekyllLogItem: (callback: Function) => void;
    deployRunDeployProcess: (disciplineId: number, createGitCommit: boolean) => void;
    deployRunJekyllProcess: (disciplineId: number) => void;
    deployStopJekyllProcess: (disciplineId: number) => void;

    dbFetchDisciplines: () => Promise<DisciplineDTO[]>
    dbFetchLabs: (disciplineId: number) => Promise<LabDTO[]>;
    dbFetchTaskGroups: (labId: number) => Promise<TaskGroupDTO[]>;
    dbFetchTasks: (labId: number) => Promise<TaskDTO[]>;
    dbDisciplineCopy: (disciplineId: number) => Promise<DisciplineDTO>;

    dbDeleteDiscipline: (disciplineId: number) => void;
    dbDeleteLab: (labId: number) => void;
    dbDeleteTask: (taskId: number) => void;

    dbFetchDiscipline: (disciplineId: number) => Promise<DisciplineDTO>;
    dbFetchLab: (labId: number) => Promise<LabDTO>;
    dbFetchTask: (taskId: number) => Promise<TaskDTO>;

    dbUpsertDiscipline: (data: DisciplineDTO) => Promise<DisciplineDTO>;
    dbUpsertLab: (data: LabDTO) => Promise<LabDTO>;
    dbUpsertTask: (data: TaskDTO) => Promise<TaskDTO>;
    dbUpdateLabsOrder: (labs: LabDTO[]) => void;
    dbUpdateTasksOrder: (labs: TaskDTO[]) => void;

    dbDisciplineGenerateLabsYaml: (disciplineId: number) => void;
    dbDisciplineGetImages: (disciplineId: number) => string[];
    dbDisciplineRemoveUnusedImages: (disciplineId: number) => void;
    dbLabCopyTasksToLab: (labId: number, jekyllFolder: string, tasks: TaskDTO[], activeGroupId: number | null) => void

    fsPreviewRenderFunc: (text: string, jekyll_folder: string) => Promise<string>;
    fsOpenUrlInBrowser: (url: string) => void;
    fsUploadFileFunc: (file: {
        name: string,
        path: string
    }, jekyll_folder: string, fileObject: File) => Promise<{ link: string }>;

    globalShared: () => any
    db: {
        status: () => boolean,
        options: () => any,
        connect: (connectionOptions: any) => Promise<boolean>,
        backup: () => void
    }
}

declare global {
    interface Window {
        electronAPI: ElectronApi,
    }
}
