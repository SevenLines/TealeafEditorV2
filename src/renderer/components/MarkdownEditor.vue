<template>
    <textarea ref="textAreaRef"></textarea>
</template>

<script lang="ts" setup>
import EasyMDE from 'easymde';
import {marked} from 'marked'
import hljs from 'highlight.js'
import _ from "lodash";
import {onBeforeMount, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {previewRenderFunc, uploadFileFunc} from "../utils";


const props = defineProps({
    modelValue: {default: ""},
    maxHeight: {default: "300px"},
    minHeight: {default: "300px"},
    uploadLocalFuncPath: {default: ""},
    uploadLocalFuncSubPath: {default: ""},
    customRenderFunction: {default: null},
    sideBySideFullscreen: {default: true},
})

const emit = defineEmits([
    "update:modelValue"
]);

let mde: EasyMDE | null = null;
const pastAsCode = ref(false);
const textAreaRef = ref();

watch(() => props.modelValue, () => {
    createMde()
    if (mde.value() !== props.modelValue) {
        mde.value(props.modelValue || '');
    }
})

function createMde() {
    if (mde)
        return

    mde = new EasyMDE({
        element: (textAreaRef.value as HTMLElement),
        spellChecker: false,
        uploadImage: true,
        maxHeight: props.maxHeight,
        minHeight: props.minHeight,
        autoRefresh: { delay: 100 },
        imageAccept: "image/png,image/jpeg,image/gif,docx,xlsx",
        sideBySideFullscreen: props.sideBySideFullscreen,
        async imageUploadFunction(file: File, onSuccess: any) {
            let buffer = await file.arrayBuffer()
            let data = await uploadFileFunc(file, buffer);
            onSuccess(data.link);
        },
        previewRender(plainText: string) {
            let result: string = "";
            result = previewRenderFunc(plainText);
            return result;
        },
        imagesPreviewHandler(string) {
            return string;
        },
        renderingConfig: {
            codeSyntaxHighlighting: true,
            hljs
        },
        indentWithTabs: false,
        tabSize: 4,
        initialValue: props.modelValue
    });

    mde.codemirror.on("change", () => {
        if (mde) {
            emit("update:modelValue", mde.value())
        }
    });

    mde.codemirror.on("beforeChange", (cm, change) => {
        if (change.origin === "paste") {
            console.log(change)
            let ltrim = _(change.text).filter((line: String) => line.trim().length > 0).map((line: String) => {
                return (line.match(/^\s+/) || [""])[0].length || 0;
            }).min();

            let newLines = _(change.text).map(x => x.slice(ltrim)).value();
            if (pastAsCode.value) {
                newLines.unshift("```");
                newLines.push("```");
            }
            pastAsCode.value = false;

            if (change.update)
                change.update(null, null, newLines);
        }
    });
}


onMounted(() => {
    createMde();
});


onBeforeUnmount(() => {
    if (mde) {
        mde.toTextArea();
    }
    mde = null;
})
</script>

<style lang="scss">
@import "easymde/dist/easymde.min.css";

.EasyMDEContainer {
  img {
    max-width: 100%;
  }
}
</style>