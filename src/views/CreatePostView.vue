<script setup>
import { ref, watch } from 'vue';
import { useHostStore } from '@/stores/hostStore';

const host = useHostStore().host;
const price = ref('');
const formatNumberWithSpaces = (number) => {
   if (number[0] === '0' && number[1] !== '0') {
      number = number.slice(1);
   }
   return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
watch(price, (value) => {
   price.value = value.replace(/\D/g, '');
   price.value = formatNumberWithSpaces(price.value);
});
/* <!-- TODO: dadata.ru не позволяет отправлять запрос через JS в браузере, 
   TODO: надо сначала отправить запрос на Laravel,
   TODO: с Laravel отправить запрос на dadata.ru, и с Laravel вернуть ответ, 
   TODO: который пришел с dadata.ru

   * dadata.ru запрос сделан, привязать его к инпуту адреса, 
   * после того как пользователь перестал печатать отправить запрос
   * и подумать куда и как его вставить
   
   ! Я сделал стандартизацию адреса, а надо 
   !"Автодополнение при вводе («подсказки»)" (https://dadata.ru/api/#address)
   --> */
const addressSuggestion = ref([]);
const dadata = async (address) => {
   if (address.length <= 5) {
      if (addressSuggestion.value.length > 0) {
         addressSuggestion.value = [];
      }
      return;
   }
   const response = await fetch(`${host}/api/dadata-validate`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: address }),
   });

   // const response = await fetch('https://cleaner.dadata.ru/api/v1/clean/address', {
   //    method: 'POST',
   //    mode: 'cors',
   //    headers: {
   //       'Content-Type': 'application/json',
   //       Authorization: 'Token cdd2ba98360722bdd38297126251ea922db50cb6',
   //       'X-Secret': 'ecc682308c3447cf68c5169bc303eaacb3796dcc',
   //    },
   //    body: JSON.stringify(['асбест чайковского'])
   // });
   console.log(response);
   if (!response.ok) {
      const data = await response?.json();
      if (data?.message) {
         alert('Ошибка: ' + data?.message);
      } else {
         alert('Ошибка: ' + response.status + ' ' + response.statusText);
      }
      return;
   }
   const data = await response?.json();
   if (!data) {
      return;
   }
   console.log(data);
   const value = data?.data;
   const suggestions = value?.suggestions;
   if (!suggestions) {
      return;
   }
   addressSuggestion.value = [];
   let i = 0;
   for (const suggestion of suggestions) {
      addressSuggestion.value.push(suggestion.value);
   }
   // console.log(addressSuggestion.value);
   // addressSuggestion.value = value.suggestions;
};

let addressInputTimeout = null;
const address = ref('');
// watch(address, async (value) => {
//    if (!addressSuggestion.value.find((suggestion) => suggestion === value)) {
//       dadata(value);
//    }
// });
const addressOnInput = (e) => {
   clearTimeout(addressInputTimeout);
   addressInputTimeout = setTimeout(() => {
      const value = e.target.value;
      if (!addressSuggestion.value.find((suggestion) => suggestion === value)) {
         // ===============================
         dadata(value);
         // ===============================
      }
   }, 1000);
};
const setAddress = (value) => {
   address.value = value;
   addressSuggestion.value = [];
};
// const logogo = () => {
//    console.log('asrdsfhg');
//    addressSuggestion = [];
// };
document.addEventListener('click', (e) => {
   const target = e.target;
   if (!target.closest('.field-suggest__list') && !target.closest('.form-add-post__text-input')) {
      addressSuggestion.value = [];
   }
});
const phone = ref('');
watch(phone, (value) => {
   console.log(value);
});

const isDropOver = ref(false);
const fileInputRef = ref(null);
const uploadedFiles = ref([]);
const isDragOver = ref(false);
const handleDragEnter = (e) => {
   e.preventDefault();
   isDropOver.value = true;
};

