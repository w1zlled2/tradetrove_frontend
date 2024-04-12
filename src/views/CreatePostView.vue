<script setup>
import { ref, watch, computed } from 'vue';
import { useHostStore } from '@/stores/hostStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import MyModal from '@/components/MyModal.vue';

const router = useRouter();
const host = useHostStore().host;
const auth = useAuthStore();

const fieldErrors = ref({}); // address, category_id, description, price, title

const title = ref('');
const condition = ref('new'); // new/used
const description = ref('');
const phone = ref('');
const connectType = ref('calls_messages'); // calls_messages/messages/calls
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
const priceClear = computed(() => {
   return price.value.replace(/\s/g, '');
});
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

const isDropOver = ref(false);
const fileInputRef = ref(null);
const uploadedFilesUrls = ref([]);
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
            uploadedFilesUrls.value.push({ url: e.target.result });
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
   uploadedFiles.value = [...uploadedFiles.value, ...files];
   console.log(uploadedFiles.value);
};

const handleDrop = (e) => {
   e.preventDefault();
   isDropOver.value = false;
   const files = e.dataTransfer.files;
   processUploadedFiles(files);
   uploadedFiles.value = [...uploadedFiles.value, ...files];
   console.log(uploadedFiles.value);
};

const removeFile = (index) => {
   uploadedFilesUrls.value.splice(index, 1);
};

const category = ref('');
const categoriesList = ref([]);
const categoriesTree = ref([]);
const isCategoriesLoading = ref(false);
const isCategoryModalShow = ref(false);
const selectedMainCategory = ref({});
const categoryPath = ref('');
const loadCategories = async () => {
   isCategoriesLoading.value = true;
   const response = await fetch(`${host}/api/category`);
   const data = await response?.json();
   isCategoriesLoading.value = false;
   if (!response.ok) {
      if (!data) {
         alert('Ошибка загрузки категорий');
      }
   }
   if (data) {
      if (data.success) {
         categoriesTree.value = buildCategoryTree(data.data);
         selectedMainCategory.value = categoriesTree.value[0];
         categoriesList.value = data.data;
      } else {
         alert('Ошибка загрузки категорий. ' + data?.message);
      }
   }
};
function buildCategoryTree(categories) {
   const categoryMap = new Map();
   const categoryTree = [];

   categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
   });

   categories.forEach((category) => {
      const { id, parent_category_id } = category;
      const currentCategory = categoryMap.get(id);
      if (parent_category_id === null) {
         categoryTree.push(currentCategory);
      } else {
         const parentCategory = categoryMap.get(parent_category_id);
         if (parentCategory) {
            parentCategory.children.push(currentCategory);
         }
      }
   });

   return categoryTree;
}
const handleClickSelectCategory = () => {
   isCategoryModalShow.value = true;
   if (categoriesTree.value.length === 0) {
      loadCategories();
   }
};
const getCategoryPath = (category) => {
   let path = category.name;
   let parentCategory = category;
   while (parentCategory.parent_category_id !== null) {
      parentCategory = categoriesList.value.find(
         (cat) => cat.id === parentCategory.parent_category_id
      );
      path = `${parentCategory.name} > ${path}`;
   }
   return path;
};
const selectCategory = (selectedCategory) => {
   isCategoryModalShow.value = false;
   category.value = selectedCategory;
   // console.log(category.value);
   categoryPath.value = getCategoryPath(selectedCategory);
   console.log(categoryPath);
};

