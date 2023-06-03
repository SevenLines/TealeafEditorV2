import {DisciplineDTO, LabDTO, TaskDTO, TaskGroupDTO} from "../types";
import DisciplineRepository from "../../main/repositories/DisciplineRepository";
import {Discipline} from "../../main/models/discipline.entity";
import LabRepository from "../../main/repositories/LabRepository";
import {Lab} from "../../main/models/lab.entity";
import TaskRepository from "../../main/repositories/TaskRepository";

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
    sendMessage: (message: string) => void;
    onPushJekyllLogItem: (callback: Function) => void;
    deployRunDeployProcess: (disciplineId: number, createGitCommit: boolean) => void;
    deployRunJekyllProcess: (disciplineId: number) => void;
    deployStopJekyllProcess: (disciplineId: number) => void;

    dbLabCopyTasksToLab: (labId: number, jekyllFolder: string, tasks: TaskDTO[], activeGroupId: number | null) => void

    fsPreviewRenderFunc: (text: string, jekyll_folder: string) => Promise<string>;
    fsOpenUrlInBrowser: (url: string) => void;
    fsUploadFileFunc: (file: {
        name: string,
        path: string
    }, jekyll_folder: string, fileObject: File) => Promise<{ link: string }>;

    db: {
        status: () => boolean,
        options: () => any,
        connect: (connectionOptions: any) => Promise<boolean>,
        backup: () => void
    },
    disciplineRepository: typeof DisciplineRepository,
    labsRepository: typeof LabRepository,
    taskRepository: typeof TaskRepository,
}

declare global {
    interface Window {
        electronAPI: ElectronApi,
    }
}
