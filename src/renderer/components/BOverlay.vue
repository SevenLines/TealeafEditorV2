<template>
    <div class="position-relative">
        <div class="position-absolute w-100" style="z-index: 3000" v-if="show">
            <div class="progress-bar">
                <div class="progress-bar-value"></div>
            </div>
        </div>
         <slot ></slot>
    </div>
</template>

<script setup lang="ts">
import {computed, reactive, watch} from "vue";
import gsap from 'gsap';

const props = defineProps({
    show: {
        default: false,
        type: Boolean
    },
    blur: {
        default: 5,
        type: Number
    }
})

const divStyle = reactive({
  filter:  "blur(0)",
})

watch(() => props.show, (n) => {
    gsap.to(divStyle, {
        duration: 0,
        filter: props.show ? `blur(${Number(props.blur)}px)` : `blur(${Number(0)})`
    })
})

const overlayStyle = computed(() => {
    return {
        display: props.show ? 'flex' : 'none'
    }
})

</script>

<style lang="scss" scoped>
.progress-bar {
  height: 4px;
  background-color: rgba(5, 114, 206, 0.2);
  width: 100%;
  overflow: hidden;
}

.progress-bar-value {
  width: 100%;
  height: 100%;
  background-color: rgb(5, 114, 206);
  animation: indeterminateAnimation 1s infinite linear;
  transform-origin: 0% 50%;
}

@keyframes indeterminateAnimation {
  0% {
    transform:  translateX(0) scaleX(0);
  }
  25% {
    transform:  translateX(0) scaleX(0.4);
  }
  50% {
    transform:  translateX(100%) scaleX(0.5);
  }
  75% {
    transform:  translateX(0) scaleX(0.4);
  }
  100% {
    transform:  translateX(0) scaleX(0);
  }
}
</style>