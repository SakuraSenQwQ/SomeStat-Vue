<script lang="ts" setup>
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
  document.documentElement.style.setProperty(
    '--img',
    'url(' + store.Configs.value.BackGroundImage + ')',
  )
  return count
})
</script>

<template>
  <div class="banner">
    <div class="displays">
      <h1>Server Status</h1>
      <h2>
        <span class="green">{{ alive }} Online</span> /
        <span class="total">{{ ServerList?.length }} Total</span>
      </h2>
    </div>
    <div class="bannercover"></div>
  </div>
</template>

<style scoped>
.green {
  color: #84ff74;
}
.total {
  color: #3459ff;
}
.banner {
  display: flex;
  position: relative;
  width: 100%;
  height: 30dvh;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}
.displays {
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  height: 100%;
  border-radius: 12px;
  backdrop-filter: blur(1px);
  box-shadow: #222121 0 0 4px;
  h1 {
    color: #000;
    text-shadow: #a1a1a1 0 0 2px;
  }
  h2 {
    color: #fff;
    span {
      text-shadow: #7a7a7a 0 0 4px;
    }
  }
}
.bannercover {
  width: 100%;
  border-radius: 12px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-image: var(--img);
  background-size: cover;
  background-position: centers;
}
</style>
