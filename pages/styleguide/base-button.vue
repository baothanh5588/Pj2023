<template>
  <h1 style="color: red;">Base Button</h1>
  <BaseButton :disabled="true" @action="handleClick" :check="'abc'">Button</BaseButton>
</template>
<script setup>
import BaseButton from '~/components/common/BaseButton.vue'

const handleClick = () => {
  console.log('handle Click')
}
</script>

<style lang="scss" scoped>
.column-block {
}
</style>
 