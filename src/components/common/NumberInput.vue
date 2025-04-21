
<template>
  <input
    type="number" 
    :value="modelValue"
    @input="updateValue"
    @keydown="blockInvalidChars"
    class="border p-2 rounded w-full"
    placeholder="Enter number"
  />
</template>

<script setup lang="ts">
defineProps<{ modelValue: number }>();
const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newValue = target.value === "" ? null : Number(target.value);

  if (!isNaN(newValue as number)) {
    emit("update:modelValue", newValue as number);
  } else {
    console.warn("Giá trị không hợp lệ:", target.value);
  }
};
const blockInvalidChars = (event: KeyboardEvent) => {
  if (["e", "E", "+", "-"].includes(event.key)) {
    event.preventDefault();
  }
};
</script>
