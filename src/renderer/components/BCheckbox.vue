<template>
    <div class="form-check">
      <label class="form-check-label" style="cursor: pointer">
        <input class="form-check-input" :checked="modelValue" type="checkbox"
               @change="emit('update:modelValue', $event.target.checked)">
        <slot></slot>
      </label>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    'modelValue': Boolean,
})
const emit = defineEmits(['update:modelValue'])
</script>
