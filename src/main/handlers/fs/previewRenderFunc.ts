import {marked} from "marked";
import path from "path";
const { nativeImage } = require('electron')

export default function previewRenderFunc(event, text: string, jekyll_folder: string) {
    let dir = "file://" + jekyll_folder.replace(/\\/g, "/");
    text = text.replace(/(!\[.*?\]\()(\/assets.*?)(\))/g, `<webview src="${dir}$2" alt="" />`)

    // text = text.replace(/(!\[.*?\]\()(\/assets.*?)(\))/g,(substring, _, file_path) => {
    //     let real_file_path = path.join(jekyll_folder.replace(/\\/g, "/"), file_path);
    //     console.log("---")
    //     console.log(substring)
    //     console.log(real_file_path)
    //     console.log("---")
    //
    //     let image = nativeImage.createFromPath(decodeURI(real_file_path))
    //     return `<webview src="${image.toDataURL()}" alt="" />`
    // } )
    // `$1${dir}$2$3`
    text = marked(text, {
        mangle: false,
        headerIds: false,
        pedantic: true
    })
    return text;
}
