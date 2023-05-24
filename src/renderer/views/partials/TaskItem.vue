<template>
    <div ref="rootRef" class="task position-relative" :class="klass" :style="style" @click="emit('click')">
        <div class="position-absolute" v-if="withSelectedCheckBox" style="right: 0.5em; top: 0.5em">
            <b-checkbox :model-value="selected" />
        </div>
        <div class="task-rendered-content" v-html="contentRendered"></div>
        <div class="d-flex justify-content-between" v-if="withEditBar">
            <div class="d-flex align-items-center">

                <button class="ms-2 btn btn-sm btn-warngin" @click="emit('tip')">Подсказка</button>
                <div class="ms-2">id: {{ task.id }}</div>
            </div>
            <div>
                <button class="btn btn-sm btn-info" @click="emit('edit')"><i class="fad fa-edit"></i>
                </button>
                <button size="sm" class="btn btn-sm ms-2" :class="task.visible ? 'btn-success' : 'btn-outline-success'" @click="emit('eye')">
                    <i class="fas" :class="{'fa-eye': task.visible, 'fa-eye-slash': !task.visible}"></i>
                </button>
                <button class="ms-2 btn btn-sm btn-danger"  @click="emit('remove')"><i
                    class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ComplexityTypes} from "../../consts";
import hljs from "highlight.js"
import {computed, nextTick, ref, watch} from "vue";
import useDisciplineStore from "../../store/disciplineStore";
import {storeToRefs} from "pinia";
import {TaskDTO} from "../../types";
import BCheckbox from "../../components/BCheckbox.vue";


const props = defineProps({
    activeTask: {
        default: null,
        type: Object as () => TaskDTO | null,
    },
    task: {
        required: true,
        type: Object as () => TaskDTO
    },
    withEditBar: {default: true},
    withSelectedCheckBox: {default: false},
    selected: {default: false},
})

const emit = defineEmits([
    'click',
    'tip',
    'edit',
    'eye',
    'remove',
])

const rootRef = ref();

const disciplineStore = useDisciplineStore();
const contentRendered = ref("")
const {
    activeDiscipline
} = storeToRefs(disciplineStore)


watch(() => props.task, async () => {
    if (activeDiscipline.value) {
        contentRendered.value = await window.electronAPI.fsPreviewRenderFunc(props.task.content, activeDiscipline.value.jekyll_folder);
    }
}, {
    immediate: true
})

watch(contentRendered, () => {
    nextTick(() => {
        rootRef.value.querySelectorAll("pre").forEach((block: any) => {
            hljs.highlightBlock(block);
        })
    })

})

const klass = computed(() => {
    let klass = ""
    switch (props.task.complexity) {
        case ComplexityTypes.undefined:
            klass = "task undefined";
            break;
        case ComplexityTypes.easy:
            klass = "task easy";
            break;
        case ComplexityTypes.medium:
            klass = "task medium";
            break;
        case ComplexityTypes.hard:
            klass = "task hard";
            break;
        case ComplexityTypes.nightmare:
            klass = "task nightmare";
            break;
        case ComplexityTypes.info:
            klass = "task info";
            break;
    }

    if (props.withSelectedCheckBox && !props.selected) {
        klass += " is-not-visible ";
    }

    return klass
})


const style = computed(() => {
    return {
        opacity: props.activeTask == null || props.activeTask.id === props.task.id ? "100%" : "50%"
    }
})
</script>

<style lang="scss">
@import "../../assets/consts";
@import "highlight.js/styles/default.css";

.tasks-item-index {

    .index-label {
        font-size: 16px;
        //padding-top: 2px;
        height: 30px;
        width: 30px;
        text-align: center;
        border-radius: 50%;
        background: white;
        border: 2px solid;
    }
}


@mixin task($color, $color2) {
    background: $color;
    box-shadow: 0 0 6px lighten($color, 3);
    border-bottom: 2px solid darken($color, 20);

    &.is-not-visible {
        opacity: 0.5;
        background: lighten($color, 15);
    }

    td {
        border-color: darken($color, 20);
    }

    &:last-child {
        border-bottom: 0;
    }

    background: linear-gradient(90deg, $color, $color2);

    .tasks-item-index {
        background-color: lighten($color, 5);

        .index-label {
            color: darken($color, 40);
            border-color: darken($color, 15);
            box-shadow: 0 0 2px darken($color, 30) inset;
        }
    }

    .task-button-up {
        background-color: darken($color, 15);
        border: 1px solid darken($color, 20);
    }

    .task-button-down {
        background-color: darken($color, 15);
        border: 1px solid darken($color, 20);
    }

    .task-visible-button {
        background-color: darken($color, 25);
        border: 1px solid darken($color, 30);
        color: darken($color, 50);

        &.is-not-visible {
            background-color: transparent;
            color: darken($color, 50);
            border: none;
        }
    }

    .task-rendered-content {
        pre {
            background-color: lighten($color, 20);
            border: 1px solid $color;
            border-radius: 0.5em;
            padding: 0.5em;
        }

        img {
            max-width: 100%;
        }
    }
}

.task {
    transition: all 0.1s;
    padding: 1em;

    img {
        max-width: 100%;
    }

    .task-rendered-content {
        p, pre {
            margin-bottom: 0.5em;
        }

    }

    &.easy {
        @include task(#e3ff7e, #ffed6b);
    }

    &.medium {
        @include task(#ffdb5b, #ffcf25);
    }

    &.hard {
        @include task(#ff7b8f, #ffd11c);
    }

    &.info {
        @include task(#7bdaff, #bee3d1);
    }

    &.nightmare {
        background-color: lighten($NIGHTMARE_COLOR, 40);
    }

    &:first-child {
        .task-button-up {
            display: none;
        }
    }

    &:last-child {
        .task-button-down {
            display: none;
        }
    }
}
</style>