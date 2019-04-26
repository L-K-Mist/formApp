<template>
  <v-app  dark>
    <v-navigation-drawer  class="not-print"
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      light
      app
    >
      <v-list>
        <v-divider light></v-divider>
        <h3>Go To</h3>
        <v-list-tile
        ripple
          value="true"
          v-for="(item) in items"
          :key="item.title"
          @click.stop="$router.push({
        path: item.path
    })"        
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar  class="not-print"
      app
      scrollOffScreen
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view transition="slide-x-reverse-transition"/>
    </v-content>
    <v-footer class="not-print" :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "list_alt",
          title: "Monthly Narrative Report",
          path: "/"
        },
        {
          icon: "photo",
          title: "Mentor-Visit Pictures",
          path: "/pics"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Paula's Getting it DONE App"
    };
  }
};
</script>
