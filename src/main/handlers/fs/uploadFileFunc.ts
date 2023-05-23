import path from "path";
import fs from "fs";
import _ from "lodash";
import clipboard = Electron.clipboard;

const fsPromises = fs.promises;

export default async function uploadFileFunc(event, file: {
    name: string,
    path: string
}, jekyll_folder: string, arrayBuffer: ArrayBuffer | null) {
    let assets_folder = path.join('assets', "tasks");
    let folder = path.join(jekyll_folder, assets_folder)

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    // console.log(clipboard.readImage())
    if (!arrayBuffer && file.path) {
        arrayBuffer = await fsPromises.readFile(file.path);
    }

    let files = fs.readdirSync(folder);
    let numbers = files.map(x => x.match(/(\d+)_(.*)/i)).filter(x => x).map((x: any) => {
        return +x[1];
    })
    let maxNumber = (_.max(numbers) ?? 0) + 1;
    let filename = `${String(maxNumber).padStart(3, '0')}_${file.name.trim()}`

    if (arrayBuffer) {
        let buffer = Buffer.from(arrayBuffer);
        fs.writeFile(path.join(folder, filename), (buffer as any), err => {
            if (err) return console.log(err);
        })
    }

    return {
        link: path.join("/", assets_folder, filename).replace(/\s/, "%20").replace(/\\/g, "/"),
    }
}