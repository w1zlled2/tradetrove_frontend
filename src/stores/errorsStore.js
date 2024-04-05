import { defineStore } from "pinia";
export const useErrorsStore = defineStore("errors", {
   state: () => ({
      errorMessages: {
         'Authentication failed': 'Неверный пароль. Попробуйте снова',
      },
   }),
   actions: {
      setErrors(errors) {
         this.errors = errors;
      },
   },
})