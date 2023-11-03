<template>
  <div>
    <h1>Parent Component</h1>
    <va-button @click="incrementRef">incrementRef</va-button>
    <p>Ref: {{ count }}</p>

    <va-button @click="incrementObject">incrementObject</va-button>
    <p>Object: {{ state.count }}</p>

    <p>{{ computedExp }}</p>

    <ChildComponent :userProp="userDataProps" @change="handleChange" @update="handleUpdate" />
  </div>
  <p>================================================</p>

  <va-data-table
    :items="store.userData.data"
    :columns="columns"
  >

  </va-data-table>
</template>

<script setup>
import { ref, reactive, computed, defineProps } from 'vue'
import ChildComponent from '../../components/common/ChildComponent.vue'
import { useUsersStore } from '~/store/table/getDataTable'

// reactive variable
const count = ref(0)
const incrementRef = () => {
  count.value++
}
// reactive object
const state = reactive({
  count: 1,
  message: 'Hello Vue!'
})
const incrementObject = () => {
  state.count++
}
//computed
const computedExp = computed(() => {
  return 'This is computed'
})
//props
const userDataProps = {
  id: 3,
  name: 'John Doe',
  age: [25, 30],
  show: true
}
//emit từ child
const handleChange = (id) => {
  console.log('Received "change" event with ID:', id)
}
const handleUpdate = (value) => {
  console.log('Received "update" event with value:', value)
}
//store
const store = useUsersStore()
onMounted(async () => {
  await store.registerUser()
})
</script>
