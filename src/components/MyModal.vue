<template>
   <div class="modal" :class="{ 'modal--visible': show }" @click="hideModal">
      <div @click.stop class="modal__content">
         <slot></slot>
      </div>
   </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
   show: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(['update:show']);

const hideModal = () => {
   emit('update:show', false);
};

// Если вам нужно включить логирование при монтировании компонента, раскомментируйте строку ниже
// onMounted(() => {
//   console.log('mixin mounted');
// });
</script>

<style lang="scss" scoped>
.modal {
   z-index: 10;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   padding: 20px;
   background: rgba(0, 0, 0, 0.5);
   position: fixed;
   display: flex;

   opacity: 0;
   pointer-events: none;

   transition: 0.2s;
   // .modal--visible
   &--visible {
      opacity: 1;
      pointer-events: all;

      .modal__content {
         transform: scale(1);
         opacity: 1;
      }
   }
}
.modal__content {
   opacity: 0;
   transform: scale(0.5);
   transition: 0.2s;

   margin: auto;
   background-color: #fff;
   border-radius: 12px;
   min-height: 50px;
   min-width: 300px;
   padding: 20px;
}
</style>
