import { defineStore } from "pinia";
import { ref, computed } from "vue";

const THEME_KEY = "markdown-theme";

export const useThemeStore = defineStore("theme", () => {
  const stored = localStorage.getItem(THEME_KEY);
  const theme = ref(stored === "dark" || stored === "light" ? stored : "light");

  const isDark = computed(() => theme.value === "dark");
  const isLight = computed(() => theme.value === "light");

  function apply() {
    document.documentElement.classList.toggle("dark", isDark.value);
    localStorage.setItem(THEME_KEY, theme.value);
  }

  function toggle() {
    theme.value = isDark.value ? "light" : "dark";
    apply();
  }

  function setTheme(mode) {
    if (mode === "dark" || mode === "light") {
      theme.value = mode;
      apply();
    }
  }

  // Apply on init
  apply();

  return { theme, isDark, isLight, toggle, setTheme };
});
