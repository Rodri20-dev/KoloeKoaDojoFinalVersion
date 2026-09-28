<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../lib/supabase";

const profile = ref(null);

const fullName = ref("");
const email = ref("");

const avatarPreview = ref("");
const selectedAvatar = ref(null);

const loading = ref(true);
const savingProfile = ref(false);
const uploadingAvatar = ref(false);
const removingAvatar = ref(false);

const successMessage = ref("");
const errorMessage = ref("");

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const allowedAvatarTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const loadProfile = async () => {
    loading.value = true;
    errorMessage.value = "";

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        errorMessage.value =
            "Não foi possível identificar o utilizador.";
        loading.value = false;
        return;
    }

    email.value = user.email || "";

    const { data, error } = await supabase.rpc(
        "get_my_profile"
    );

    if (error) {
        console.error("Profile load error:", error);

        errorMessage.value =
            "Não foi possível carregar o perfil.";
        loading.value = false;
        return;
    }

    const profileData = data?.[0];

    if (!profileData) {
        errorMessage.value =
            "Não foi encontrado um perfil para este utilizador.";
        loading.value = false;
        return;
    }

    profile.value = profileData;

    fullName.value = profileData.full_name || "";

    if (
        profileData.avatar_base64 &&
        profileData.avatar_mime_type
    ) {
        avatarPreview.value =
            `data:${profileData.avatar_mime_type};base64,${profileData.avatar_base64}`;
    } else {
        avatarPreview.value = "";
    }

    loading.value = false;
};

const saveProfile = async () => {
    successMessage.value = "";
    errorMessage.value = "";

    if (!fullName.value.trim()) {
        errorMessage.value =
            "O nome completo é obrigatório.";
        return;
    }

    savingProfile.value = true;

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        errorMessage.value =
            "Não foi possível identificar o utilizador.";
        savingProfile.value = false;
        return;
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: fullName.value.trim(),
        })
        .eq("id", user.id);

    if (error) {
        console.error("Profile update error:", error);

        errorMessage.value =
            "Não foi possível guardar o perfil.";
        savingProfile.value = false;
        return;
    }

    profile.value.full_name = fullName.value.trim();

    successMessage.value =
        "Perfil atualizado com sucesso.";

    savingProfile.value = false;
};

const handleAvatarChange = (event) => {
    successMessage.value = "";
    errorMessage.value = "";

    const file = event.target.files?.[0];

    if (!file) {
        return;
    }

    if (!allowedAvatarTypes.includes(file.type)) {
        errorMessage.value =
            "Formato inválido. Escolhe JPG, PNG ou WebP.";
        event.target.value = "";
        return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
        errorMessage.value =
            "A fotografia não pode ultrapassar 2 MB.";
        event.target.value = "";
        return;
    }

    selectedAvatar.value = file;

    const reader = new FileReader();

    reader.onload = () => {
        avatarPreview.value = reader.result;
    };

    reader.readAsDataURL(file);
};

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;

            if (typeof result !== "string") {
                reject(
                    new Error(
                        "Não foi possível processar a imagem."
                    )
                );
                return;
            }

            const base64 = result.split(",")[1];

            resolve(base64);
        };

        reader.onerror = () => {
            reject(
                new Error(
                    "Não foi possível ler a imagem."
                )
            );
        };

        reader.readAsDataURL(file);
    });
};

const uploadAvatar = async () => {
    if (!selectedAvatar.value) {
        return;
    }

    successMessage.value = "";
    errorMessage.value = "";
    uploadingAvatar.value = true;

    try {
        const base64 = await fileToBase64(
            selectedAvatar.value
        );

        const { error } = await supabase.rpc(
            "update_my_avatar",
            {
                p_avatar_base64: base64,
                p_avatar_mime_type:
                    selectedAvatar.value.type,
                p_avatar_size:
                    selectedAvatar.value.size,
            }
        );

        if (error) {
            console.error(
                "Avatar upload error:",
                error
            );

            throw new Error(
                "Não foi possível guardar a fotografia."
            );
        }

        window.dispatchEvent(new Event("profile-updated"));

        selectedAvatar.value = null;

        successMessage.value =
            "Fotografia de perfil atualizada.";

        await loadProfile();
    } catch (error) {
        errorMessage.value =
            error.message ||
            "Ocorreu um erro ao atualizar a fotografia.";
    } finally {
        uploadingAvatar.value = false;
    }
};

const removeAvatar = async () => {
    const confirmed = window.confirm(
        "Tens a certeza que queres remover a fotografia de perfil?"
    );

    if (!confirmed) {
        return;
    }

    successMessage.value = "";
    errorMessage.value = "";
    removingAvatar.value = true;

    const { error } = await supabase.rpc(
        "delete_my_avatar"
    );

    if (error) {
        console.error(
            "Avatar delete error:",
            error
        );

        errorMessage.value =
            "Não foi possível remover a fotografia.";

        removingAvatar.value = false;
        return;
    }

    window.dispatchEvent(new Event("profile-updated"));

    selectedAvatar.value = null;
    avatarPreview.value = "";

    successMessage.value =
        "Fotografia de perfil removida.";

    removingAvatar.value = false;

    await loadProfile();
};

const cancelAvatarChange = () => {
    selectedAvatar.value = null;

    if (
        profile.value?.avatar_base64 &&
        profile.value?.avatar_mime_type
    ) {
        avatarPreview.value =
            `data:${profile.value.avatar_mime_type};base64,${profile.value.avatar_base64}`;
    } else {
        avatarPreview.value = "";
    }
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat("pt-PT", {
        dateStyle: "long",
    }).format(new Date(date));
};

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
                        A gestão da palavra-passe é feita pelo Supabase Auth.
                    </p>
                </div>

                <div class="mt-6">
                    <button
                        type="button"
                        disabled
                        class="px-5 py-3 rounded-lg border border-gray-300 text-gray-500 cursor-not-allowed"
                    >
                        Alterar palavra-passe
                    </button>

                    <p class="text-xs text-gray-400 mt-2">
                        Vamos ativar esta opção na próxima etapa.
                    </p>
                </div>
            </section>
        </template>
    </div>
</template>