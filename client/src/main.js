import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import Training Center styles
import './styles/training-center-base.css'
import './styles/animations.css'

// Import animations
import TrainingCenterAnimations from './utils/training-center-animations.js'

const app = createApp(App)

app.use(router)
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
})

// Make TrainingCenterAnimations globally available
window.TrainingCenterAnimations = TrainingCenterAnimations

app.mount('#app')