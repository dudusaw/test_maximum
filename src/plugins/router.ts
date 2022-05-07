import { createRouter, createWebHistory } from "vue-router";
import TheForm from "../components/TheForm.vue";
import SuccessPage from "../components/SuccessPage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: TheForm
    },
    {
      path: "/success",
      component: SuccessPage
    }
  ]
});