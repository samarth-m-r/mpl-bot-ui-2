import { createRouter, createWebHistory } from 'vue-router'
import CxAgentMva from '@/components/virtual-assistants/cx-agent-mva/CxAgentMva.vue'
import ComingSoon from '@/components/virtual-assistants/ComingSoon.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/virtual-assistants'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: ComingSoon
    },
    {
      path: '/virtual-assistants',
      name: 'virtual-assistants',
      component: CxAgentMva
    }
  ]
})

export default router
