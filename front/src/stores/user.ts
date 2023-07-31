import { defineStore } from 'pinia';
interface Istate {
    // state: () => {
    //     firstName: string,
    //     userName: string,
    //     uidentity: string,
    //     menuIndex: string,
    //     uid: string,
    //     menuList: Array<string>,
    //     clearInfo: void,
    // },
    str:string,
    state:void,
    persist: boolean
}

const str='user'
export const useUserInfoStore = defineStore(str, {

    state: () => ({
        firstName: '',
        userName: '',
        uidentity: '',
        menuIndex: '0',
        uid: '',
        menuList: [],
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