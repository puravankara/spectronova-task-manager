import { ref, watch } from 'vue'
import type { ViewMode } from '@/BLL/taskManager/types'

export const useLocalStorage = () => {
  const VIEW_MODE_KEY = 'view-mode'

  const storedView = localStorage.getItem(VIEW_MODE_KEY)

  const activeView = ref<ViewMode>(
    storedView === 'board' || storedView === 'list' ? storedView : 'board',
  )

  watch(activeView, (view) => {
    localStorage.setItem(VIEW_MODE_KEY, view)
  })

  return activeView
}
