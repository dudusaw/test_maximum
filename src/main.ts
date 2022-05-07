import { createApp } from 'vue'
import App from './App.vue'
import router from './plugins/router'
import { createPinia } from 'pinia'

createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app')
