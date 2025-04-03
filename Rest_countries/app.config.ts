export default defineAppConfig({
  nuxtApp: {
    scrollBehavior(to: any, from: any, savedPosition: any) {
      // Check if a saved position exists (such as when navigating back)
      if (savedPosition) {
        return savedPosition;
      } else {
        // Only scroll to top if the route has changed
        return { left: 0, top: 0 };
      }
    },
  },
});
