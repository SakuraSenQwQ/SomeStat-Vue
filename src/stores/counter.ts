import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  type Server = {
    pushtime: number
    username: string
    displayname: string
    country: string
    status: string
    image: string
    desc: string
    password: string
    cpuinfo: {
      info: string
      count: number
      usage: number
      uptime: number
    }
    meminfo: {
      total: number
      available: number
      used: number
      usedpercent: number
    }
    diskinfo: {
      total: number
      free: number
      used: number
      usedpercent: number
    }
    netinfo: {
      lastsent: number
      lastrecv: number
      bytessent: number
      bytesrecv: number
    }
  }
  const ServerList = ref<Server[]>()

  type Config = {
    ServerAddress: string
    UpdateTime: number
    BackGroundImage: string
  }
  const Configs = ref<Config>({
    ServerAddress: '',
    UpdateTime: 1,
    BackGroundImage: '',
  })
  const GetConfig = () => {
    fetch('/config.json')
      .then((d) => d.json())
      .then((d) => {
        Configs.value = d
        loaded.value = true
      })
  }
  const loaded = ref(false)
  return { ServerList, Configs, GetConfig, loaded }
})
