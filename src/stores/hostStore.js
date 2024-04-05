import { defineStore } from "pinia";

export const useHostStore = defineStore("host", {
   state: () => ({
      host: 'http://localhost',
   }),
   actions: {
      setHost(host) {
         this.host = host;
      },
   },
   getters: {
      getHost(state) {
         return state.host;
      },
   },
})