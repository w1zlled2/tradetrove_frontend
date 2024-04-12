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
         <router-link to="/" class="header__logo">
            <svg
               width="50"
               class="header__logo-icon"
               viewBox="0 0 500 500"
               xmlns="http://www.w3.org/2000/svg"
            >
               <g
                  transform="matrix(0.3158999979496002, 0, 0, -0.3158999979496002, -318.5169372558594, 818.4301147460936)"
                  fill="#fff"
                  stroke="none"
                  style=""
               >
                  <path
                     d="M1017 2583 c-4 -3 -7 -145 -7 -315 l0 -308 258 2 257 3 3 68 4 67 -186 0 -186 0 0 170 0 170 640 0 640 0 0 -170 0 -170 -255 0 -255 0 0 -470 0 -470 -130 0 -130 0 0 309 0 310 146 248 c80 136 152 258 160 271 8 12 13 22 10 22 -10 0 -449 -486 -457 -506 -4 -13 -7 -198 -6 -411 l2 -388 275 0 275 0 2 470 2 470 256 3 255 2 -2 313 -3 312 -781 3 c-429 1 -784 -1 -787 -5z"
                  />
               </g>
            </svg>

            <div class="header__logo-text">Trade Trove</div>
         </router-link>

         <nav class="header__nav" v-if="auth.isAuth">
            <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
            <router-link to="/post/create" class="btn btn--accent"
               >Разместить объявление</router-link
            >
            <div class="header__logout">
               <router-link to="/profile">
                  <font-awesome-icon icon="user" />
                  {{ auth.user.name }}</router-link
               >
               <button @click="logout" class="btn">Выход</button>
            </div>
         </nav>
         <nav class="header__nav" v-else>
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
}
.link {
   padding-bottom: 2px;
   transition: 0.2s;
   background: linear-gradient(currentColor, currentColor) 50% 100% / 0% 2px no-repeat;
   &:hover {
      background-size: 100% 2px;
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
   // --accent-color: #ec492a;
   --accent-color-light: rgba(140, 182, 88, 0.25);
   --accent-color: #8cb658;
   --accent-color-hover: #74974a;
   --accent-color-active: #668540;
   --dark-grey-color: #464646;
   --red-color: #e75e60;
   --green-color: #66d66f;
   --orange-color: #e69d16;
   --orange-color-hover: #c98912;
   --orange-color-active: #b47b0f;
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
   // .header__content
   &__content {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: center;
   }
   // .header__nav
   &__nav {
      display: flex;
      align-items: center;
      gap: 15px;
   }
   // .header__logout
   &__logout {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: 15px;
   }
}
.main {
   min-height: 100%;
   // height: 1000px;
   display: flex;
   flex-grow: 1;
   margin: 50px 0;
   &.center {
      align-items: center;
   }
}
.main:has(> .center) {
   align-items: center;
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
   // .btn--dark
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
      }
   }
   // .btn--accent
   &--accent {
      background-color: var(--accent-color);
      border-color: var(--accent-color);
      color: #fff;
      &:not(:disabled):hover {
         background-color: var(--accent-color-hover);
         border-color: var(--accent-color-hover);
      }
      &:not(:disabled):active {
         background-color: var(--accent-color-active);
         border-color: var(--accent-color-active);
      }
      &:disabled {
         // background-color: #555;
         // color: #ccc;
         // border-color: #555;
         // cursor: not-allowed;
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
.loader {
   border: var(--bor-w, 5px) solid #999;
   border-top-color: #ff5722;
   border-radius: 50%;
   animation: loader-spin 1s linear infinite;
}
@keyframes loader-spin {
   0% {
      transform: rotate(0deg);
   }
   100% {
      transform: rotate(360deg);
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
      &--email {
         display: flex;
         gap: 5px;
         align-items: center;
      }
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
.breadcrumbs {
   // .breadcrumbs__list
   &__list {
      color: #666;
      display: flex;
      align-items: start;
      gap: 10px;
   }
   // .breadcrumbs__item
   &__item {
   }
   // .breadcrumbs__separator
   &__separator {
      padding-top: 0.2em;
      font-size: 0.8em;
      &::before {
         // content:'/';
      }
   }
}
.input,
.textarea {
   border: 1px solid #555;
   border-radius: 5px;
   padding: 15px;
   width: 100%;
   background-color: #fff;
   transition: border 0.2s;
   &.invalid {
      border-width: 2px;
      border-color: var(--red-color);
   }
}
.textarea {
   resize: vertical;
   min-height: 70px;
   max-height: 500px;
}
.input-hidden {
   position: absolute;
   width: 0;
   height: 0;
   opacity: 0;
   pointer-events: none;
}
input[type='radio'] {
   cursor: pointer;
}
.radio {
   // display: flex;
   // gap: 10px;
}
.radio__input {
   width: 1.3em;
   height: 1.3em;
   background-color: var(--accent-color);
   display: none;
   &:checked + .radio__label {
      &::after {
         transform: translateY(-50%) scale(1);
         opacity: 1;
      }
   }
}
.radio__label {
   // line-height: 1.3em;
   display: inline-block;
   position: relative;
   // display: flex;
   // gap: 10px;
   padding-left: calc(1.3em + 10px);
   &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid var(--accent-color);
   }
   &::after {
      transition: 0.1s;
      content: '';
      position: absolute;
      top: 50%;
      left: 5px;
      opacity: 0;
      transform: translateY(-50%) scale(0.5);
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: var(--accent-color);
   }
}
.success-modal {
   // .success-modal__header
   &__header {
   }
   // .success-modal__title
   &__title {
   }
   // .success-modal__close
   &__close {
   }
   // .success-modal__content
   &__content {
      min-height: 300px;
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
      justify-content: center;
   }
   // .success-modal__icon
   &__icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: var(--accent-color);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
   }
   // .success-modal__icon-svg
   &__icon-svg {
      font-size: 60px;
   }
   // .success-modal__text
   &__text {
      text-align: center;
      max-width: 400px;
      margin: 0 auto;
      width: 100%;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      gap: 20px;
   }
   // .success-modal__text-title
   &__text-title {
      font-size: 20px;
   }
   // .success-modal__text-subtitle
   &__text-subtitle {
      font-size: 16px;
      color: #666;
   }
   // .success-modal__footer
   &__footer {
      display: flex;
      justify-content: center;
      font-size: 20px;
   }
}

.content-modal {
   // .content-modal__header
   &__header {
      padding-bottom: 10px;
      border-bottom: 1px solid #999;
      margin-bottom: 10px;
      display: flex;
      gap: 20px;
      justify-content: space-between;
      align-items: center;
   }
   // .content-modal__title
   &__title {
      font-size: 22px;
      font-weight: 600;
   }
   // .content-modal__close
   &__close {
      flex-shrink: 0;
      font-size: 36px;
      transition: 0.15s;
      &:hover {
         color: var(--red-color);
      }
   }
}
.form-add-post__field--phone {
   max-height: 0;
   overflow: hidden;
   opacity: 0;
   transition: 0.2s;
   &.active {
      opacity: 1;
      overflow: visible;
      max-height: 73px;
   }
}
.category-modal {
   min-width: 900px;
   min-height: 400px;
   display: flex;
   flex-direction: column;
   // .category-modal__header
   &__header {
   }
   // .category-modal__title
   &__title {
   }
   // .category-modal__close
   &__close {
   }
   // .category-modal__content
   &__content {
      // height: 100%;
      flex-grow: 1;
   }
   // .category-modal__loader
   &__loader {
      width: 50px;
      height: 50px;
      margin: auto;
   }
   // .category-modal__row
   &__row {
      display: flex;
   }
   // .category-modal__main-col
   &__main-col {
      width: 25%;
      flex-shrink: 0;
      margin-right: 10px;
      padding-right: 10px;
      border-right: 1px solid #999;
   }
   // .category-modal__second-col
   &__second-col {
   }
}
.main-category {
   // .main-category__list
   &__list {
      display: flex;
      flex-direction: column;
      // gap: 10px;
   }
   // .main-category__item
   &__item {
      text-align: left;
      font-weight: 500;
      padding: 15px;
      transition: 0.15s;
      &:not(:last-child) {
         border-bottom: 1px solid #999;
      }
      &:hover {
         background-color: #eee;
      }
      // .main-category__item--active
      &--active {
         background-color: #ddd;
      }
   }
}
.second-category {
   flex-grow: 1;
   // .second-category__list
   &__list {
      // display: flex;
      // flex-direction: column;
      // gap: 10px;

      display: flex;
      flex-wrap: wrap;
      // margin: 0 -15px;
      gap: 15px 25px;
      align-items: start;
   }
   // .second-category__item
   &__item {
      // margin: 0 15px;
      // width: calc(50% - 30px);
   }
}
.item-second-category {
   background-color: #eee;
   padding: 5px 10px;
   border-radius: 3px;
   // .item-second-category__title
   &__title {
      font-weight: 600;
      font-size: 16px;
      &:not(:last-child) {
         margin-bottom: 5px;
      }
   }
   // .item-second-category__list
   &__list {
      display: flex;
      align-items: start;
      flex-direction: column;
      gap: 3px;
   }
   // .item-second-category__item
   &__item {
      text-align: left;
      font-weight: 500;
      font-size: 14px;
      background-size: 0% 1px;
      &:hover {
         background-size: 100% 1px;
      }
   }
}
.color-red {
   color: var(--red-color);
}
</style>
