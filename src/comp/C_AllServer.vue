<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { onMounted } from 'vue'

const store = storeToRefs(useCounterStore())

const ServerList = store.ServerList
const address = useCounterStore().Configs.ServerAddress
function GetData() {
  fetch(address)
    .then((res) => res.json())
    .then((data) => {
      ServerList.value = data
      for (let i = 0; i < ServerList.value!.length; i++) {
        const time = new Date()
        const Server = ServerList.value![i]
        if ((Server?.pushtime ?? 0) + 10 < Number(time) / 1000) {
          Server!.status = 'dead'
        } else {
          Server!.status = 'alive'
        }
      }
      setTimeout(() => {
        const doms = document.querySelectorAll('.process')
        const dom2 = document.querySelectorAll('.cover')
        const all = []
        all.push(...doms)
        all.push(...dom2)
        for (let i = 0; i < all.length; i++) {
          const dom = all[i] as HTMLElement
          let name = 'process'
          if (dom.id == 'cpu') {
            name = 'cover'
          }
          const info = Number(getComputedStyle(dom).getPropertyValue('--p').replace('%', ''))
          if (info >= 80) {
            dom.classList.value = 'top ' + name
          }
          if (info >= 50 && info < 80) {
            dom.classList.value = 'med ' + name
          }
          if (info >= 0 && info < 50) {
            dom.classList.value = 'lower ' + name
          }
        }
      }, 0)
    })
}

const CoverToGB = computed(() => {
  return (bytes: number) => {
    return (bytes / 1024 / 1024 / 1024).toFixed(1) + 'G'
  }
})
const CoverToMB = computed(() => {
  return (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + 'M'
  }
})

const CoverDay = computed(() => {
  return (s: number) => {
    if (s < 60) {
      return Math.floor(s) + 's'
    }
    if (s >= 60 && s < 3600) {
      return Math.floor(s / 60) + 'm'
    }
    if (s >= 3600 && s < 86400) {
      return Math.floor(s / 3600) + 'h'
    }
    if (s >= 86400) {
      return Math.floor(s / 86400) + 'd'
    }
  }
})

async function Update() {
  GetData()
  setInterval(() => {
    GetData()
  }, 1000 * store.Configs.value.UpdateTime)
}

const lastPushTime = computed(() => {
  return (time: number) => {
    if (time == 0) {
      return '未收到信息'
    }
    const now = new Date()
    const s = Math.floor(Math.floor(Number(now) / 1000) - time)

    if (s < 60) {
      if (s < 0) {
        return 0 + '秒前'
      } else {
        return s + '秒前'
      }
    }
    if (s >= 60 && s < 3600) {
      return Math.floor(s / 60) + '分钟前'
    }
    if (s >= 3600 && s < 86400) {
      return Math.floor(s / 3600) + '小时前'
    }
    if (s >= 86400) {
      return Math.floor(s / 86400) + '天前'
    }
  }
})

