<template>
  <div class="navbar_wrapper">
    <header>
      <nav class="navbar">
        <ul>
          <li class="logo">
            <NuxtLink to="/"> <h1>Where in the world?</h1></NuxtLink>
          </li>
          <li>
            <button @click="toggleDark()">
              <!-- Conditionally render the appropriate icon based on dark mode -->
              <Icon
                :name="
                  isDark
                    ? 'material-symbols:dark-mode'
                    : 'material-symbols:dark-mode-outline'
                "
              />
              Dark Mode
            </button>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script setup>
// Props passed from the parent
defineProps({
  isDark: Boolean, // Reactive dark mode state from parent
  toggleDark: Function, // Function to toggle dark mode
});
</script>

<style scoped>
.navbar_wrapper {
  padding: 1.75rem 1rem;
  background: var(--header-bg);
  box-shadow: var(--bs);
}

.navbar ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--size-sm);
}

/* mq lg */
@media (min-width: 1440px) {
  .navbar_wrapper {
    padding: 1.75rem 8rem;
  }

  .logo {
    font-size: var(--size-xl);
  }
}
/*  */
</style>
