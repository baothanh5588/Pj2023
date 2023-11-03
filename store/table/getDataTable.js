import { defineStore } from 'pinia'
import { useApi } from '@/helpers/useFetch'

export const productStore = defineStore('product', {
  state: () => ({
    product: [],
    count: 1
  }),
  getters: {
    doubleCountParam: (state) => {
      return (id) => state.count * 2
    },
    doubleCount(state) {
      return state.count*3
    },
  },
  actions: {
    async getDataProduct() {
      try {
        const tmp = await useApi.requestElic.get('https://api.nuxtjs.dev/beers')
        this.product = toRaw(tmp.data)
      } catch (error) {
        return error
      }
    },
    deleteProduct(id) {
      this.product = toRaw(this.product).filter((item, index) => index !== id)
    }
  }
})
