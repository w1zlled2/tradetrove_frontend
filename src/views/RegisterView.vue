<!-- TODO: сделать проверку занятости почты при вводе ее (через 2 сек после остановки отправить запрос к API, и сделать API) -->
<script setup>
import { computed, ref, watch } from 'vue';
import { useHostStore } from '@/stores/hostStore';
import { useRouter } from 'vue-router';
import { useErrorsStore } from '@/stores/errorsStore';
import { useAuthStore } from '@/stores/authStore';

const host = useHostStore().host;
const router = useRouter();
const errorMessages = useErrorsStore().errorMessages;
const auth = useAuthStore();

const fieldErrors = ref([]);
const messageError = ref('');
const email = ref('');
const first_name = ref('');
const last_name = ref('');
const password = ref('');
const isPasswordShow = ref(false);
const passwordSubmit = ref('');
const isPasswordSubmitShow = ref(false);

const isDisabledButton = computed(() => {
   if (email.value && first_name.value && last_name.value && password.value && passwordSubmit.value && isPasswordSubmited.value) {
      return false;
   } else {
      return true;
   }
});
const isPasswordSubmited = computed(() => {
   if (password.value === passwordSubmit.value) {
      return true;
   } else {
      return false;
   }
});
watch(passwordSubmit, () => {
   if (passwordSubmit.value && passwordSubmit.value != password.value) {
      fieldErrors.value.passwordSubmit = ['Пароли должны совпадать'];
   } else {
      fieldErrors.value.passwordSubmit = null;
   }
});

const sendRegisterForm = async (e) => {
   const form = e.target;
   const response = await fetch(`${host}/api/register`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         email: form.email.value,
         password: form.password.value,
         first_name: form.first_name.value,
         last_name: form.last_name.value,
      }),
   });
   const data = await response.json();
   if (data) {
      if (data.success) {
         router.push('/login');
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
            <h2 class="login__title title">Регистрация</h2>
            <form @submit.prevent="sendRegisterForm" class="login__form form">
               <div class="form__fields">
                  <div :class="{ invalid: fieldErrors.email }" class="form__field form-field">
                     <div class="form-field__label">Email</div>
                     <input v-model="email" name="email" type="email" class="form-field__input" />
                     <div v-if="fieldErrors.email" class="form-field__errors">
                        <div v-for="error in fieldErrors.email" class="form-field__error">{{ error }}</div>
                     </div>
                  </div>
                  <div :class="{ invalid: fieldErrors.first_name }" class="form__field form-field">
                     <div class="form-field__label">Имя</div>
                     <input v-model="first_name" name="first_name" type="text" class="form-field__input" />
                     <div v-if="fieldErrors.first_name" class="form-field__errors">
                        <div v-for="error in fieldErrors.first_name" class="form-field__error">{{ error }}</div>
                     </div>
                  </div>
                  <div :class="{ invalid: fieldErrors.last_name }" class="form__field form-field">
                     <div class="form-field__label">Фамилия</div>
                     <input v-model="last_name" name="last_name" type="text" class="form-field__input" />
                     <div v-if="fieldErrors.last_name" class="form-field__errors">
                        <div v-for="error in fieldErrors.last_name" class="form-field__error">{{ error }}</div>
                     </div>
                  </div>
                  <div :class="{ invalid: fieldErrors.password }" class="form__field form-field">
                     <div class="form-field__label">Пароль</div>
                     <div :class="{ 'show-password': isPasswordShow }" class="form-field__input-wrapper form-field__input-wrapper--password">
                        <input v-model="password" name="password" :type="isPasswordShow ? 'text' : 'password'" class="form-field__input" />
                        <button @click="isPasswordShow = !isPasswordShow" type="button" class="form-field__toggle-pas form-field__toggle-pas--show"><font-awesome-icon icon="eye" /></button>
                        <button @click="isPasswordShow = !isPasswordShow" type="button" class="form-field__toggle-pas form-field__toggle-pas--hide"><font-awesome-icon icon="eye-slash" /></button>
                     </div>
                     <div v-if="fieldErrors.password" class="form-field__errors">
                        <div v-for="error in fieldErrors.password" class="form-field__error">{{ error }}</div>
                     </div>
                  </div>

                  <div :class="{ invalid: fieldErrors.passwordSubmit }" class="form__field form-field">
                     <div class="form-field__label">Повторите пароль</div>
                     <div class="form-field__input-wrapper form-field__input-wrapper--password" :class="{ 'show-password': isPasswordSubmitShow }">
                        <input v-model="passwordSubmit" name="passwordSubmit" :type="isPasswordSubmitShow ? 'text' : 'password'" class="form-field__input" />
                        <button @click="isPasswordSubmitShow = !isPasswordSubmitShow" type="button" class="form-field__toggle-pas form-field__toggle-pas--show"><font-awesome-icon icon="eye" /></button>
                        <button @click="isPasswordSubmitShow = !isPasswordSubmitShow" type="button" class="form-field__toggle-pas form-field__toggle-pas--hide"><font-awesome-icon icon="eye-slash" /></button>
                     </div>
                     <div v-if="fieldErrors.passwordSubmit" class="form-field__errors">
                        <div v-for="error in fieldErrors.passwordSubmit" class="form-field__error">{{ error }}</div>
                     </div>
                  </div>
               </div>

               <!-- <div class="form__actions">
                  <div class="form-field form-field--checkbox">
                     <input name="remember" id="remember" type="checkbox" class="form-field__input" />
                     <label for="remember" class="form-field__label">Запомнить меня</label>
                  </div>
                  <router-link to="/restore" class="link">Восстановить пароль</router-link>
               </div> -->
               <div class="form__btn-wrapper">
                  <button :disabled="isDisabledButton ? true : false" type="submit" class="form__btn btn">Зарегистрироваться</button>
               </div>
               <div class="form__error">{{ messageError }}</div>
            </form>
            <div class="login__register-wrapper">
               <router-link class="login__register link" to="/login">Войти</router-link>
            </div>
            <div class="login__agreement"><p>При регистрации и входе вы соглашаетесь с условиями использования TradeTrove и политикой конфиденциальности.</p></div>
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
   }
}
</style>
