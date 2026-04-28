<script setup lang="ts"></script>

<template>
  <RouterView />
</template>

<style>
:root {
  --text: #000;
  --bg: #fff;
}
body {
  margin: 0;
  padding: 0;
}

.page {
  display: flex;
  padding: 1rem;
  min-height: 100dvh;
  box-sizing: border-box;
  overflow: hidden;
  justify-content: center;
}
</style>
