<script setup lang="ts">
import C_AllServer from '@/comp/C_AllServer.vue'
import C_Footer from '@/comp/C_Footer.vue'
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const store = storeToRefs(useCounterStore())

const ServerList = store.ServerList

const alive = computed(() => {
  let count = 0
  for (let i = 0; i < (ServerList.value?.length ?? 0); i++) {
    if (ServerList.value![i]?.status === 'alive') {
      count++
    }
  }
  return count
})
</script>

<template>
  <div class="page index">
    <h1>Server Status</h1>
    <h2>{{ alive }} Online / {{ ServerList?.length }} Total</h2>
    <C_AllServer />
    <C_Footer />
  </div>
</template>

<style scoped>
.index {
  flex-direction: column;
  align-items: center;
}
</style>
