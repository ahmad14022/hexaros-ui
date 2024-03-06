import { createApp, h } from 'vue'
import App from './App'
import router from './router'
import {store} from './store'


// mounted() {
//     this.createJoystick();
// }
createApp(App)
.use(router)
.use(store)
.mount('#app');




