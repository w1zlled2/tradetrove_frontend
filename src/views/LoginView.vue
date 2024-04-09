<!-- TODO: сделать восстановление пароля -->
<!-- TODO: 
   сделать типс (tippy) при наведении на кнопку вход/зарегистрироваться при незаполненных полях
<button v-tippy="{ content: 'Hi!' }">Tippy!</button> 
https://vue-tippy.netlify.app/basic-usage -->
<script setup>
import { ref } from 'vue';
import { useHostStore } from '@/stores/hostStore';
import { useRouter } from 'vue-router';
import { useErrorsStore } from '@/stores/errorsStore';
import { useAuthStore } from '@/stores/authStore';

const host = useHostStore().host;
const auth = useAuthStore();
const router = useRouter();
const errorMessages = useErrorsStore().errorMessages;

const isFormSending = ref(false);
const isPasswordShow = ref(false);
const fieldErrors = ref([]);
const messageError = ref('');
const email = ref('');
const password = ref('');

const sendLoginForm = async (e) => {
   const form = e.target;
   isFormSending.value = true;
   const response = await fetch(`${host}/api/login`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         email: form.email.value,
         password: form.password.value,
      }),
   });
   const data = await response.json();
   isFormSending.value = false;
   if (data) {
      if (data.success) {
         auth.setUser(data.data);
         router.push('/');
      } else {
         if (data.errors) {
            fieldErrors.value = data.errors;
         } else {
            messageError.value = errorMessages[data.message] || 'Что-то пошло не так';
         }
      }
   }
};
</script>
<template>
   <div class="center">
      <div class="login">
         <div class="container login__content">
            <h2 class="login__title title">Вход</h2>
            <form @submit.prevent="sendLoginForm" class="login__form form">
               <div class="form__fields">
                  <div :class="{ invalid: fieldErrors.email }" class="form__field form-field">
                     <!-- <div class="form-field__label">Email</div> -->
                     <input
                        v-model="email"
                        name="email"
                        type="email"
                        class="form-field__input"
                        placeholder="Email"
                     />
                     <div v-if="fieldErrors.email" class="form-field__errors">
                        <div v-for="error in fieldErrors.email" class="form-field__error">
                           {{ error }}
                        </div>
                     </div>
                  </div>
                  <div :class="{ invalid: fieldErrors.password }" class="form__field form-field">
                     <!-- <div class="form-field__label">Пароль</div> -->
                     <div
                        class="form-field__input-wrapper form-field__input-wrapper--password"
                        :class="{ 'show-password': isPasswordShow }"
                     >
                        <input
                           v-model="password"
                           name="password"
                           :type="isPasswordShow ? 'text' : 'password'"
                           class="form-field__input"
                           placeholder="Пароль"
                        />
                        <button
                           @click="isPasswordShow = !isPasswordShow"
                           type="button"
                           class="form-field__toggle-pas form-field__toggle-pas--show"
                        >
                           <font-awesome-icon icon="eye" />
                        </button>
                        <button
                           @click="isPasswordShow = !isPasswordShow"
                           type="button"
                           class="form-field__toggle-pas form-field__toggle-pas--hide"
                        >
                           <font-awesome-icon icon="eye-slash" />
                        </button>
                     </div>
                     <div v-if="fieldErrors.password" class="form-field__errors">
                        <div v-for="error in fieldErrors.password" class="form-field__error">
                           {{ error }}
                        </div>
                     </div>
                  </div>
               </div>

               <div class="form__actions">
                  <router-link to="/restore" class="link">Восстановить пароль</router-link>
               </div>
               <div class="form__btn-wrapper">
                  <div
                     v-if="!email || !password"
                     v-tippy="{ content: 'Заполните все поля' }"
                     class="form__btn-wrapper-wrapper"
                  >
                     <button
                        :class="{ 'btn-loader': isFormSending }"
                        :disabled="!email || !password || isFormSending ? true : false"
                        class="form__btn btn"
                        type="submit"
                     >
                        Войти
                     </button>
                  </div>
                  <button
                     v-else
                     :class="{ 'btn-loader': isFormSending }"
                     :disabled="!email || !password || isFormSending ? true : false"
                     class="form__btn btn"
                     type="submit"
                  >
                     Войти
                  </button>
                  <!-- <button v-tippy="{ content: 'Hi!' }" :disabled="!email || !password || isFormSending ? true : false">Tippy!</button>  -->
               </div>
               <div class="form__error">{{ messageError }}</div>
            </form>
            <div class="login__register-wrapper">
               <router-link class="login__register link" to="/register"
                  >Зарегистрироваться</router-link
               >
            </div>
            <div class="login__agreement">
               <p>
                  При регистрации и входе вы соглашаетесь с условиями использования TradeTrove и
                  политикой конфиденциальности.
               </p>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.container {
}
.login {
   max-width: 530px;
   width: 100%;
   margin: 0 auto;
   // .login__content
   &__content {
      // display: flex;
      // flex-direction: column;
   }
   // .login__title
   &__title {
      margin-bottom: 20px;
      text-align: center;
   }
   // .login__form
   &__form {
   }

   // .login__register-wrapper
   &__register-wrapper {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      text-align: center;
   }
   // .login__register
   &__register {
   }
   // .login__agreement
   &__agreement {
      margin-top: 25px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
   }
}
</style>
