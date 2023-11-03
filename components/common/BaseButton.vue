<template>
  <va-button
    class="common-btn"
    @click="onBtnClick"
  >
    <slot />
  </va-button>
  <p>{{ check }}</p>
</template>
<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  check: {
    type: String,
    default: ''
  },
});

const emit = defineEmits(['action'])
const onBtnClick = () => {
  emit('action')
}
</script>
<style lang="scss" scoped></style>