onMounted(() => {
  Update()
})
</script>
<template>
  <div class="servers">
    <div
      :class="'server ' + v.status"
      v-for="(v, i) in ServerList"
      :key="i"
      :id="'s' + i"
      :title="v.desc"
    >
      <div class="title">
        <div class="left">
          <img src="/flag/cn.svg" alt="" />
          <h1>{{ v.displayname }}</h1>
        </div>
        <div class="right">
          <div class="cpu" :title="v.cpuinfo.info">
            <div class="info">
              <img src="/icon/microchip-solid-full.svg" alt="" />
              <span>{{ v.cpuinfo.count }}/{{ v.cpuinfo.usage.toFixed(1) }}%</span>
            </div>
            <div class="cover" id="cpu" :style="{ '--p': Math.floor(v.cpuinfo.usage) + '%' }"></div>
          </div>
          <div class="info" title="在线天数">
            <img src="/icon/clock-regular-full.svg" alt="" />
            <span>{{ CoverDay(v.cpuinfo.uptime) }}</span>
          </div>
        </div>
      </div>
      <div class="stat">
        <div class="net">
          <div class="info">
            <img class="icon" src="/icon/upload-solid.svg" alt="" />
            <span title="上传（速率|总量）"
              >{{ CoverToMB(v.netinfo.bytessent - v.netinfo.lastsent) }} |{{
                CoverToGB(v.netinfo.bytessent)
              }}</span
            >
            <img class="icon" src="/icon/download-solid.svg" alt="" />
            <span title="下载（速率|总量）"
              >{{ CoverToMB(v.netinfo.bytesrecv - v.netinfo.lastrecv) }}|{{
                CoverToGB(v.netinfo.bytesrecv)
              }}
            </span>
          </div>
        </div>
        <div class="mem">
          <div class="info">
            <img class="icon" src="/icon/memory-solid.svg" alt="" />
            <span title="内存（总量|空闲|使用率）">
              {{ CoverToGB(v.meminfo.total) }} | {{ CoverToGB(v.meminfo.available) }} |
              {{ v.meminfo.usedpercent.toFixed(1) }}%
            </span>
          </div>
          <div class="process" :style="{ '--p': v.meminfo.usedpercent + '%' }"></div>
        </div>
        <div class="other">
          <div class="disk" title="磁盘（总大小|空闲|使用率）">
            <img class="icon" src="/icon/save-solid.svg" alt="" />
            <span>
              {{ CoverToGB(v.diskinfo.total) }} | {{ CoverToGB(v.diskinfo.free) }} |
              {{ v.diskinfo.usedpercent.toFixed(1) }}%</span
            >
          </div>
          <span title="更新时间">{{ lastPushTime(v.pushtime) }}</span>
          <div class="process" :style="{ '--p': v.diskinfo.usedpercent + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cpu {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 5;
}
.cover {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--p);
  z-index: 1;
}
.other {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0.2rem;
  position: relative;
  z-index: 5;
}
.disk {
  gap: 0.4rem;
  display: flex;
  align-items: center;
  img {
    width: 1rem;
  }
}
span {
  font-size: 0.8rem;
}
.servers {
  --alive: #b6f8b6;
  --dead: #ffa8a8;
}
.top {
  transition: 0.4s;
  background-color: #ff0000;
}
.lower {
  transition: 0.4s;
  background-color: #ffffff;
}
.med {
  transition: 0.4s;
  background-color: #ffa827;
}
.dead {
  transition: 0.5s;
  background-color: var(--dead) !important;
}
.alive {
  transition: 0.5s;
  background-color: var(--alive) !important;
}
.stat {
  padding-top: 0.5rem;
  display: flex;
  gap: 0.2rem;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  height: 100%;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.net,
.mem {
  display: flex;
  height: 1.3rem;
  justify-content: start;
  position: relative;
  width: 100%;
  padding: 0 0.2rem;
  box-sizing: border-box;
}
.info {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.2rem;
}
.process {
  border-radius: 12px;
  width: var(--p);
  align-self: center;
  height: 10%;
  transition: 0.4s;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
}

.servers {
  display: grid;
  width: 80dvw;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 0));
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
.server {
  display: flex;
  gap: 0.4rem;
  flex-direction: column;
  width: 16rem;
  height: 9rem;
  border: #000 solid 1px;
  box-shadow: #000 0 0 4px;
  padding: 0.5rem;
  transition: 0.5s;
  background-color: var(--bg);
  box-sizing: border-box;
  border-radius: 12px;
  h1 {
    font-size: 1rem;
    margin: 0;
  }
  p {
    margin: 0;
    white-space: pre-wrap;
  }
}
.title {
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    gap: 0.2rem;
    img {
      width: 2rem;
    }
  }
  .right {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    img {
      width: 1.5rem;
    }
  }
}
.icon {
  height: 80%;
}
</style>
