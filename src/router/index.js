import { createRouter, createWebHistory } from "vue-router";

import PublicView from "../views/PublicView.vue";
import LoginView from "../views/LoginView.vue";
import AdminView from "../views/AdminView.vue";

import DashboardView from "../views/DashboardView.vue";
import GalleryAdminView from "../views/GalleryAdminView.vue";
import VideosAdminView from "../views/VideosAdminView.vue";
import ScheduleAdminView from "../views/ScheduleAdminView.vue";
import MessagesAdminView from "../views/MessagesAdminView.vue";
import SettingsAdminView from "../views/SettingsAdminView.vue";
import AdminActivateView from "../views/AdminActivateView.vue";

import AdminLayout from "../layouts/AdminLayout.vue";

import { supabase } from "../lib/supabase";

const routes = [
    {
        path: "/",
        name: "home",
        component: PublicView,
    },

    {
        path: "/admin/login",
        name: "admin-login",
        component: LoginView,
    },

    {
        path: "/admin",
        component: AdminView,
        meta: {
            requiresAdmin: true,
        },
        children: [
            {
                path: "",
                name: "admin-dashboard",
                component: DashboardView,
            },
            {
                path: "gallery",
                name: "admin-gallery",
                component: GalleryAdminView,
            },
            {
                path: "videos",
                name: "admin-videos",
                component: VideosAdminView,
            },
            {
                path: "schedule",
                name: "admin-schedule",
                component: ScheduleAdminView,
            },
            {
                path: "messages",
                name: "admin-messages",
                component: MessagesAdminView,
            },
            {
                path: "settings",
                name: "admin-settings",
                component: SettingsAdminView,
            },
            {
                path: "/admin/activate",
                name: "admin-activate",
                component: AdminActivateView,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    if (!to.meta.requiresAdmin) {
        return true;
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            name: "admin-login",
        };
    }

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error || profile?.role !== "admin") {
        await supabase.auth.signOut();

        return {
            name: "admin-login",
        };
    }

    return true;
});

export default router;