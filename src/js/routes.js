import HomePage from "../pages/home.svelte";

import BookPage from "../pages/books/index.svelte";
import BookListPage from "../pages/books/list.svelte";
import BookDetailPage from "../pages/books/detail.svelte";
import BookAddPage from "../pages/books/add.svelte";

import BorrowPage from "../pages/books/borrow/index.svelte";
import BorrowActionPage from "../pages/books/borrow/action.svelte";
import BorrowUserPage from "../pages/books/borrow/user.svelte";

import PaperPage from "../pages/papers/index.svelte";
import PaperListPage from "../pages/papers/list.svelte";
import PaperDetailPage from "../pages/papers/detail.svelte";
import PaperAddPage from "../pages/papers/add.svelte";

import PermissionPage from "../pages/papers/permission/index.svelte";
import PermissionActionPage from "../pages/papers/permission/action.svelte";
import PermissionUserPage from "../pages/papers/permission/user.svelte";

import LibraryPage from "../pages/library/index.svelte";

import SettingPage from "../pages/settings/settings.svelte";

import DynamicRoutePage from "../pages/dynamic-route.svelte";
import RequestAndLoad from "../pages/request-and-load.svelte";
import NotFoundPage from "../pages/404.svelte";

var routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/book/",
    component: BookPage,
    routes: [
      {
        path: "list/",
        component: BookListPage,
      },
      {
        path: "detail/:id/",
        component: BookDetailPage,
      },
      {
        path: "add/",
        component: BookAddPage,
      },
      {
        path: "borrow/",
        component: BorrowPage,
        routes: [
          {
            path: "action/",
            component: BorrowActionPage,
          },
          {
            path: "user/",
            component: BorrowUserPage,
          },
        ],
      },
    ],
  },
  {
    path: "/paper/",
    component: PaperPage,
    routes: [
      {
        path: "list/",
        component: PaperListPage,
      },
      {
        path: "detail/:id",
        component: PaperDetailPage,
      },
      {
        path: "add/",
        component: PaperAddPage,
      },
      {
        path: "permission/",
        component: PermissionPage,
        routes: [
          {
            path: "action/",
            component: PermissionActionPage,
          },
          {
            path: "user/",
            component: PermissionUserPage,
          },
        ],
      },
    ],
  },
  {
    path: "/library/",
    component: LibraryPage,
  },
  {
    path: "/settings/",
    component: SettingPage,
  },
  {
    path: "/dynamic-route/blog/:blogId/post/:postId/",
    component: DynamicRoutePage,
  },
  {
    path: "/request-and-load/user/:userId/",
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: "Vladimir",
          lastName: "Kharlampidi",
          about: "Hello, i am creator of Framework7! Hope you like it!",
          links: [
            {
              title: "Framework7 Website",
              url: "http://framework7.io",
            },
            {
              title: "Framework7 Forum",
              url: "http://forum.framework7.io",
            },
          ],
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            },
          }
        );
      }, 1000);
    },
  },
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
