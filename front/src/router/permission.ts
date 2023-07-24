import { createPinia } from 'pinia';
import { type RouteRecordRaw } from 'vue-router';
import { asyncRoutes, router } from './index';
const pinia = createPinia()
/**
 * 筛选可访问的动态路由
 * roles：用户角色
 * route：访问的动态列表
 */
export const filterAsyncRoutes = async (routes: RouteRecordRaw[], role: string[]) => {
    if (role.includes('admin')) {
        await routes.forEach(async (route: any) => {
            await router.addRoute(route)
        })
    }
}

const createRouter = async () => {
    
    await filterAsyncRoutes(asyncRoutes, [`${localStorage.getItem('uidentity')}`])
    await router.beforeEach(async (to, from, next) => {
        if (localStorage.getItem('token')) {
            if (localStorage.getItem('uidentity')) {
                console.log('进入守卫');
                if (to.path == '/login') {
                    next(from.fullPath)
                } else {
                    next()
                }
            } else {
                next()
            }
        } else {
            if (to.path == '/login') {
                next()
            } else {
                next('/login')
            }
        }
    })
}
createRouter()