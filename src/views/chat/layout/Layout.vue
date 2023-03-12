<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Sider from './sider/index.vue'
import Header from './header/index.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useChatStore } from '@/store'

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const api = axios.create({
  baseURL: 'http://localhost:3002', // 将此处的 URL 替换为您的后端 API URL
})

router.replace({ name: 'Chat', params: { uuid: chatStore.active } })

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)
const token = localStorage.getItem('token')

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
})

onMounted(() => {
  // console.log(token)
  if (!token) {
    router.push('/')
  }
  else {
    api.get('/verify', { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
      // console.log('Verified user: ', response.data)
    }).catch((error) => {
      console.error('Error verifying token: ', error)
      router.push('/')
    })
  }
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})
</script>

<template>
  <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider />
        <Header v-if="isMobile" />
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
  </div>
</template>
