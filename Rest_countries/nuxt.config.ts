// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  css: ["~/assets/css/style.css", "~/assets/css/main.css"],
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap",
        },
        {
          rel: "dns-prefetch",
          href: " https://flagcdn.com",
        },
        {
          rel: " preconnect",
          href: "https://flagcdn.com",
          crossorigin: "anonymous",
        },
      ],
    },
  },

  modules: ["@nuxt/icon"],
  routeRules: {
    "/": { prerender: true },
    "/countries/**": { swr: 3600 },
  },
});
