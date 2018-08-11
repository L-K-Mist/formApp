import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import FarmForm from "@/views/FarmForm.vue"
import MonthlyReport from "@/views/MonthlyReport.vue"


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "Default",
      component: MonthlyReport
    },
    {
      path: "/farmform",
      name: "FarmForm",
      component: FarmForm
    },
    {
      path: "/monthlyreport",
      name: "MonthlyReport",
      component: MonthlyReport
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
