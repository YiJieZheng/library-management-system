import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './assets/style/main.css'

// 引入数据持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { router } from './router/index'
// 引入阿里云字体图标css
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'
import './router/permission'

// 注册
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

async function call() {
    const app = createApp(App)
    app.use(pinia)
    app.use(ElementPlus)
    app.use(router)
    router.isReady()
    app.mount('#app')
}
call()

