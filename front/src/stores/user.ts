import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('user', {
    state: () => ({
            firstName: '',
            userName: '',
            clearInfo() {
                this.firstName = '';
                this.userName = ''
            }
    }),
    persist: true
})