<script setup lang="ts">
import C_AllServer from '@/comp/C_AllServer.vue'
import C_Banner from '@/comp/C_Banner.vue'
import C_Footer from '@/comp/C_Footer.vue'
</script>

<template>
  <div class="page index">
    <C_Banner />
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
