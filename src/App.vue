<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const auth = useAuthStore();
// auth.setUser('asf');
console.log(auth.getUser);
onMounted(async () => {
   const response = await fetch('http://localhost/tradetrove/public/api/login', {
      method: 'POST',
      headers: {
         'content-type': 'application/json',
      },
      body: JSON.stringify({
         email: 'user@gmail.com',
         password: 'user',
      }),
   });
   console.log(response);
   router.push('/');
});
</script>

<template>
   <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
   </nav>
   <router-view />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto');

html,
body {
   font-family: 'Roboto', sans-serif;
}

#app {
   font-family: 'Roboto', sans-serif;
}
#app {
   // font-family: Avenir, Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   color: #2c3e50;
}

nav {
   padding: 30px;

   a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
         color: #42b983;
      }
   }
}
</style>
