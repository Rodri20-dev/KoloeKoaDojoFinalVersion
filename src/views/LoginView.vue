<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabase";

const router = useRouter();

const email = ref("");
const password = ref("");

const loading = ref(false);
const errorMessage = ref("");
const debugMessage = ref("");
const isDevelopment = import.meta.env.DEV;

const handleLogin = async () => {
    errorMessage.value = "";
    debugMessage.value = "";
    loading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    if (error) {
        errorMessage.value = "O email ou a palavra-passe estão incorretos.";
        debugMessage.value = `${error.name}: ${error.message}`;
        loading.value = false;
        return;
    }

    loading.value = false;

    await router.push("/admin");
};
</script>

<template>
    <main class="min-h-screen bg-black text-white flex items-center justify-center px-5 py-12">
        <div class="w-full max-w-md">

            <!-- Logo -->
            <div class="flex justify-center mb-8">
                <img
                    src="/images/KoloeKoaLogo.jpeg"
                    alt="Logótipo Kolo'e Koa Dojo Kenpo"
                    class="w-24 h-24 object-contain rounded-full"
                />
            </div>

            <!-- Login card -->
            <div class="bg-white text-black rounded-2xl shadow-2xl p-8">

                <div class="text-center mb-8">
                    <p class="text-sm font-semibold uppercase tracking-widest text-theme-primary mb-2">
                        Kolo'e Koa Dojo Kenpo
                    </p>

                    <h1 class="text-3xl font-bold font-theme-heading">
                        Área Reservada
                    </h1>

                    <p class="mt-3 text-gray-600">
                        Inicie sessão para aceder à área de administração.
                    </p>
                </div>

                <!-- Error -->
                <div
                    v-if="errorMessage"
                    class="mb-6 rounded-lg border border-red-300 bg-red-50 p-4"
                >
                    <div class="flex items-start gap-3">
                        <span class="text-red-600 text-xl">⚠</span>

                        <div>
                            <p class="font-semibold text-red-800">
                                Não foi possível iniciar sessão
                            </p>

                            <p class="text-sm text-red-700 mt-1">
                                {{ errorMessage }}
                            </p>
                        </div>
                    </div>

                    <!-- Developer information -->
                    <div
                        v-if="isDevelopment && debugMessage"
                        class="mt-3 pt-3 border-t border-red-200"
                    >
                        <p class="text-xs font-semibold text-red-800">
                            Informação de desenvolvimento
                        </p>

                        <code class="block mt-1 text-xs text-red-700 break-all">
                            {{ debugMessage }}
                        </code>
                    </div>
                </div>

                <!-- Form -->
                <form @submit.prevent="handleLogin" class="space-y-5">

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
                            v-model="email"
                            type="email"
                            autocomplete="email"
                            placeholder="nome@exemplo.com"
                            required
                            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                        />
                    </div>

                    <!-- Password -->
                    <div>
                        <label
                            for="password"
                            class="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Palavra-passe
                        </label>

                        <input
                            id="password"
                            v-model="password"
                            type="password"
                            autocomplete="current-password"
                            placeholder="Introduza a sua palavra-passe"
                            required
                            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20"
                        />
                    </div>

                    <!-- Submit -->
                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full rounded-lg bg-theme-primary px-4 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {{ loading ? "A iniciar sessão..." : "Iniciar sessão" }}
                    </button>

                </form>

                <!-- Back -->
                <div class="mt-6 text-center">
                    <a
                        href="/"
                        class="text-sm text-gray-600 transition hover:text-theme-primary"
                    >
                        ← Voltar ao site
                    </a>
                </div>

            </div>

            <p class="text-center text-xs text-gray-500 mt-6">
                Área reservada aos administradores do dojo.
            </p>

        </div>
    </main>
</template>