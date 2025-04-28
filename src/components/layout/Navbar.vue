<template>
  <nav class="bg-gray-100 border-b border-gray-300 px-6 py-4 flex flex-row-reverse h-16 font-serif mb-1">
    <div class="flex items-center gap-4">
      <!-- Dropdown ngôn ngữ được cải tiến -->
      <div class="language-selector">
        <Button 
          type="button" 
          @click="toggleLanguageMenu" 
          class="p-button-text p-button-plain"
          :aria-label="$t('language_selector')"
          >
          <!-- v-tooltip.top="$t('language_selector')" -->
          <div class="flex items-center gap-2 ">
            <img 
              :alt="getLanguageName(selectedLanguage)" 
              :src="getLanguageFlag(selectedLanguage)" 
              class="w-6 h-4 rounded-sm"
            />
            <span class="hidden md:inline">{{ getLanguageName(selectedLanguage) }}</span>
            <i class="pi pi-chevron-down text-xs ml-1"></i>
          </div>
        </Button>

        <OverlayPanel 
          ref="languageMenu" 
          :dismissable="true"
          class="language-menu"
          :pt="{
            content: { class: 'p-2' }
          }"
        >
          <div class="flex flex-col gap-1 min-w-[120px] bg-gray-100">
            <Button 
              v-for="lang in languages" 
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="p-button-text p-button-plain w-full justify-start"
              :class="{ 'bg-gray-100': selectedLanguage === lang.code }"
            >
              <div class="flex items-center gap-3 w-full">
                <img 
                  :alt="lang.name" 
                  :src="getLanguageFlag(lang.code)" 
                  class="w-6 h-4 rounded-sm"
                />
                <span>{{ lang.name }}</span>
                <i 
                  v-if="selectedLanguage === lang.code" 
                  class="pi pi-check ml-auto text-primary-500"
                ></i>
              </div>
            </Button>
          </div>
        </OverlayPanel>
      </div>

      <AvatarForm />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import AvatarForm from '../common/AvatarForm.vue';
import { setLanguage } from '../../data/axios';
import Swal from 'sweetalert2';

const { locale, t } = useI18n();

// Danh sách ngôn ngữ hỗ trợ
const languages = ref([
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' }
]);

const selectedLanguage = ref(localStorage.getItem('locale') || 'en');

const languageMenu = ref();

const getLanguageName = (code: string) => {
  return languages.value.find(lang => lang.code === code)?.name || '';
};

const getLanguageFlag = (code: string) => {
  return code === 'vi' 
    ? 'https://flagcdn.com/w20/vn.png' 
    : 'https://flagcdn.com/w20/gb.png';
};

const toggleLanguageMenu = (event: Event) => {
  languageMenu.value.toggle(event);
};

// Thay đổi ngôn ngữ
const changeLanguage = (code: string) => {
  selectedLanguage.value = code;
  locale.value = code;
  setLanguage(code);
  localStorage.setItem('locale', code);
  languageMenu.value.hide();
  Swal.fire({
    icon: 'success',
    title: t('language_selector', { lang: getLanguageName(code) }),
    showConfirmButton: false,
    timer: 1500
  });
};
</script>

<style scoped>
.language-selector {
  position: relative;
}

.language-menu {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* Hiệu ứng hover cho nút ngôn ngữ */
:deep(.p-button.p-button-text.p-button-plain:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .language-selector .language-name {
    display: none;
  }
}
</style>