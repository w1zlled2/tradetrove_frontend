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
};
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
// @import url('https://fonts.googleapis.com/css?family=Roboto');
// @import url('https://fonts.googleapis.com/css?family=Inter');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
// .router-link-exact-active

* {
   margin: 0;
   padding: 0;
   box-sizing: border-box;
   font-family: 'Montserrat', sans-serif;
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
   // color: #50ba82;
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
   // font-family: 'Roboto', sans-serif;
}
body {
}
:root {
   --black-color: #202020;
   --black-color-hover: #464646;
   // --accent-color: #FF5722;
   --accent-color: #ec492a;
   --dark-grey-color: #464646;
   --red-color: #e75e60;
   --green-color: #66d66f;
}
#app {
   // font-family: 'Roboto', sans-serif;
   // font-family: 'Inter', sans-serif;
   // font-family: 'Montserrat', sans-serif;
   font-weight: 500;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   // text-align: center;
   // color: #2c3e50;
   color: var(--black-color);
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
   // background-color: var(--accent-color);
   font-weight: 400;
   background-color: var(--dark-grey-color);
   color: #fff;
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
.btn {
   font-weight: 600;
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
   &--dark {
      background-color: var(--black-color);
      color: #fff;
      border-color: var(--black-color);
      &:not(:disabled):hover {
         background-color: var(--black-color-hover);
         border-color: var(--black-color-hover);
      }
      &:disabled {
         background-color: #555;
         color: #ccc;
         border-color: #555;
         cursor: not-allowed;
      }
   }
}
@keyframes shine {
   0% {
      background-position: 100% 50%;
   }
   100% {
      background-position: -100% 50%;
   }
}
// .btn-loader-pref {
//    position: relative;
//    &::before {
//       content: '';
//       position: absolute;
//       top: 0;
//       right: 0;
//       bottom: 0;
//       left: 0;
//       background: linear-gradient(80deg, rgba(232, 232, 232, 1) 0%, rgba(232, 232, 232, 1) 30%, rgba(255, 255, 255, 1) 50%, rgba(232, 232, 232, 1) 70%, rgba(232, 232, 232, 1) 100%);
//       background-size: 200% 100%;
//       animation: shine 4s linear infinite;
//    }
// }
.btn-loader {
   background: linear-gradient(
      80deg,
      rgba(232, 232, 232, 1) 0%,
      rgba(232, 232, 232, 1) 30%,
      rgba(255, 255, 255, 1) 50%,
      rgba(232, 232, 232, 1) 70%,
      rgba(232, 232, 232, 1) 100%
   );
   // background: linear-gradient(90deg, #FF5722, #FFC107, #FF5722);
   background-size: 200% 100%;
   animation: shine 4s linear infinite;

   // background-color: #ddd;
   // position: relative;
   // &::before{
   //    content:'';
   //    position: absolute;
   //    height: 60%;
   //    aspect-ratio: 1 / 1;
   //    top: 50%;
   //    left: 50%;
   //    transform: translate(-50%, -50%);
   //    border: 5px solid #999;
   //    border-top-color: #FF5722;
   //    border-radius: 50%;
   //    animation: button-loader-spin 1s linear infinite;
   // }
}
@keyframes button-loader-spin {
   0% {
      transform: translate(-50%, -50%) rotate(0deg);
   }
   100% {
      transform: translate(-50%, -50%) rotate(360deg);
   }
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
      justify-content: end;
   }
   // .form__error
   &__error {
      margin-top: 10px;
      text-align: center;
      // color: red;
      color: var(--red-color);
      font-weight: 600;
      font-size: 18px;
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
      border-color: var(--red-color);
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
      padding: 15px;
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
      // color: red;
      color: var(--red-color);
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
         .form-field__input {
            &[type='password'] {
               font-weight: 500;
            }
            &::placeholder {
               font-weight: 400;
            }
            padding-right: 40px;
         }
      }
   }
   // .form-field__toggle-pas
   &__toggle-pas {
   }
   // .form-filed__validations
   &__validations {
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      background-color: #efefef;
      border-radius: 5px;
      padding: 15px 10px;
      // gap: 10px;
   }
   // .form-filed__validation
   &__validation {
      display: flex;
      gap: 5px;
      &:not(:last-child) {
         padding-bottom: 10px;
         margin-bottom: 10px;
         border-bottom: 1px solid #999;
      }
   }
   // .form-filed__validation-icon
   &__validation-icon {
      // font-size: 1.2em;
      flex-shrink: 0;
      // .form-filed__validation-icon--error
      &--error {
         color: var(--red-color);
      }
      // .form-filed__validation-icon--success
      &--success {
         color: var(--green-color);
      }
   }
   // .form-filed__validation-text
   &__validation-text {
   }
}
</style>
