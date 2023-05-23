<template>
    <div class="complexity-list">
        <div v-for="c in complexities" class="complexity-item"
             :class="{[c.class]: true, active: selectedItemId === c.value}"
             :key="c.value"
             @click="onClick(c)"
        ></div>
        <div class="clearfix"></div>
    </div>
</template>

<script lang="ts" setup>
import {watch, ref} from "vue";
import {ComplexityTypes} from "../../consts";

const selectedItemId = ref(0);

const props = defineProps({
    "modelValue": {
        required: true,
        type: Number
    }
})

const emit = defineEmits([
    "update:modelValue"
])

watch(() => props.modelValue, () => {
    selectedItemId.value = props.modelValue
});


const complexities: Array<{
    class: string;
    value: number;
}> = [
    {
        'class': "undefined",
        value: ComplexityTypes.undefined,
    },
    {
        'class': "easy",
        value: ComplexityTypes.easy,
    },
    {
        'class': "medium",
        value: ComplexityTypes.medium,
    },
    {
        'class': "hard",
        value: ComplexityTypes.hard,
    },
    {
        'class': "nightmare",
        value: ComplexityTypes.nightmare,
    },
    {
        'class': "info",
        value: ComplexityTypes.info,
    },
];

function onClick(c: {
    class: string;
    value: number;
}) {
    selectedItemId.value = c.value;
    emit("update:modelValue", selectedItemId.value);
}
</script>

<style scoped lang="scss">
@import "../../assets/consts";

.complexity-list {
  .complexity-item {
    margin-right: 0.5em;
    float: left;
    width: 20px;
    height: 20px;
    background-color: white;
    border: 1px solid black;
    border-radius: 50%;

    cursor: pointer;


    @mixin complex($color) {
      opacity: 0.25;
      background-color: $color;
      transition: all .3s;
      &.active {
        opacity: 1;
        box-shadow: 0 0 0 3px darken($color, 10), 0 0 0 5px darken($color, 25);
      }
      &:hover {
        opacity: 1;
        box-shadow: 0 0 0 2px darken($color, 10);
      }
    }

    &.easy {
      @include complex($EASY_COLOR);
    }

    &.medium {
      @include complex($MEDIUM_COLOR);
    }

    &.hard {
      @include complex($HARD_COLOR);
    }

    &.nightmare {
      @include complex($NIGHTMARE_COLOR);
    }

    &.info {
      @include complex($INFO_COLOR);
    }
  }
}
</style>