import path from "path";
import fs from "fs";
import {marked} from "marked";
import useDisciplineStore from "./store/disciplineStore";

export const moveItemInArray = <T>(array: T[], from: number, to: number) => {
    const item = array.splice(from, 1)[0];
    array.splice(to, 0, item);
};


export function previewRenderFunc(text: string): string {
    const disciplineStore = useDisciplineStore();
    if (disciplineStore.activeDiscipline) {
        let dir = "file://" + disciplineStore.activeDiscipline.jekyll_folder.replace(/\\/g, "/");
        text = text.replace(/(!\[.*?\]\()(\/assets.*?)(\))/g, `<img src="${dir}$2" alt="" />`)

        text = marked(text, {
            mangle: false,
            headerIds: false,
            pedantic: true
        })
        return text
    }
    return ""
}

export async function uploadFileFunc(file: File, buffer: ArrayBuffer | null) : Promise<{link: string} | null> {
    const disciplineStore = useDisciplineStore();

    if (disciplineStore.activeDiscipline) {
        return await window.electronAPI.fsUploadFileFunc({
            name: file.name,
            path: file.path
        }, disciplineStore.activeDiscipline.jekyll_folder, buffer)
    }
    return  null
}