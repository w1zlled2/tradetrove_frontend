import { defineStore } from 'pinia';
import config from '../../config';

// let isAuth = false;
// if (localStorage.getItem('isAuth')) {
//    isAuth = true;
// }

const setAuth = (isAuth = false, _this = this) => {
   _this.isAuth = isAuth;
   if (!isAuth) {
      localStorage.removeItem('user');
   }
   localStorage.setItem('isAuth', JSON.stringify({ isAuth: isAuth }));
};

export const useAuthStore = defineStore('auth', {
   state: () => ({
      // test: 'test',
      user: {
         token: null,
         name: null,
      },
      isAuth: JSON.parse(localStorage.getItem('isAuth'))?.isAuth || false,
   }),
   actions: {
      setUser(user) {
         console.log(user);
         this.user = user;
         localStorage.setItem('user', JSON.stringify(user));
         setAuth(true, this);
      },
      async auth() {
         if (!this.user.token) {
            setAuth(false, this);
            return false;
         }
         const response = await fetch(`${config.host}/api/auth`, {
            headers: {
               Authorization: `Bearer ${this.user.token}`,
               'Content-Type': 'application/json',
            },
         });
         const data = await response.json();
         if (data) {
            if (data.success) {
               // alert(localStorage.getItem('isAuth'));
               setAuth(true, this);
               return true;
            } else {
               // alert(localStorage.getItem('isAuth'));
               setAuth(false, this);
               return false;
            }
         }
      },
      async logout() {
         if (!this.user.token) {
            setAuth(false, this);
            return false;
         }
         const response = await fetch(`${config.host}/api/logout`, {
            headers: {
               Authorization: `Bearer ${this.user.token}`,
               'Content-Type': 'application/json',
            },
         });
         const data = await response.json();
         if (data) {
            if (data.success) {
               // alert(localStorage.getItem('isAuth'));
               setAuth(false, this);
               return true;
            } else {
               // alert(localStorage.getItem('isAuth'));
               // setAuth(true, this);
               // return true;
            }
         }
      },
   },
   getters: {
      getUser(state) {
         return state.user;
      },
      getToken(state) {
         return state.user.token;
      },
      getIsAuth(state) {
         return state.isAuth;
      },
   },
});
