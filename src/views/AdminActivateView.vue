<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabase";

const router = useRouter();

const password = ref("");
const confirmPassword = ref("");

const loading = ref(true);
const saving = ref(false);

const errorMessage = ref("");
const successMessage = ref("");

const MIN_PASSWORD_LENGTH = 8;

const checkSession = async () => {
    loading.value = true;
    errorMessage.value = "";

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error || !session) {
        errorMessage.value =
            "O convite é inválido, expirou ou já foi utilizado.";
        loading.value = false;
        return;
    }

    loading.value = false;
};

const activateAccount = async () => {
    errorMessage.value = "";
    successMessage.value = "";

    if (!password.value) {
        errorMessage.value =
            "Introduz uma palavra-passe.";
        return;
    }

    if (password.value.length < MIN_PASSWORD_LENGTH) {
        errorMessage.value =
            `A palavra-passe deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
        return;
    }

    if (!confirmPassword.value) {
        errorMessage.value =
            "Confirma a palavra-passe.";
        return;
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value =
            "As palavras-passe não coincidem.";
        return;
    }

    saving.value = true;

    const { error } = await supabase.auth.updateUser({
        password: password.value,
    });

    if (error) {
        console.error(
            "Account activation error:",
            error
        );

        errorMessage.value =
            "Não foi possível definir a palavra-passe. Tenta novamente.";

        saving.value = false;
        return;
    }

    successMessage.value =
        "Conta ativada com sucesso. A entrar no painel...";

    password.value = "";
    confirmPassword.value = "";

    setTimeout(() => {
        router.push("/admin");
    }, 1500);
};

onMounted(() => {
    checkSession();
});
</script>

<template>
    <div
        class="min-h-screen bg-black flex items-center justify-center px-5 py-10"
    >
        <div class="w-full max-w-md">
            <div
                class="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
                <div class="text-center mb-8">
                    <h1
                        class="text-2xl md:text-3xl font-theme-heading font-bold text-gray-900"
                    >
                        Ativar conta
                    </h1>

                    <p class="text-gray-500 mt-2">
                        Define a tua palavra-passe para começar.
                    </p>
                </div>

                <div
                    v-if="loading"
                    class="text-center text-gray-500 py-8"
                >
                    A validar o convite...
                </div>

                <template v-else>
                    <div
                        v-if="errorMessage"
                        class="mb-6 bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-3 text-sm"
                    >
                        {{ errorMessage }}
                    </div>

                    <div
                        v-if="successMessage"
                        class="mb-6 bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-3 text-sm"
                    >
                        {{ successMessage }}
                    </div>

                    <form
                        v-if="!successMessage"
                        @submit.prevent="activateAccount"
                        class="space-y-5"
                    >
                        <div>
                            <label
                                for="password"
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Nova palavra-passe
                            </label>

                            <input
                                id="password"
                                v-model="password"
                                type="password"
                                autocomplete="new-password"
                                class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                                placeholder="Mínimo 8 caracteres"
                            />
                        </div>

                        <div>
                            <label
                                for="confirm-password"
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Confirmar palavra-passe
                            </label>

                            <input
                                id="confirm-password"
                                v-model="confirmPassword"
                                type="password"
                                autocomplete="new-password"
                                class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                                placeholder="Repete a palavra-passe"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="saving"
                            class="w-full bg-theme-primary text-white font-semibold rounded-lg px-5 py-3 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{
                                saving
                                    ? "A ativar..."
                                    : "Ativar conta"
                            }}
                        </button>
                    </form>

                    <div
                        v-else
                        class="text-center text-gray-500 text-sm"
                    >
                        Serás redirecionado para o painel.
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>