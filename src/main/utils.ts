import path from "path";
import fs from "fs";
import {Buffer} from "buffer";
import {marked} from "marked";
import _ from 'lodash'
import {exec, spawn} from "child_process";

const {resolve} = require('path');
const {readdir} = require('fs').promises;

export async function uploadFileFunc(file: File, jekyll_folder) {
    let assets_folder = path.join('assets', "tasks");
    let folder = path.join(jekyll_folder, assets_folder)

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    let files = fs.readdirSync(folder);
    let numbers = files.map(x => x.match(/(\d+)_(.*)/i)).filter(x => x).map(x => {
        return +(x ? x[1] : 0);
    })
    let maxNumber = (_.max(numbers) ?? 0) + 1;
    let filename = `${String(maxNumber).padStart(3, '0')}_${file.name.trim()}`

    let arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    fs.writeFile(path.join(folder, filename), (buffer as any), err => {
        if (err) return console.log(err);
    })

    return {
        link: path.join("/", assets_folder, filename).replace(/\s/, "%20").replace(/\\/g, "/"),
    }
}

export async function execAsync(command, options, onData?) {
    return new Promise<any>((resolve, reject) => {
        let ps = exec(command, options, (error: any) => {
            resolve(error)
        })
        if (onData && ps) {
            ps.stdout?.on("data", onData)
            ps.stderr?.on("data", onData)
        }
    })
}

export async function spawnAsync(command, options, onData?) {
    return new Promise<any>((resolve, reject) => {
        let ps = spawn(command, options)
        if (onData) {
            ps.stdout.on("data", onData)
            ps.stderr.on("data", onData)
        }
        ps.stderr.on("close", (code) => {
            resolve(code)
        })
    })
}

export function previewRenderFunc(text: string, jekyll_folder) {
    let dir = "file://" + jekyll_folder.replace(/\\/g, "/");
    text = text.replace(/(!\[.*?\]\()(\/assets.*?)(\))/g, `$1${dir}$2$3`)
    text = marked(text)
    return text;
}

export async function getFiles(dir) {
    if (!fs.existsSync(dir)) {
        return []
    }
    const dirents = await readdir(dir, {withFileTypes: true});
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

export default function setDefault(obj, prop, deflt) {
    return _.has(obj, prop) ? obj[prop] : (obj[prop] = deflt);
}

