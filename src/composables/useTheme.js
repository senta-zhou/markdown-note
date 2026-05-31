import { ref, watchEffect } from "vue";

const THEME_KEY = "markdown-theme";
const theme = ref(localStorage.getItem(THEME_KEY) || "light");

watchEffect(() => {
  document.documentElement.classList.toggle("dark", theme.value === "dark");
  localStorage.setItem(THEME_KEY, theme.value);
});

export function useTheme() {
  function toggle() {
    theme.value = theme.value === "light" ? "dark" : "light";
  }
  return { theme, toggle };
}
