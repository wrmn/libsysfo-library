<script>
  import { onMount } from "svelte";
  import { getDevice } from "framework7/lite-bundle";
  import {
    f7,
    f7ready,
    App,
    Views,
    View,
    Toolbar,
    Link,
  } from "framework7-svelte";
  import { darkTheme } from "../js/store";
  import { checkLogin, getData } from "../js/api/profile";

  import cordovaApp from "../js/cordova-app";

  import LeftPanel from "./mainComponent/leftPanel.svelte";
  import RightPanel from "./mainComponent/rightPanel.svelte";
  import LoginPage from "./mainComponent/login.svelte";

  import routes from "../js/routes";
  import store from "../js/store";

  const device = getDevice();
  // Framework7 Parameters
  let f7params = {
    name: "Libsysfo Library", // App name
    theme: "auto", // Automatic theme detection

    id: "io.framework7.libsysfolibrary", // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes,
    // Register service worker (only on production build)
    serviceWorker:
      process.env.NODE_ENV === "production"
        ? {
            path: "/service-worker.js",
          }
        : {},

    // Input settings
    input: {
      scrollIntoViewOnFocus: device.cordova && !device.electron,
      scrollIntoViewCentered: device.cordova && !device.electron,
    },
    // Cordova Statusbar settings
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };
  // Login screen demo data
  onMount(() => {
    checkLogin();
    if (localStorage.getItem("account-credential")) {
      getData();
    }
    f7ready(() => {
      // Init cordova APIs (see cordova-app.js)
      if (f7.device.cordova) {
        cordovaApp.init(f7);
      }

      // Call F7 APIs here
    });

    if (localStorage.getItem("theme") === "dark") {
      darkTheme.set(true);
    }
  });
</script>

<svelte:head>
  <script>
    try {
      const { matches: isDarkMode } = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      const theme = localStorage.getItem("theme");
      const opposite = theme === "dark" ? "light" : "dark";
      document.documentElement.classList.add(theme);
      document.documentElement.classList.remove(opposite);
    } catch (err) {
      console.error(err);
    }
  </script>
</svelte:head>

<App {...f7params}>
  <!-- Left panel with cover effect-->
  <LeftPanel />
  <RightPanel />
  <LoginPage />

  <!-- Views/Tabs container -->
  <Views tabs class="safe-areas">
    <!-- Tabbar for switching views-tabs -->
    <Toolbar tabbar labels bottom>
      <Link
        tabLink="#view-dashboard"
        tabLinkActive
        iconF7="chart_bar_square"
        text="Home"
      />
      <Link tabLink="#view-book" iconF7="book" text="Book" />
      <Link tabLink="#view-paper" iconF7="doc_on_doc" text="Paper" />
      <Link
        tabLink="#view-report"
        iconF7="building_columns_fill"
        text="Report"
      />
      <Link
        tabLink="#view-library"
        iconF7="building_columns_fill"
        text="Library"
      />
    </Toolbar>

    <View id="view-dashboard" main tab tabActive url="/" />
    <View id="view-book" name="books" tab url="/book/" />
    <View id="view-paper" name="papers" tab url="/paper/" />
    <View id="view-report" name="reports" tab url="/report/" />
    <View id="view-library" name="library" tab url="/library/" />
  </Views>
</App>
