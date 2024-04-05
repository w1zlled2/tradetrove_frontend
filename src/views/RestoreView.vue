<script setup>


</script>
<template>
   <div class="login">
      <h2 class="login__title title">Вход</h2>
      <form class="login__form form">
         <div class="form__field form-field">
            <div class="form-field__label">Номер телефона или Email</div>
            <input type="text" class="form-field__input">
            <div class="form-field__error">Ошибка</div>
         </div>
         <div class="form__field form-field">
            <div class="form-field__label">Пароль</div>
            <div class="form-field__input-wrapper">
               <input type="password" class="form-field__input">
               <button type="submit" class="button"><font-awesome-icon icon="eye" /></button>
               <button type="submit" class="button"><font-awesome-icon icon="eye-slash" /></button>
            </div>
            <div class="form-field__error">Ошибка</div>
         </div>
         <div class="form__actions">
            <div class="form-field form-field--checkbox">
               <input type="checkbox" class="form-field__input">
               <div class="form-field__label">Запомнить меня</div>
            </div>
            <router-link to="/restore"></router-link>
         </div>

      </form>
   </div>
</template>

<style scoped>
</style>
