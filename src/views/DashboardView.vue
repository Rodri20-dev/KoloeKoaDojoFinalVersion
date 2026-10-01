<script setup>
import { RouterLink } from "vue-router";

import { useDashboard } from "../composables/useDashboard";

const {
    loading,
    errorMessage,
    stats,
    recentMessages,

    loadDashboard,
    formatDate,
    getStatusLabel,
    getStatusClass,
    greeting,
} = useDashboard();
</script>

<template>
    <div class="space-y-8">
        <!-- Header -->
        <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
            <div>
                <p
                    class="text-theme-primary font-semibold uppercase tracking-wider text-sm"
                >
                    Dashboard
                </p>

                <h1
                    class="text-3xl md:text-4xl font-theme-heading font-bold text-gray-900 mt-1"
                >
                    {{ greeting }} 👋
                </h1>

                <p class="text-gray-500 mt-2">
                    Aqui tens uma visão geral do Kolo'e Koa Dojo.
                </p>
            </div>

            <button
                type="button"
                @click="loadDashboard"
                :disabled="loading"
                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
                {{ loading ? "A atualizar..." : "Atualizar" }}
            </button>
        </div>

        <!-- Error -->
        <div
            v-if="errorMessage"
            class="bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-3"
        >
            {{ errorMessage }}
        </div>

        <!-- Stats -->
        <div
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5"
        >
            <!-- Gallery -->
            <RouterLink
                to="/admin/gallery"
                class="bg-white rounded-xl border border-gray-200 p-6 hover:border-theme-primary hover:shadow-md transition"
            >
                <div
                    class="flex items-center justify-between"
                >
                    <div>
                        <p class="text-gray-500 text-sm">
                            Fotografias
                        </p>

                        <p
                            class="text-3xl font-bold text-gray-900 mt-2"
                        >
                            {{
                                loading
                                    ? "—"
                                    : stats.gallery
                            }}
                        </p>
                    </div>

                    <div
                        class="w-12 h-12 rounded-lg bg-theme-primary/10 flex items-center justify-center text-theme-primary text-xl"
                    >
                        📷
                    </div>
                </div>
            </RouterLink>

            <!-- Videos -->
            <RouterLink
                to="/admin/videos"
                class="bg-white rounded-xl border border-gray-200 p-6 hover:border-theme-primary hover:shadow-md transition"
            >
                <div
                    class="flex items-center justify-between"
                >
                    <div>
                        <p class="text-gray-500 text-sm">
                            Vídeos
                        </p>

                        <p
                            class="text-3xl font-bold text-gray-900 mt-2"
                        >
                            {{
                                loading
                                    ? "—"
                                    : stats.videos
                            }}
                        </p>
                    </div>

                    <div
                        class="w-12 h-12 rounded-lg bg-theme-primary/10 flex items-center justify-center text-theme-primary text-xl"
                    >
                        🎥
                    </div>
                </div>
            </RouterLink>

            <!-- Schedule -->
            <RouterLink
                to="/admin/schedule"
                class="bg-white rounded-xl border border-gray-200 p-6 hover:border-theme-primary hover:shadow-md transition"
            >
                <div
                    class="flex items-center justify-between"
                >
                    <div>
                        <p class="text-gray-500 text-sm">
                            Horários ativos
                        </p>

                        <p
                            class="text-3xl font-bold text-gray-900 mt-2"
                        >
                            {{
                                loading
                                    ? "—"
                                    : stats.schedules
                            }}
                        </p>
                    </div>

                    <div
                        class="w-12 h-12 rounded-lg bg-theme-primary/10 flex items-center justify-center text-theme-primary text-xl"
                    >
                        🕐
                    </div>
                </div>
            </RouterLink>

            <!-- Messages -->
            <RouterLink
                to="/admin/messages"
                class="bg-white rounded-xl border border-gray-200 p-6 hover:border-theme-primary hover:shadow-md transition"
            >
                <div
                    class="flex items-center justify-between"
                >
                    <div>
                        <p class="text-gray-500 text-sm">
                            Mensagens
                        </p>

                        <p
                            class="text-3xl font-bold text-gray-900 mt-2"
                        >
                            {{
                                loading
                                    ? "—"
                                    : stats.messages
                            }}
                        </p>
                    </div>

                    <div
                        class="w-12 h-12 rounded-lg bg-theme-primary/10 flex items-center justify-center text-theme-primary text-xl"
                    >
                        ✉️
                    </div>
                </div>
            </RouterLink>

            <!-- New messages -->
            <RouterLink
                to="/admin/messages"
                class="bg-white rounded-xl border border-gray-200 p-6 hover:border-theme-primary hover:shadow-md transition"
                :class="
                    stats.newMessages > 0
                        ? 'border-yellow-300'
                        : ''
                "
            >
                <div
                    class="flex items-center justify-between"
                >
                    <div>
                        <p class="text-gray-500 text-sm">
                            Mensagens novas
                        </p>

                        <p
                            class="text-3xl font-bold text-gray-900 mt-2"
                        >
                            {{
                                loading
                                    ? "—"
                                    : stats.newMessages
                            }}
                        </p>
                    </div>

                    <div
                        class="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700 text-xl"
                    >
                        🔔
                    </div>
                </div>
            </RouterLink>
        </div>

        <!-- Quick actions -->
        <div>
            <h2
                class="text-2xl font-theme-heading font-bold text-gray-900 mb-4"
            >
                Acesso rápido
            </h2>

            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <RouterLink
                    to="/admin/gallery"
                    class="bg-gray-900 text-white rounded-xl p-5 hover:bg-gray-800 transition"
                >
                    <p
                        class="text-theme-primary font-semibold text-sm uppercase"
                    >
                        Galeria
                    </p>

                    <h3
                        class="text-xl font-theme-heading font-semibold mt-1"
                    >
                        Gerir fotografias
                    </h3>

                    <p
                        class="text-gray-400 text-sm mt-2"
                    >
                        Adicionar, editar ou eliminar fotografias.
                    </p>
                </RouterLink>

                <RouterLink
                    to="/admin/videos"
                    class="bg-gray-900 text-white rounded-xl p-5 hover:bg-gray-800 transition"
                >
                    <p
                        class="text-theme-primary font-semibold text-sm uppercase"
                    >
                        Vídeos
                    </p>

                    <h3
                        class="text-xl font-theme-heading font-semibold mt-1"
                    >
                        Gerir vídeos
                    </h3>

                    <p
                        class="text-gray-400 text-sm mt-2"
                    >
                        Gerir vídeos locais e YouTube.
                    </p>
                </RouterLink>

                <RouterLink
                    to="/admin/schedule"
                    class="bg-gray-900 text-white rounded-xl p-5 hover:bg-gray-800 transition"
                >
                    <p
                        class="text-theme-primary font-semibold text-sm uppercase"
                    >
                        Horários
                    </p>

                    <h3
                        class="text-xl font-theme-heading font-semibold mt-1"
                    >
                        Gerir treinos
                    </h3>

                    <p
                        class="text-gray-400 text-sm mt-2"
                    >
                        Atualizar os horários do dojo.
                    </p>
                </RouterLink>

                <RouterLink
                    to="/admin/messages"
                    class="bg-gray-900 text-white rounded-xl p-5 hover:bg-gray-800 transition"
                >
                    <p
                        class="text-theme-primary font-semibold text-sm uppercase"
                    >
                        Contactos
                    </p>

                    <h3
                        class="text-xl font-theme-heading font-semibold mt-1"
                    >
                        Ver mensagens
                    </h3>

                    <p
                        class="text-gray-400 text-sm mt-2"
                    >
                        Consultar mensagens recebidas.
                    </p>
                </RouterLink>
            </div>
        </div>

        <!-- Recent messages -->
        <div>
            <div
                class="flex items-center justify-between mb-4"
            >
                <h2
                    class="text-2xl font-theme-heading font-bold text-gray-900"
                >
                    Mensagens recentes
                </h2>

                <RouterLink
                    to="/admin/messages"
                    class="text-theme-primary font-semibold hover:underline"
                >
                    Ver todas
                </RouterLink>
            </div>

            <div
                v-if="!loading && recentMessages.length === 0"
                class="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500"
            >
                Ainda não existem mensagens.
            </div>

            <div
                v-else
                class="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
                <div
                    v-for="message in recentMessages"
                    :key="message.id"
                    class="px-6 py-5 border-b border-gray-100 last:border-b-0"
                >
                    <div
                        class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                        <div class="min-w-0">
                            <div
                                class="flex flex-wrap items-center gap-3"
                            >
                                <h3
                                    class="font-semibold text-gray-900"
                                >
                                    {{ message.name }}
                                </h3>

                                <span
                                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    :class="
                                        getStatusClass(
                                            message.status
                                        )
                                    "
                                >
                                    {{
                                        getStatusLabel(
                                            message.status
                                        )
                                    }}
                                </span>
                            </div>

                            <p
                                class="text-gray-700 mt-1"
                            >
                                {{ message.subject }}
                            </p>

                            <p
                                class="text-gray-500 text-sm mt-1 truncate"
                            >
                                {{ message.email }}
                            </p>
                        </div>

                        <div
                            class="text-sm text-gray-400 whitespace-nowrap"
                        >
                            {{ formatDate(message.created_at) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>