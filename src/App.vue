<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useHostStore } from '@/stores/hostStore';

const host = useHostStore().getHost;
const router = useRouter();
const auth = useAuthStore();

const getIsAuth = () => {
   alert(localStorage.getItem('isAuth'));
   console.log(localStorage.getItem('user'));
};
const logout = async () => {
   if (await auth.logout()) {
      router.push('/login');
   }
}
// console.log(auth.auth);
onMounted(async () => {
   console.log(localStorage.getItem('user'));
   console.log(localStorage.getItem('isAuth'));
   // localStorage.removeItem('user');
   // console.log(localStorage.getItem('isAuth'));
   // console.log(`${ typeof (JSON.parse(localStorage.getItem('isAuth')).isAuth)}`);

   // localStorage.setItem('user', JSON.stringify({
   //    name: "Олег",
   //    token: "JWI7quKfZEmATamH2bOlewOKE"
   // }));
   const user = localStorage.getItem('user');
   if (user) {
      auth.setUser(JSON.parse(user));
   }
   const isAuth = localStorage.getItem('isAuth');
   // if (isAuth) {
   //    if (isAuth.isAuth == false || isAuth.isAuth) {
   //       auth.setAuth(true);
   //    }
   // }
   await auth.auth();
});
</script>

<template>
   <header class="header">
      <div class="container header__content">
         <nav v-if="auth.isAuth">
            <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
            <button @click="logout" class="btn">Выход</button>
         </nav>
         <nav v-else>
            <router-link to="/login">Вход</router-link> |
            <router-link to="/register">Регистрация</router-link>
         </nav>
      </div>
   </header>

   <!-- auth: {{ isAuth }} -->
   <!-- auth: {{ auth.isAuth }}
   <br>
   test: {{ auth.test }}
   <br>
   <button @click="getIsAuth">get isAuth</button>
   <br>
   <button @click="auth.test = 'sdaf'">change</button> -->
   <main class="main">
      <router-view />
   </main>
   <footer class="footer">
      <div class="container footer__content">footer</div>
   </footer>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto');
// .router-link-exact-active

* {
   margin: 0;
   padding: 0;
   box-sizing: border-box;
}
a {
   color: inherit;
   text-decoration: none;
   display: inline-block;
   &.link {
      padding-bottom: 2px;
      transition: 0.2s;
      background: linear-gradient(currentColor, currentColor) 50% 100% / 0% 2px no-repeat;
      &:hover {
         background-size: 100% 2px;
      }
   }
}
.router-link-exact-active {
   text-decoration: underline;
   color: #50ba82;
}
button,
input,
select,
textarea {
   border: none;
   background: none;
   font-size: 1em;
}
button {
   cursor: pointer;
}
label[for] {
   cursor: pointer;
}
html,
body {
   font-family: 'Roboto', sans-serif;
}
body {
}
:root {
   --black: #202020;
}
#app {
   font-family: 'Roboto', sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   // text-align: center;
   // color: #2c3e50;
   color: var(--black);
   display: flex;
   flex-direction: column;
   min-height: 100dvh;
}
.title {
   font-size: 36px;
}
.container {
   max-width: 1140px;
   width: 100%;
   margin: 0 auto;
   padding: 0 15px;
}
.header {
}
.main {
   min-height: 100%;
   height: 0;
   display: flex;
   flex-grow: 1;
}
.footer {
}
.center {
   flex-grow: 1;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
}
.title {
}
.form {
   // .form__fields
   &__fields {
      display: flex;
      flex-direction: column;
      gap: 10px;
   }
   // .form__field
   &__field {
   }
   // .form__actions
   &__actions {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
   }
   // .form__error
   &__error {
      margin-top: 10px;
      text-align: center;
      color: red;
   }
   // .form__btn-wrapper
   &__btn-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 10px;
   }
   // .form__btn
   &__btn {
   }
}
.form-field {
   &.invalid .form-field__input {
      border-color: red;
      border-width: 2px;
   }
   // .form-field--checkbox
   &--checkbox {
      display: flex;
      align-items: center;
      gap: 5px;
      .form-field__input {
         flex-shrink: 0;
         width: 13px;
      }
   }
   // .form-field__label
   &__label {
   }
   // .form-field__input
   &__input {
      border: 1px solid #555;
      border-radius: 5px;
      padding: 10px;
      width: 100%;
   }
   // .form-field__errors
   &__errors {
      display: flex;
      flex-direction: column;
      gap: 5px;
      text-align: center;
   }
   // .form-field__error
   &__error {
      color: red;
   }

   // .form-field__input-wrapper
   &__input-wrapper {
      position: relative;

      .form-field__toggle-pas {
         position: absolute;
         top: 50%;
         right: 20px;
         transform: translate(50%, -50%);
      }
      &--password {
         .form-field__toggle-pas--show {
            display: block;
         }
         .form-field__toggle-pas--hide {
            display: none;
         }
         &.show-password {
            .form-field__toggle-pas--show {
               display: none;
            }
            .form-field__toggle-pas--hide {
               display: block;
            }
         }
      }
   }
   // .form-field__toggle-pas
   &__toggle-pas {
   }
}
.btn {
   border: 1px solid #555;
   background-color: #fff;
   border-radius: 5px;
   padding: 10px 20px;
   transition: 0.2s;
   &:not(:disabled):hover {
      background-color: #e2e2e2;
   }
   &:disabled {
      border-color: #999;
      cursor: not-allowed;
   }

}
</style>