const validateFields = () => {
   if (!category.value) {
      fieldErrors.value.category_id = ['Выберите категорию'];
   }
   if (!title.value) {
      fieldErrors.value.title = ['Заполните заголовок'];
   }
   if (!description.value) {
      fieldErrors.value.description = ['Заполните описание'];
   }
   if (!address.value) {
      fieldErrors.value.address = ['Заполните адрес'];
   }
   if ((connectType.value == 'calls_messages' || connectType.value == 'calls') && !phone.value) {
      fieldErrors.value.phone = ['Введите номер телефон'];
   }
   if (fieldErrors.value && Object.keys(fieldErrors.value).length > 0) {
      return false;
   }
   return true;
};
const sendCreatePostForm = async (isDraft = false) => {
   const formData = new FormData();
   for (const file of uploadedFiles.value) {
      formData.append('files[]', file);
   }
   formData.append('category_id', category.value.id);
   formData.append('title', title.value);
   formData.append('condition', condition.value);
   formData.append('description', description.value);
   formData.append('price', priceClear.value);
   formData.append('address', address.value);
   formData.append('phone', phone.value);
   formData.append('connect_type', connectType.value);
   isDraft ? formData.append('status_id', 3) : formData.append('status_id', 2);

   const response = await fetch(`${host}/api/post`, {
      method: 'POST',
      headers: {
         // 'Content-Type': 'application/json',
         Authorization: `Bearer ${auth.getToken}`,
      },
      body: formData,
   });
   const data = await response?.json();
   if (!response.ok) {
      if (data?.message) {
      }
      if (data?.errors) {
         fieldErrors.value = data.errors;
      }
   }
   if (data) {
      if (data.success) {
         if (isDraft) {
            isPostDraftCreatedModalShow.value = true;
         } else {
            isPostCreatedModalShow.value = true;
         }
      }
      console.log(data);
   }
};
const isPostCreatedModalShow = ref(false);
const createPost = async () => {
   const token = auth.getToken;
   if (!token) {
      return;
   }
   fieldErrors.value = {};
   if (validateFields()) {
      sendCreatePostForm();
   }

   // const fieldErrors = ref({}); // address, category_id, description, title, phone
   // if (!category.value) {
   //    fieldErrors.value.category_id = ['Выберите категорию'];
   // }
   // if (!title.value) {
   //    fieldErrors.value.title = ['Заполните заголовок'];
   // }
   // if (!description.value) {
   //    fieldErrors.value.description = ['Заполните описание'];
   // }
   // if (!address.value) {
   //    fieldErrors.value.address = ['Заполните адрес'];
   // }
   // if ((connectType.value == 'calls_messages' || connectType.value == 'calls') && !phone.value) {
   //    fieldErrors.value.phone = ['Введите номер телефон'];
   // }
   // if (fieldErrors.value && Object.keys(fieldErrors.value).length > 0) {
   //    return;
   // }
   // const formData = new FormData();
   // for (const file of uploadedFiles.value) {
   //    formData.append('files[]', file);
   // }
   // formData.append('category_id', category.value.id);
   // formData.append('title', title.value);
   // formData.append('condition', condition.value);
   // formData.append('description', description.value);
   // formData.append('price', priceClear.value);
   // formData.append('address', address.value);
   // formData.append('phone', phone.value);
   // formData.append('connect_type', connectType.value);

   // const response = await fetch(`${host}/api/post`, {
   //    method: 'POST',
   //    headers: {
   //       // 'Content-Type': 'application/json',
   //       Authorization: `Bearer ${auth.getToken}`,
   //    },
   //    body: formData,
   // });
   // const data = await response?.json();
   // if (!response.ok) {
   //    if (data?.message) {
   //    }
   //    if (data?.errors) {
   //       fieldErrors.value = data.errors;
   //    }
   // }
   // if (data) {
   //    if (data.success) {
   //       isPostCreatedModalShow.value = true;
   //    }
   //    console.log(data);
   // }
};

const createDraftPost = () => {
   const token = auth.getToken;
   if (!token) {
      return;
   }
   fieldErrors.value = {};
   if (validateFields()) {
      sendCreatePostForm(true);
   }
};

const closePostCreatedModal = (isPostDraftCreatedModalShowObj) => {
   console.log(isPostDraftCreatedModalShowObj);
   isPostDraftCreatedModalShowObj.value = false;
   router.push('/');
};

const isPostDraftCreatedModalShow = ref(false);
</script>

