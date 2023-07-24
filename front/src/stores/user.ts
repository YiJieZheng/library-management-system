import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('user', {
    state: () => ({
        firstName: '',
        userName: '',
        uidentity: '',
        menuIndex: '0',
        menuList:[],
        clearInfo() {
            this.firstName = '';
            this.userName = '';
            this.menuIndex = '0';
            this.uidentity = '';
            this.menuList = []
        }
    }),
    persist: true
})