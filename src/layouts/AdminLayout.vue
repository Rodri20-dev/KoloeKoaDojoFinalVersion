<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabase";

const profile = ref(null);
const avatarUrl = ref("");

const loadProfile = async () => {
    const { data, error } = await supabase.rpc("get_my_profile");

    if (error) {
        console.error("Erro ao carregar perfil do header:", error);
        return;
    }

    const profileData = data?.[0];

    if (!profileData) {
        console.warn("Perfil não encontrado no header.");
        return;
    }

    profile.value = profileData;

    if (
        profileData.avatar_base64 &&
        profileData.avatar_mime_type
    ) {
        avatarUrl.value =
            `data:${profileData.avatar_mime_type};base64,${profileData.avatar_base64}`;
    } else {
        avatarUrl.value = "";
    }

    console.log("Avatar carregado no header:", {
        mimeType: profileData.avatar_mime_type,
        hasAvatar: !!profileData.avatar_base64,
        avatarLength: profileData.avatar_base64?.length || 0,
    });
};

const handleProfileUpdated = async () => {
    await loadProfile();
};

onMounted(() => {
    loadProfile();

    window.addEventListener(
        "profile-updated",
        handleProfileUpdated
    );
});

onUnmounted(() => {
    window.removeEventListener(
        "profile-updated",
        handleProfileUpdated
    );
});

const router = useRouter();

const mobileMenuOpen = ref(false);

const navigationItems = [
    {
        name: "Dashboard",
        path: "/admin",
        icon: "dashboard",
    },
    {
        name: "Galeria",
        path: "/admin/gallery",
        icon: "gallery",
    },
    {
        name: "Vídeos",
        path: "/admin/videos",
        icon: "video",
    },
    {
        name: "Horários",
        path: "/admin/schedule",
        icon: "schedule",
    },
    {
        name: "Mensagens",
        path: "/admin/messages",
        icon: "message",
    },
    {
        name: "Definições",
        path: "/admin/settings",
        icon: "settings",
    },
];

const logout = async () => {
    const confirmed = window.confirm(
        "Tens a certeza que queres Terminar Sessão?"
    );

    if (!confirmed) {
        return;
    }

    await supabase.auth.signOut();
    router.push("/admin/login");
};

const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 text-gray-900">

        <!-- Mobile top bar -->
        <header class="lg:hidden bg-black text-white h-16 flex items-center justify-between px-5">
            <div class="flex items-center gap-3">
                <img
                    src="/images/KoloeKoaLogo.jpeg"
                    alt="Kolo'e Koa"
                    class="w-10 h-10 object-contain rounded-full"
                />

                <span class="font-theme-heading font-bold">
                    Kolo'e Koa
                </span>
            </div>

            <button
                type="button"
                @click="mobileMenuOpen = !mobileMenuOpen"
                class="text-white"
                aria-label="Abrir menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-7 h-7"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>
        </header>

        <!-- Mobile navigation -->
        <div
            v-if="mobileMenuOpen"
            class="lg:hidden fixed inset-0 z-50 bg-black text-white p-6"
        >
            <div class="flex justify-between items-center mb-10">
                <span class="text-xl font-bold">
                    Área Administrativa
                </span>

                <button
                    type="button"
                    @click="closeMobileMenu"
                    aria-label="Fechar menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-7 h-7"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <nav class="space-y-2">
                <RouterLink
                    v-for="item in navigationItems"
                    :key="item.path"
                    :to="item.path"
                    @click="closeMobileMenu"
                    class="block px-4 py-3 rounded-lg transition hover:bg-white/10"
                    exact-active-class="bg-theme-primary text-white"
                >
                    {{ item.name }}
                </RouterLink>

                <button
                    type="button"
                    @click="logout"
                    class="w-full text-left px-4 py-3 rounded-lg transition hover:bg-red-600/20 text-red-400 mt-6"
                >
                    Terminar sessão
                </button>
            </nav>
        </div>

        <!-- Desktop sidebar -->
        <aside
            class="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-black text-white flex-col"
        >
            <!-- Logo -->
            <div class="h-20 flex items-center gap-3 px-6 border-b border-white/10">
                <img
                    src="/images/KoloeKoaLogo.jpeg"
                    alt="Kolo'e Koa"
                    class="w-12 h-12 object-contain rounded-full"
                />

                <div>
                    <p class="font-bold font-theme-heading">
                        Kolo'e Koa
                    </p>

                    <p class="text-xs text-gray-400">
                        Administração
                    </p>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-6 space-y-2">
                <RouterLink
                    v-for="item in navigationItems"
                    :key="item.path"
                    :to="item.path"
                    class="block px-4 py-3 rounded-lg transition hover:bg-white/10"
                    exact-active-class="bg-theme-primary text-white"
                >
                    {{ item.name }}
                </RouterLink>
            </nav>

            <!-- Logout -->
            <div class="p-4 border-t border-white/10">
                <button
                    type="button"
                    @click="logout"
                    class="w-full text-left px-4 py-3 rounded-lg text-red-400 transition hover:bg-red-600/10"
                >
                    Terminar sessão
                </button>
            </div>
        </aside>

        <!-- Main content -->
        <div class="lg:ml-64 min-h-screen">

            <!-- Desktop top bar -->
            <header
                class="hidden lg:flex h-20 bg-white border-b border-gray-200 items-center justify-between px-8"
            >
                <div>
                    <h1 class="text-xl font-bold font-theme-heading">
                        Área Administrativa
                    </h1>

                    <p class="text-sm text-gray-500">
                        Gestão do Kolo'e Koa Dojo Kenpo
                    </p>
                </div>

                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <p class="text-sm font-semibold">
                            Administrador
                        </p>

                        <p class="text-xs text-gray-500">
                            Área Reservada
                        </p>
                    </div>

                    <div
                        class="w-10 h-10 rounded-full overflow-hidden bg-theme-primary flex items-center justify-center"
                    >
                        <img
                            v-if="avatarUrl"
                            :src="avatarUrl"
                            alt="Fotografia de perfil"
                            class="w-full h-full object-cover"
                            @error="avatarUrl = ''"
                        />

                        <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M20 21a8 8 0 0 0-16 0"
                            />
                            <circle
                                cx="12"
                                cy="7"
                                r="4"
                            />
                        </svg>
                    </div>
                </div>
            </header>

            <!-- Page -->
            <main class="p-5 lg:p-8">
                <RouterView />
            </main>

        </div>
    </div>
</template>