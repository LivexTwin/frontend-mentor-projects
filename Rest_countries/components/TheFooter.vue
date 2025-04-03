<template>
  <div class="footer">
    <p>
      Challenge by
      <a
        class="a-link"
        href="http://frontendmentor.io"
        target="_blank"
        rel="noopener noreferrer"
        >Frontend Mentor</a
      >
    </p>
    <p>Coded by Live★Twin</p>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.footer {
  font-size: var(--size-xxs);
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  box-shadow: var(--bs);
  background-color: var(--card-bg);
}

.a-link {
  border-bottom: 1px solid var(--clr-secondary-1);
  color: var(--clr-secondary-1);
}

/* mq lg */
@media (min-width: 1440px) {
  .footer {
    font-size: var(--size-sm);
    padding: 1rem 8rem;
  }
}
/*  */
</style>
