<script setup lang="ts">
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <input
    :value="modelValue"
    @input="updateValue"
    class="border p-2 rounded w-full"
    placeholder="Enter text"
  />
</template>
