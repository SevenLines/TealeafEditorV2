import {marked} from "marked";
import path from "path";
const { nativeImage, shell } = require('electron')

export default async function openUrlInBrowser(event, url) {
    await shell.openExternal(url)
}