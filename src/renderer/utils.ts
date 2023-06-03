import path from "path";
import fs from "fs";
import {marked} from "marked";
import useDisciplineStore from "./store/disciplineStore";
import {markedHighlight} from "marked-highlight";
import hljs from 'highlight.js';


marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    console.log(code)

    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

export const moveItemInArray = <T>(array: T[], from: number, to: number) => {
    const item = array.splice(from, 1)[0];
    array.splice(to, 0, item);
};


export function previewRenderFunc(text: string): string {
    const disciplineStore = useDisciplineStore();
    if (disciplineStore.activeDiscipline) {
        let dir = "file://" + disciplineStore.activeDiscipline.jekyll_folder.replace(/\\/g, "/");
        text = text.replace(/(!\[.*?\]\()(\/assets.*?)(\))/g, `<img src="${dir}$2" alt="" />`)

        text = marked.parse(text, {
            mangle: false,
            headerIds: false,
            // pedantic: true,
            gfm: false
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
        }, disciplineStore.activeDiscipline.jekyll_folder, buffer as any)
    }
    return  null
}