const handleDragLeave = () => {
   isDropOver.value = false;
};
const processUploadedFiles = (files) => {
   for (const file of files) {
      if (file.type.startsWith('image/')) {
         const reader = new FileReader();
         reader.onload = (e) => {
            uploadedFiles.value.push({ url: e.target.result });
         };
         reader.readAsDataURL(file);
      } else {
         console.log(
            'Попытка загрузить файл типа: ' + file.type + ' (разрешены только изображения)'
         );
      }
   }
};

const handleFileUpload = () => {
   const files = fileInputRef.value.files;
   processUploadedFiles(files);
};

const handleDrop = (e) => {
   e.preventDefault();
   isDropOver.value = false;
   const files = e.dataTransfer.files;
   processUploadedFiles(files);
};

const removeFile = (index) => {
   uploadedFiles.value.splice(index, 1);
};
</script>

<template>
   <div class="add-post">
      <!-- <input v-model="dadataInput" type="text" class="input" />
      <button class="btn" @click="dadata">test dadata.ru</button> -->
      <div class="container add-post__content">
         <div class="breadcrumbs add-post__breadcrumbs">
            <div class="breadcrumbs__list">
               <router-link to="/" class="breadcrumbs__item link">Главная</router-link>
               <span class="breadcrumbs__separator"
                  ><font-awesome-icon icon="chevron-right"
               /></span>
               <span class="breadcrumbs__item">Создать объявление</span>
            </div>
         </div>
         <h2 class="add-post__title title">Создать объявление</h2>
         <div class="add-post__form form-add-post">
            <div class="form-add-post__category">
               <h3 class="form-add-post__category-label">Параметры</h3>
               <div class="form-add-post__category-list">
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Название объявления</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__text">
                           <input
                              type="text"
                              name="title"
                              class="form-add-post__text-input input"
                           />
                        </div>
                     </div>
                  </div>
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Состояние</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__value-radio-btn">
                           <div class="form-add-post__radio radio-btn">
                              <input
                                 checked
                                 type="radio"
                                 name="condition"
                                 id="new"
                                 value="new"
                                 class="form-add-post__radio-input radio-btn__input"
                              />
                              <label for="new" class="form-add-post__radio-label radio-btn__label"
                                 >Новое</label
                              >
                           </div>
                           <div class="form-add-post__radio radio-btn">
                              <input
                                 type="radio"
                                 name="condition"
                                 id="used"
                                 value="used"
                                 class="form-add-post__radio-input radio-btn__input"
                              />
                              <label for="used" class="form-add-post__radio-label radio-btn__label"
                                 >Б/у</label
                              >
                           </div>
                        </div>
                        <!-- <div class="form-add-post__value-checkbox">
                           <div class="form-add-post__checkbox checkbox-btn">
                              <label
                                 for="condition_1"
                                 class="form-add-post__checkbox-label checkbox-btn__label"
                                 >Новое</label
                              >
                              <input
                                 type="checkbox"
                                 name="condition"
                                 id="condition_1"
                                 class="form-add-post__checkbox-input checkbox-btn__input"
                              />
                           </div>
                           <div class="form-add-post__checkbox checkbox-btn">
                              <label
                                 for="condition_2"
                                 class="form-add-post__checkbox-label checkbox-btn__label"
                                 >Б/у</label
                              >
                              <input
                                 type="checkbox"
                                 name="condition"
                                 id="condition_2"
                                 class="form-add-post__checkbox-input checkbox-btn__input"
                              />
                           </div>
                        </div> -->
                     </div>
                  </div>
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Описание объявления</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__value-textarea">
                           <div class="form-add-post__textarea">
                              <textarea
                                 name="description"
                                 class="form-add-post__textarea-input textarea"
                              ></textarea>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Цена</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__text form-add-post__text--price">
                           <font-awesome-icon icon="ruble-sign" />
                           <input
                              v-model="price"
                              maxlength="112"
                              type="text"
                              name="price"
                              class="form-add-post__text-input input"
                           />
                        </div>
                     </div>
                  </div>
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Фотографии</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__files">
                           <input
                              ref="fileInputRef"
                              @change="handleFileUpload"
                              type="file"
                              name="files[]"
                              id="files"
                              multiple
                              accept="image/*"
                              class="form-add-post__files-input input-hidden"
                           />
                           <div class="form-add-post__files-list">
                              <div
                                 v-for="(file, index) in uploadedFiles"
                                 :key="index"
                                 class="form-add-post__files-label load-file load-file--preview"
                              >
                                 <button
                                    type="button"
                                    class="load-file__remove-btn"
                                    @click="removeFile(index)"
                                 >
                                    <font-awesome-icon icon="xmark" />
                                 </button>
                                 <img :src="file.url" alt="" />
                              </div>
                              <!-- <div class="form-add-post__files-label load-file load-file--preview">
                                 <button type="button" class="load-file__remove-btn">
                                    <font-awesome-icon icon="xmark" />
                                 </button>
                                 <img src="../assets/post-img.jpg" alt="" />
                              </div> -->
                              <label for="files" class="form-add-post__files-label load-file">
                                 <font-awesome-icon icon="plus" />
                              </label>
                           </div>
                           <label
                              :class="{ over: isDropOver }"
                              @dragstart.prevent="console.log('dragstart')"
                              @dragover.prevent="console.log('dragover')"
                              @dragenter.prevent="handleDragEnter"
                              @dragleave="handleDragLeave"
                              @drop="handleDrop"
                              class="form-add-post__files-drop"
                              for="files"
                           >
                              <span class="form-add-post__files-drop-text"
                                 >Перенесите сюда фотографии для загрузки</span
                              >
                           </label>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="form-add-post__category">
               <h3 class="form-add-post__category-label">Место сделки</h3>
               <div class="form-add-post__category-list">
                  <div class="form-add-post__field">
                     <div class="form-add-post__value">
                        <div class="form-add-post__text form-add-post__text--address">
                           <input
                              @input="addressOnInput"
                              v-model="address"
                              type="text"
                              name="address"
                              class="form-add-post__text-input input"
                              placeholder="Начните вводить адрес"
                              autocomplete="off"
                           />

                           <div
                              v-show="addressSuggestion.length"
                              class="form-add-post__text-suggest field-suggest"
                           >
                              <div class="field-suggest__list">
                                 <button
                                    v-for="(suggestion, index) in addressSuggestion"
                                    :key="index"
                                    @click="setAddress(suggestion)"
                                    type="button"
                                    class="field-suggest__item"
                                 >
                                    {{ suggestion }}
                                 </button>
                              </div>
                           </div>
                           <!-- <div class="form-add-post__text-suggest field-suggest">
                              <div class="field-suggest__list">
                                 <button @click="setAddress('г. Асбест, ул. Чайковского, д. 14')" type="button" class="field-suggest__item">
                                    г. Асбест, ул. Чайковского, д. 14
                                 </button>
                                 <button type="button" class="field-suggest__item">
                                    Свердловская обл, пгт Малышева, тер промплощадка восточная
                                    часть, д 2
                                 </button>
                                 <button type="button" class="field-suggest__item">
                                    Свердловская обл, г Алапаевск, поселок Асбестовский
                                 </button>
                                 <button type="button" class="field-suggest__item">
                                    г. Асбест, ул. Чайковского, д. 14
                                 </button>
                                 <button type="button" class="field-suggest__item">
                                    Свердловская обл, пгт Малышева, тер промплощадка восточная
                                    часть, д 2
                                 </button>
                                 <button type="button" class="field-suggest__item">
                                    Свердловская обл, г Алапаевск, поселок Асбестовский
                                 </button>
                                 <button type="button" class="field-suggest__item">
                                    г. Асбест, ул. Чайковского, д. 14
                                 </button>
                                 <button type="button" class="field-suggest__item">
                                    Свердловская обл, пгт Малышева, тер промплощадка восточная
                                    часть, д 2
                                 </button>
                                 <button type="button" class="field-suggest__item">
                                    Свердловская обл, г Алапаевск, поселок Асбестовский
                                 </button>
                              </div>
                           </div> -->
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="form-add-post__category">
               <h3 class="form-add-post__category-label">Контакты</h3>
               <div class="form-add-post__category-list">
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Телефон</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__text">
                           <input
                              v-mask="'+7 (###) ###-##-##'"
                              placeholder="+7 (___) ___-__-__"
                              v-model="phone"
                              type="text"
                              name="title"
                              class="form-add-post__text-input input"
                           />
                        </div>
                     </div>
                  </div>
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Способ связи</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__value-radio">
                           <div class="form-add-post__radio radio">
                              <input
                                 checked
                                 type="radio"
                                 name="connect_type"
                                 id="calls_messages"
                                 value="calls_messages"
                                 class="form-add-post__radio-input radio__input"
                              />
                              <label
                                 for="calls_messages"
                                 class="form-add-post__radio-label radio__label"
                                 >Звонки и сообщения</label
                              >
                           </div>
                           <div class="form-add-post__radio radio">
                              <input
                                 type="radio"
                                 name="connect_type"
                                 id="calls"
                                 value="calls"
                                 class="form-add-post__radio-input radio__input"
                              />
                              <label for="calls" class="form-add-post__radio-label radio__label"
                                 >Только звонки</label
                              >
                           </div>
                           <div class="form-add-post__radio radio">
                              <input
                                 type="radio"
                                 name="connect_type"
                                 id="messages"
                                 value="messages"
                                 class="form-add-post__radio-input radio__input"
                              />
                              <label for="messages" class="form-add-post__radio-label radio__label"
                                 >Только сообщения</label
                              >
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="form-add-post__btns">
               <button type="button" class="form-add-post__btn btn btn--dark">Создать</button>
               <button type="button" class="form-add-post__btn btn">Сохранить в черновик</button>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.add-post {
   flex-grow: 1;
   // .add-post__content
   &__content {
      max-width: 900px;
   }
   // add-post__title
   &__title {
      margin-bottom: 30px;
   }
   // .add-post__breadcrumbs
   &__breadcrumbs {
   }
   // .add-post__form
   &__form {
   }
}
.form-add-post {
   // .form-add-post__category
   &__category {
   }
   // .form-add-post__category-label
   &__category-label {
      font-size: 24px;
      margin-bottom: 15px;
   }
   // .form-add-post__category-list
   &__category-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 70px;
   }
   // .form-add-post__field
   &__field {
      display: flex;
   }
   // .form-add-post__label
   &__label {
      flex-shrink: 0;
      color: var(--dark-grey-color);
      width: 25%;
      padding-top: 16px;
   }
   // .form-add-post__value
   &__value {
      flex-grow: 1;
   }
   // .form-add-post__text
   &__text {
      position: relative;
      &--address {
         z-index: 3;
         input {
            position: relative;
            z-index: 2;
         }
      }
      // .form-add-post__text--price
      &--price {
         position: relative;
         svg {
            position: absolute;
            top: calc(50% - 0.5em);
            left: 10px;
         }
         input {
            padding-left: 30px;
            font-weight: 600;
            font-size: 18px;
         }
      }
   }
   // .form-add-post__text-suggest
   &__text-suggest {
      z-index: 1;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      transition: 0.2s;
      animation: opacity 0.1s ease;
      padding-bottom: 70px;
      // &.with-animation {
      //    transition: .3s;
      // }
   }
   @keyframes opacity {
      0% {
         // opacity: 0;
         transform: translateY(-30px);
      }
      100% {
         // opacity: 1;
         transform: translateY(0);
      }
   }
   // .form-add-post__text-input
   &__text-input {
   }
   // .form-add-post__value-checkbox
   &__value-checkbox {
   }
   // .form-add-post__checkbox
   &__checkbox {
   }
   // .form-add-post__checkbox-label
   &__checkbox-label {
   }
   // .form-add-post__checkbox-input
   &__checkbox-input {
   }
   // .form-add-post__value-textarea
   &__value-textarea {
   }
   // .form-add-post__textarea
   &__textarea {
   }
   // .form-add-post__textarea-input
   &__textarea-input {
      min-height: 150px;
   }
   // .form-add-post__files
   &__files {
   }
   // .form-add-post__files-input
   &__files-input {
   }
   // .form-add-post__files-list
   &__files-list {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
   }
   // .form-add-post__files-label
   &__files-label {
      width: 200px;
      height: 150px;
      overflow: hidden;
   }
   // .form-add-post__files-drop
   &__files-drop {
      transition: 0.15s;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 200px;
      border: 2px dashed var(--accent-color);
      padding: 20px;
      &.over, &:hover {
         background-color: var(--accent-color-light);
      }
   }
   // .form-add-post__files-drop-text
   &__files-drop-text {
      pointer-events: none;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
   }
   // .form-add-post__value-radio-btn
   &__value-radio-btn {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
   }
   // .form-add-post__value-radio
   &__value-radio {
      display: flex;
      flex-direction: column;
      gap: 15px;
   }
   // .form-add-post__radio
   &__radio {
   }
   // .form-add-post__radio-label
   &__radio-label {
   }
   // .form-add-post__radio-input
   &__radio-input {
   }
   // .form-add-post__btns
   &__btns {
      display: flex;
      gap: 20px;
      justify-content: center;
      font-size: 18px;
      margin-bottom: 50px;
   }
   // .form-add-post__btn
   &__btn {
   }
}
.field-suggest {
   // .field-suggest__list
   &__list {
      background-color: #fff;
      border: 1px solid #999;
      border-radius: 5px;
      box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
   }
   // .field-suggest__item
   &__item {
      padding: 10px;
      transition: 0.1s;
      font-weight: 500;
      text-align: left;
      &:hover {
         background-color: #ddd;
      }
      &:not(:last-child) {
         border-bottom: 1px solid #999;
         // padding-bottom: 5px;
         // margin-bottom: 10px;
      }
   }
}
.input {
}
.checkbox-btn {
   // .checkbox-btn__label
   &__label {
   }
   // .checkbox-btn__input
   &__input {
   }
}
.textarea {
}
.input-hidden {
}
.load-file {
   &:not(.load-file--preview) {
      background-color: #c9c9c9;
      svg {
         font-size: 40px;
      }
      &:hover {
         background-color: #b9b9b9;
      }
   }
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 5px;
   font-size: 24px;
   transition: 0.2s;

   // .load-file--preview
   &--preview {
      border: 1px solid #999;
      position: relative;
      &::before {
         transition: 0.2s;
         opacity: 0;
         content: '';
         position: absolute;
         top: 0;
         right: 0;
         bottom: 0;
         left: 0;
         background-color: rgba(0, 0, 0, 0.6);
      }
      &:hover {
         &::before {
            opacity: 1;
         }
         .load-file__remove-btn {
            opacity: 1;
            pointer-events: all;
         }
      }
      img {
         width: 100%;
         height: 100%;
         object-fit: contain;
      }
   }
   // .load-file__remove-btn
   &__remove-btn {
      opacity: 0;
      pointer-events: none;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--red-color);
      font-size: 46px;
      line-height: 1;
      transition: 0.2s;
      &:hover {
         transform: translate(-50%, -50%) scale(1.2);
      }
   }
}
.radio-btn {
   // .radio-btn__label
   &__label {
      display: inline-block;
      padding: 15px 20px;
      border-radius: 5px;
      border: 1px solid #555;
      transition: 0.2s;
      &:hover {
         background-color: #ccc;
      }
      .radio-btn__input:checked + & {
         background-color: #ddd;
         background-color: var(--orange-color);
         background-color: #8cb658;
         background-color: var(--accent-color);
         background-color: #464646;
         // background-color: var(--green-color);
         color: #fff;
         font-weight: 600;
      }
   }
   // .radio-btn__input
   &__input {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
   }
}
.radio {
   // .radio__label
   &__label {
   }
   // .radio__input
   &__input {
   }
}
.btn {
   // .btn--dark
   &--dark {
   }
}
</style>
