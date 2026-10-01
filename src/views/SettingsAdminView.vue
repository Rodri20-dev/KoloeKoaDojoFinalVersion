<script setup>
import { onMounted } from "vue";

import { useProfileSettings } from "../composables/useProfileSettings";

const {
    profile,
    fullName,
    email,
    avatarPreview,
    selectedAvatar,

    currentPassword,
    newPassword,
    confirmPassword,

    loading,
    savingProfile,
    uploadingAvatar,
    removingAvatar,
    changingPassword,

    successMessage,
    errorMessage,

    loadProfile,
    saveProfile,
    handleAvatarChange,
    uploadAvatar,
    removeAvatar,
    cancelAvatarChange,
    changePassword,
    formatDate,
} = useProfileSettings();

onMounted(() => {
    loadProfile();
});
</script>

<template>
    <div class="space-y-8">
        <!-- Header -->
        <div>
            <p
                class="text-theme-primary font-semibold uppercase tracking-wider text-sm"
            >
                Definições
            </p>

            <h1
                class="text-3xl md:text-4xl font-theme-heading font-bold text-gray-900 mt-1"
            >
                Meu perfil
            </h1>

            <p class="text-gray-500 mt-2">
                Gere as informações do teu perfil de administrador.
            </p>
        </div>

        <!-- Messages -->
        <div
            v-if="successMessage"
            class="bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-3"
        >
            {{ successMessage }}
        </div>

        <div
            v-if="errorMessage"
            class="bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-3"
        >
            {{ errorMessage }}
        </div>

        <!-- Loading -->
        <div
            v-if="loading"
            class="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500"
        >
            A carregar o perfil...
        </div>

        <template v-else-if="profile">
            <!-- Avatar -->
            <section
                class="bg-white rounded-xl border border-gray-200 p-6 md:p-8"
            >
                <div class="mb-6">
                    <h2
                        class="text-xl font-theme-heading font-bold text-gray-900"
                    >
                        Fotografia de perfil
                    </h2>

                    <p class="text-gray-500 text-sm mt-1">
                        JPG, PNG ou WebP até 2 MB.
                    </p>
                </div>

                <div
                    class="flex flex-col sm:flex-row sm:items-center gap-6"
                >
                    <!-- Avatar -->
                    <div
                        class="w-28 h-28 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-100 flex-shrink-0 flex items-center justify-center"
                    >
                        <img
                            v-if="avatarPreview"
                            :src="avatarPreview"
                            alt="Fotografia de perfil"
                            class="w-full h-full object-cover"
                        />

                        <span
                            v-else
                            class="text-3xl font-bold text-gray-500"
                        >
                            {{
                                fullName
                                    ? fullName
                                          .charAt(0)
                                          .toUpperCase()
                                    : "A"
                            }}
                        </span>
                    </div>

                    <div class="space-y-3">
                        <div class="flex flex-wrap gap-3">
                            <label
                                class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-theme-primary text-white font-semibold cursor-pointer hover:opacity-90 transition"
                            >
                                Escolher fotografia

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    class="hidden"
                                    @change="
                                        handleAvatarChange
                                    "
                                />
                            </label>

                            <button
                                v-if="avatarPreview"
                                type="button"
                                @click="removeAvatar"
                                :disabled="removingAvatar"
                                class="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                            >
                                {{
                                    removingAvatar
                                        ? "A remover..."
                                        : "Remover fotografia"
                                }}
                            </button>
                        </div>

                        <div
                            v-if="selectedAvatar"
                            class="flex flex-wrap gap-3"
                        >
                            <button
                                type="button"
                                @click="uploadAvatar"
                                :disabled="uploadingAvatar"
                                class="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {{
                                    uploadingAvatar
                                        ? "A guardar..."
                                        : "Guardar nova fotografia"
                                }}
                            </button>

                            <button
                                type="button"
                                @click="cancelAvatarChange"
                                :disabled="uploadingAvatar"
                                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Personal information -->
            <section
                class="bg-white rounded-xl border border-gray-200 p-6 md:p-8"
            >
                <div class="mb-6">
                    <h2
                        class="text-xl font-theme-heading font-bold text-gray-900"
                    >
                        Informações pessoais
                    </h2>

                    <p class="text-gray-500 text-sm mt-1">
                        Informações utilizadas pelo painel administrativo.
                    </p>
                </div>

                <div class="space-y-6 max-w-2xl">
                    <!-- Full name -->
                    <div>
                        <label
                            for="full-name"
                            class="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Nome completo
                        </label>

                        <input
                            id="full-name"
                            v-model="fullName"
                            type="text"
                            autocomplete="name"
                            class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                            placeholder="Nome completo"
                        />
                    </div>

                    <!-- Email -->
                    <div>
                        <label
                            for="email"
                            class="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            :value="email"
                            type="email"
                            disabled
                            class="w-full rounded-lg border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                        />

                        <p
                            class="text-xs text-gray-500 mt-2"
                        >
                            O email de autenticação é gerido pelo Supabase Auth.
                        </p>
                    </div>

                    <!-- Role -->
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Função
                        </label>

                        <div
                            class="inline-flex px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold"
                        >
                            Administrador
                        </div>
                    </div>

                    <!-- Created -->
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Conta criada em
                        </label>

                        <p class="text-gray-600">
                            {{
                                formatDate(
                                    profile.created_at
                                )
                            }}
                        </p>
                    </div>

                    <!-- Save -->
                    <div>
                        <button
                            type="button"
                            @click="saveProfile"
                            :disabled="savingProfile"
                            class="px-5 py-3 rounded-lg bg-theme-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                        >
                            {{
                                savingProfile
                                    ? "A guardar..."
                                    : "Guardar alterações"
                            }}
                        </button>
                    </div>
                </div>
            </section>

            <!-- Security -->
            <!-- Security -->
            <section
                class="bg-white rounded-xl border border-gray-200 p-6 md:p-8"
            >
                <div>
                    <h2
                        class="text-xl font-theme-heading font-bold text-gray-900"
                    >
                        Segurança
                    </h2>

                    <p class="text-gray-500 text-sm mt-1">
                        Altera a palavra-passe utilizada para aceder ao painel administrativo.
                    </p>
                </div>

                <div class="mt-6 max-w-2xl space-y-6">

                    <!-- Current password -->
                    <div>
                        <label
                            for="current-password"
                            class="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Palavra-passe atual
                        </label>

                        <input
                            id="current-password"
                            v-model="currentPassword"
                            type="password"
                            autocomplete="current-password"
                            class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                            placeholder="Palavra-passe atual"
                            :disabled="changingPassword"
                        />
                    </div>

                    <!-- New password -->
                    <div>
                        <label
                            for="new-password"
                            class="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Nova palavra-passe
                        </label>

                        <input
                            id="new-password"
                            v-model="newPassword"
                            type="password"
                            autocomplete="new-password"
                            class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                            placeholder="Nova palavra-passe"
                            :disabled="changingPassword"
                        />

                        <p class="text-xs text-gray-500 mt-2">
                            A nova palavra-passe deve ter pelo menos 8 caracteres.
                        </p>
                    </div>

                    <!-- Confirm new password -->
                    <div>
                        <label
                            for="confirm-password"
                            class="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Confirmar nova palavra-passe
                        </label>

                        <input
                            id="confirm-password"
                            v-model="confirmPassword"
                            type="password"
                            autocomplete="new-password"
                            class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                            placeholder="Repetir nova palavra-passe"
                            :disabled="changingPassword"
                            @keyup.enter="changePassword"
                        />
                    </div>

                    <!-- Change password -->
                    <div>
                        <button
                            type="button"
                            @click="changePassword"
                            :disabled="changingPassword"
                            class="px-5 py-3 rounded-lg bg-theme-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                        >
                            {{
                                changingPassword
                                    ? "A alterar..."
                                    : "Alterar palavra-passe"
                            }}
                        </button>
                    </div>

                </div>
            </section>
        </template>
    </div>
</template>