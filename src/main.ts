import { createApp, watch } from 'vue'
import { createPinia, storeToRefs } from 'pinia'

import App from './App.vue'
import router from './router'
import { useCounterStore } from './stores/counter'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const store = storeToRefs(useCounterStore())

useCounterStore().GetConfig()

watch(store.loaded, () => {
  if (store.loaded) {
    app.mount('#app')
  }
})
