<script setup>
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const updateValue = (event) => {
  const value = event.target.value;
  emit("update:modelValue", value);
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