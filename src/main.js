import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.min.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'


const app = createApp(App)
app.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true
})

app.use(router)
app.mount('#app')

