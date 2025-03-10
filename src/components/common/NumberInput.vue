<script setup lang="ts">

const props = defineProps<{ modelValue: number }>();
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

</script>
<template>
  <input
    :value="modelValue"
    @input="updateValue"
    class="border p-2 rounded w-full"
    placeholder="Enter number"
  />
</template>

