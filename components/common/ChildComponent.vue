<template>
  <div>
    <h1>Child Component</h1>
    <p>User ID: {{ userProp.id }}</p>
    <p>User Name: {{ userProp.name }}</p>
    <va-button @click="sendDataToParent">Send Data To Parent</va-button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

//props value
const props = defineProps({
  userProp: {
    type: Object,
    default: ''
  },
});
//send data to parent
const emit = defineEmits(['change','update'])

const sendDataToParent = () => {
  emit("change", Math.floor(Math.random() * 100));
  emit("update", "Hello from Child");
};
</script>