<template>
   <MyModal v-model:show="isPostDraftCreatedModalShow">
      <div class="success-modal content-modal">
         <header class="success-modal__header content-modal__header">
            <h2 class="success-modal__title content-modal__title">Черновик сохранен</h2>
            <button
               class="success-modal__close content-modal__close"
               @click="closePostCreatedModal(isPostDraftCreatedModalShow)"
               type="button"
            >
               <font-awesome-icon icon="xmark" />
            </button>
         </header>
         <div class="success-modal__content">
            <div class="success-modal__icon">
               <font-awesome-icon icon="check" class="success-modal__icon-svg" />
            </div>
            <div class="success-modal__text">
               <div class="success-modal__text-title">Объявление сохранено в черновики</div>
               <div class="success-modal__text-subtitle">
                  Вы можете продолжить заполнение объявления в личном кабинете
               </div>
            </div>
            <p class="success-modal__text"></p>
         </div>
         <footer class="success-modal__footer">
            <button class="btn btn--accent" @click="closePostCreatedModal">ОК</button>
         </footer>
      </div>
   </MyModal>
   <MyModal v-model:show="isPostCreatedModalShow">
      <div class="success-modal content-modal">
         <header class="success-modal__header content-modal__header">
            <h2 class="success-modal__title content-modal__title">Объявление создано</h2>
            <button
               class="success-modal__close content-modal__close"
               @click="closePostCreatedModal(isPostCreatedModalShow)"
               type="button"
            >
               <font-awesome-icon icon="xmark" />
            </button>
         </header>
         <div class="success-modal__content">
            <div class="success-modal__icon">
               <font-awesome-icon icon="check" class="success-modal__icon-svg" />
            </div>
            <div class="success-modal__text">
               <div class="success-modal__text-title">
                  Объявление успешно создано и отправлено на модерацию!
               </div>
               <div class="success-modal__text-subtitle">
                  После проверки модератором ваше объявление увидят другие пользователи
               </div>
            </div>
            <p class="success-modal__text"></p>
         </div>
         <footer class="success-modal__footer">
            <button class="btn btn--accent" @click="closePostCreatedModal">ОК</button>
         </footer>
      </div>
   </MyModal>
   <MyModal v-model:show="isCategoryModalShow">
      <div class="category-modal content-modal">
         <header class="category-modal__header content-modal__header">
            <h2 class="category-modal__title content-modal__title">Выбор категории</h2>
            <button
               class="category-modal__close content-modal__close"
               @click="isCategoryModalShow = false"
               type="button"
            >
               <font-awesome-icon icon="xmark" />
            </button>
         </header>
         <!-- categoriesList -->
         <div :class="{ center: isCategoriesLoading }" class="category-modal__content">
            <div v-if="isCategoriesLoading" class="loader category-modal__loader"></div>
            <div v-else class="category-modal__row">
               <div class="category-modal__main-col main-category">
                  <div class="main-category__list">
                     <button
                        :class="{
                           'main-category__item--active':
                              selectedMainCategory.id == mainCategory.id,
                        }"
                        v-for="mainCategory in categoriesTree"
                        @click="selectedMainCategory = mainCategory"
                        class="main-category__item"
                     >
                        {{ mainCategory.name }}
                     </button>
                     <!-- <div class="main-category__item">Имя категории</div>
                     <div class="main-category__item">Имя категории</div>
                     <div class="main-category__item">Имя категории</div>
                     <div class="main-category__item">Имя категории</div> -->
                  </div>
               </div>
               <div class="category-modal__second-col second-category">
                  <div class="second-category__list">
                     <div
                        v-for="secondCategory in selectedMainCategory.children"
                        class="second-category__item item-second-category"
                     >
                        <button
                           @click="selectCategory(secondCategory)"
                           class="item-second-category__title"
                        >
                           {{ secondCategory.name }}
                        </button>
                        <div
                           v-if="secondCategory.children.length"
                           class="item-second-category__list"
                        >
                           <button
                              v-for="thirdCategory in secondCategory.children"
                              @click="selectCategory(thirdCategory)"
                              class="item-second-category__item link"
                           >
                              {{ thirdCategory.name }}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </MyModal>
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
               <h3 class="form-add-post__category-label">Категория</h3>
               <div class="form-add-post__category-list">
                  <div class="form-add-post__field">
                     <div class="form-add-post__value">
                        <div class="form-add-post__text">
                           <button
                              class="btn form-add-post__text-select-category"
                              @click="handleClickSelectCategory"
                           >
                              Выбрать категорию
                           </button>
                           <input
                              :value="categoryPath"
                              :class="{ invalid: fieldErrors.category_id }"
                              disabled
                              placeholder="Категория"
                              type="text"
                              name="title"
                              class="form-add-post__text-input input"
                           />
                        </div>
                     </div>
                  </div>
               </div>
               <div v-if="fieldErrors.category_id" class="form-add-post__category-errors">
                  <div
                     v-for="error in fieldErrors.category_id"
                     class="form-add-post__category-error color-red"
                  >
                     {{ error }}
                  </div>
               </div>
            </div>
            <div class="form-add-post__category">
               <h3 class="form-add-post__category-label">Параметры</h3>
               <div class="form-add-post__category-list">
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Название объявления</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__text">
                           <input
                              v-model.trim="title"
                              :class="{ invalid: fieldErrors.title }"
                              type="text"
                              name="title"
                              class="form-add-post__text-input input"
                           />
                        </div>
                        <div v-if="fieldErrors.title" class="form-add-post__text-errors">
                           <div
                              v-for="error in fieldErrors.title"
                              class="form-add-post__text-error color-red"
                           >
                              {{ error }}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Состояние</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__value-radio-btn">
                           <div class="form-add-post__radio radio-btn">
                              <input
                                 v-model="condition"
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
                                 v-model="condition"
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
                                 v-model.trim="description"
                                 :class="{ invalid: fieldErrors.description }"
                                 name="description"
                                 class="form-add-post__textarea-input textarea"
                              ></textarea>
                           </div>
                           <div v-if="fieldErrors.description" class="form-add-post__text-errors">
                              <div
                                 v-for="error in fieldErrors.description"
                                 class="form-add-post__text-error color-red"
                              >
                                 {{ error }}
                              </div>
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
                              accept="image/jpeg, image/jpg, image/png, image/jfif"
                              class="form-add-post__files-input input-hidden"
                           />
                           <div class="form-add-post__files-list">
                              <div
                                 v-for="(file, index) in uploadedFilesUrls"
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
                              :class="{ invalid: fieldErrors.address }"
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
                        </div>
                     </div>
                  </div>
               </div>
               <div v-if="fieldErrors.address" class="form-add-post__text-errors">
                  <div
                     v-for="error in fieldErrors.address"
                     class="form-add-post__text-error color-red"
                  >
                     {{ error }}
                  </div>
               </div>
            </div>
            <div class="form-add-post__category">
               <h3 class="form-add-post__category-label">Контакты</h3>
               <div class="form-add-post__category-list">
                  <div class="form-add-post__field">
                     <div class="form-add-post__label">Способ связи</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__value-radio">
                           <div class="form-add-post__radio radio">
                              <input
                                 v-model="connectType"
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
                                 v-model="connectType"
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
                                 v-model="connectType"
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

                  <!-- v-if="connectType === 'calls_messages' || connectType === 'calls'" -->
                  <div
                     :class="{
                        active: connectType === 'calls_messages' || connectType === 'calls',
                     }"
                     class="form-add-post__field form-add-post__field--phone"
                  >
                     <div class="form-add-post__label">Телефон</div>
                     <div class="form-add-post__value">
                        <div class="form-add-post__text">
                           <input
                              v-mask="'+7 (###) ###-##-##'"
                              placeholder="+7 (___) ___-__-__"
                              :class="{ invalid: fieldErrors.phone }"
                              v-model="phone"
                              type="text"
                              name="title"
                              class="form-add-post__text-input input"
                           />
                        </div>
                        <div
                           v-if="
                              (connectType === 'calls_messages' || connectType === 'calls') &&
                              fieldErrors.phone
                           "
                           class="form-add-post__text-errors"
                        >
                           <div
                              v-for="error in fieldErrors.phone"
                              class="form-add-post__text-error color-red"
                           >
                              {{ error }}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="form-add-post__btns">
               <button @click="createPost" type="button" class="form-add-post__btn btn btn--dark">
                  Создать
               </button>
               <button @click="createDraftPost" type="button" class="form-add-post__btn btn">
                  Сохранить в черновик
               </button>
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
      &:not(:last-child) {
         margin-bottom: 70px;
      }
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
   }
   // .form-add-post__category-errors
   &__category-errors {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
   }
   // .form-add-post__category-error
   &__category-error {
      text-align: center;
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
   // .form-add-post__text-errors
   &__text-errors {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
   }
   // .form-add-post__text-error
   &__text-error {
      text-align: center;
   }
   // .form-add-post__text-select-category
   &__text-select-category {
      margin-bottom: 15px;
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
      border-radius: 5px;
      padding: 20px;
      &.over,
      &:hover {
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
      flex-wrap: wrap;
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
