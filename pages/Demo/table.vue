<template>
  <ClientOnly>
    <div>
      <h1>TABLE</h1>
      <div class="btn-add-item">
        <va-input
          v-model="filterText"
          placeholder="Filter..."
          class="w-full"
          @change="changeRouter"
        />
        <va-button @click="openModalToAddItem(rowIndex)">Add Item</va-button>
      </div>
      <div ref="tableContainer">
        <va-data-table
          sticky-header
          height="300px"
          class="custom-table"
          :items="items.data"
          :columns="columns"
          :cell-bind="getCellBind"
        >
          <template #cell(actions)="{ rowIndex }">
            <div class="action-row">
              <va-button preset="plain" icon="edit" @click="openModalToEditItemById(rowIndex)" />
              <va-button
                preset="plain"
                icon="delete"
                class="ml-3 custom-delete"
                @click="openModalToDeleteItemById(rowIndex)"
              />
            </div>
          </template>
        </va-data-table>
      </div>

      <va-modal v-model="showModal" title="Edit product" @ok="handleItem" @cancel="resetItem">
        <div class="infor-product">
          <div class="item">
            <p>Name</p>
            <va-input v-model="productObj.productName" />
          </div>
          <div class="item">
            <p>Size</p>
            <va-input v-model="productObj.productSize" />
          </div>
        </div>
      </va-modal>

      <!-- <va-modal
        v-model="showModalDelete"
        message="Do you want to delete this product?"
        @ok="deleteItem"
        @cancel="resetItem"
      /> -->

      <div class="dialog-delete" v-show="showModalDelete">
        <p class="title">Delete this product?</p>
        <div class="action-delete">
          <va-button @click="resetItem">CANCEL</va-button>
          <va-button @click="deleteItem">OK</va-button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
import { productStore } from '../../store/table/getDataTable'
import { useRoute, useRouter } from 'vue-router'
////
const store = productStore()
const items = reactive({ data: [] })
const editedItemId = ref(0)
const showModal = ref(false)
const showModalDelete = ref(false)

const productObj = reactive({
  productName: '',
  productSize: ''
})
const typeButtonAction = ref('')
const idDelete = ref(0)
const filterText = ref('')
const router = useRouter()

const columns = [
  { key: 'product_id', label: 'ID', sortable: true },
  { key: 'name', label: 'NAME', sortable: true },
  { key: 'category', label: 'CATEGORY', sortable: true },
  { key: 'size', label: 'SIZE', sortable: true },
  { key: 'country', label: 'COUNTRY', sortable: true },
  { key: 'price', label: 'PRICE', sortable: true },
  { key: 'actions', label: 'ACTION', width: 80 }
]

// GET DATA TABLE
onMounted(async () => {
  await store.getDataProduct()
  const temp = store?.product
  items.data = temp.map((item, index) => ({
    ...item,
    id: index
  }))
})
//ADD ITEM
const openModalToAddItem = () => {
  showModal.value = true
  typeButtonAction.value = 'add'
}

//EDIT ITEM
const openModalToEditItemById = (id) => {
  showModal.value = true
  typeButtonAction.value = 'edit'
  editedItemId.value = id
  productObj.productName = items.data.find((item) => item.id === id).name
  productObj.productSize = items.data.find((item) => item.id === id).size
}
const handleItem = () => {
  if (typeButtonAction.value === 'edit') {
    const itemToEdit = items.data.find((item) => item.id === editedItemId.value)
    if (itemToEdit) {
      itemToEdit.name = productObj.productName
      itemToEdit.size = productObj.productSize
    }
  } else {
    const temp = {
      id: items.data.length,
      product_id: String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000),
      name: productObj.productName,
      size: productObj.productSize
    }
    items.data.push(temp)
  }
  showModal.value = false
  productObj.productName = ''
  productObj.productSize = ''
  typeButtonAction.value = ''
}
const resetItem = () => {
  productObj.productName = ''
  productObj.productSize = ''
  typeButtonAction.value = ''
  showModalDelete.value = false
}
//DELETE ITEM
const openModalToDeleteItemById = (id) => {
  idDelete.value = id
  showModalDelete.value = true

  const divToMove = document.querySelector('.dialog-delete')
  const buttonPosition = event.target.getBoundingClientRect()
  divToMove.style.transform = `translate(${buttonPosition.left - 205}px, ${
    buttonPosition.top + 20
  }px)`
}
const deleteItem = () => {
  //   const doubleCountParam  = store.doubleCountParam(2) 
  //   const doubleCount  = store.doubleCount
  store.deleteProduct(idDelete.value)
  items.data = toRaw(store.product)
  showModalDelete.value = false
}

// FILTER
const changeRouter = async () => {
  if (filterText.value === '') {
    await store.getDataProduct()
    items.data = store.product.data
    router.push({ query: {} })
  } else {
    router.push({ query: { search: filterText.value } })
    const temp = items.data.filter((item) =>
      item.name.toLowerCase().includes(filterText.value.toLowerCase())
    )
    items.data = temp
  }
}
///
const getCellBind = (cell, row, column) => {
  if (column.key === 'actions') {
    return {
      style: { background: '#20f78f', position: 'sticky', right: 0, zIndex: 1 }
    }
  }
}
</script>
<style lang="scss">
.btn-add-item {
  display: flex;
  justify-content: space-between;
  margin-right: 30px;
}
.action-row {
  display: flex;
  gap: 15px;
}
.infor-product {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .item p {
    margin-bottom: 10px;
  }
}
.dialog-delete {
  width: 200px;
  height: 100px;
  background-color: aquamarine;
  position: absolute;
}

.custom-class {
  text-decoration: line-through;
  pointer-events: none;
  background-color: var(--va-background-element);
}
.va-data-table .va-data-table__table .va-data-table__table-thead--sticky {
  z-index: 2;
}
.dialog-delete {
  border-radius: 8px;
  padding: 10px;
  width: 200px;
  height: 80px;
  background-color: 20f78f;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.5s ease;
  .title {
    color: red;
    text-align: center;
    margin-bottom: 10px;
  }
}
.action-delete {
  display: flex;
  gap: 30;
  justify-content: space-around;
}
.va-data-table__table-th[title='ACTION'] {
  background-color: #20f78f;
  position: sticky;
  z-index: 2;
  right: 0;
}
</style>
