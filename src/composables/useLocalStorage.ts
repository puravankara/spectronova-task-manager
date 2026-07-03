import { ref, watch } from 'vue'
import type { ViewMode } from '@/BLL/taskManager/types'

export const useLocalStorage = () => {
  const VIEW_MODE_KEY = 'view-mode'

  const activeView = ref<ViewMode>(localStorage.getItem(VIEW_MODE_KEY) as ViewMode) ?? 'board'

  watch(activeView, (view) => {
    localStorage.setItem(VIEW_MODE_KEY, view)
  })

  return activeView
}
