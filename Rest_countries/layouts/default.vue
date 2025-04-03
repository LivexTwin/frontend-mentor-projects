<template>
  <TheNav :isDark="isDark" :toggleDark="toggleDark" />
  <div :class="['wrapper', { dark: isDark }]">
    <slot />
  </div>
  <footer>
    <TheFooter />
  </footer>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";

// Automatically synchronize dark mode with the system preference or localStorage
const isDark = useDark({
  storageKey: "darkMode", // Key to store the dark mode state in localStorage
  valueDark: "dark", // Class to apply when dark mode is active
  valueLight: "light", // (Optional) Class for light mode
});

// Toggle function to switch dark mode on/off
const toggleDark = useToggle(isDark);

onMounted(() => {
  if (process.client && window) {
    window.history.scrollRestoration = "auto";
  }
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100vh;
  min-height: 100svh;

  padding: env(safe-area-inset);
}

/* mq lg  */
@media (min-width: 1440px) {
  .wrapper {
    padding: 4rem 8rem;
  }
}
/*  */
</style>
