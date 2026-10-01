import { ref } from "vue";

import {
    getCurrentUser,
    getMyProfile,
    updateMyProfile,
    updateMyAvatar,
    deleteMyAvatar,
} from "../services/profileService";

import { updatePassword } from "../services/authService";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const MIN_PASSWORD_LENGTH = 8;

export const useProfileSettings = () => {
    const profile = ref(null);

    const fullName = ref("");
    const email = ref("");

    const avatarPreview = ref("");
    const selectedAvatar = ref(null);

    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");

    const loading = ref(true);
    const savingProfile = ref(false);
    const uploadingAvatar = ref(false);
    const removingAvatar = ref(false);
    const changingPassword = ref(false);

    const successMessage = ref("");
    const errorMessage = ref("");

    const clearMessages = () => {
        successMessage.value = "";
        errorMessage.value = "";
    };

    const setError = (message) => {
        errorMessage.value = message;
        successMessage.value = "";
    };

    const setSuccess = (message) => {
        successMessage.value = message;
        errorMessage.value = "";
    };

    const buildAvatarPreview = (
        avatarBase64,
        mimeType
    ) => {
        if (!avatarBase64 || !mimeType) {
            return "";
        }

        return `data:${mimeType};base64,${avatarBase64}`;
    };

    const loadProfile = async () => {
        loading.value = true;
        clearMessages();

        const {
            data: { user },
            error: userError,
        } = await getCurrentUser();

        if (userError || !user) {
            setError(
                "Não foi possível identificar o utilizador."
            );

            loading.value = false;
            return;
        }

        email.value = user.email || "";

        const { data, error } = await getMyProfile();

        if (error) {
            console.error(
                "Profile load error:",
                error
            );

            setError(
                "Não foi possível carregar o perfil."
            );

            loading.value = false;
            return;
        }

        const profileData = data?.[0];

        if (!profileData) {
            setError(
                "Não foi encontrado um perfil para este utilizador."
            );

            loading.value = false;
            return;
        }

        profile.value = profileData;
        fullName.value = profileData.full_name || "";

        avatarPreview.value = buildAvatarPreview(
            profileData.avatar_base64,
            profileData.avatar_mime_type
        );

        loading.value = false;
    };

    const saveProfile = async () => {
        clearMessages();

        const trimmedName = fullName.value.trim();

        if (!trimmedName) {
            setError(
                "O nome completo é obrigatório."
            );

            return;
        }

        savingProfile.value = true;

        const {
            data: { user },
            error: userError,
        } = await getCurrentUser();

        if (userError || !user) {
            setError(
                "Não foi possível identificar o utilizador."
            );

            savingProfile.value = false;
            return;
        }

        const { error } = await updateMyProfile(
            user.id,
            trimmedName
        );

        if (error) {
            console.error(
                "Profile update error:",
                error
            );

            setError(
                "Não foi possível guardar o perfil."
            );

            savingProfile.value = false;
            return;
        }

        profile.value.full_name = trimmedName;

        setSuccess(
            "Perfil atualizado com sucesso."
        );

        savingProfile.value = false;
    };

    const handleAvatarChange = (event) => {
        clearMessages();

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
            setError(
                "Formato inválido. Escolhe JPG, PNG ou WebP."
            );

            event.target.value = "";
            return;
        }

        if (file.size > MAX_AVATAR_SIZE) {
            setError(
                "A fotografia não pode ultrapassar 2 MB."
            );

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

        clearMessages();

        uploadingAvatar.value = true;

        try {
            const base64 = await fileToBase64(
                selectedAvatar.value
            );

            const { error } = await updateMyAvatar({
                base64,
                mimeType: selectedAvatar.value.type,
                size: selectedAvatar.value.size,
            });

            if (error) {
                console.error(
                    "Avatar upload error:",
                    error
                );

                throw new Error(
                    "Não foi possível guardar a fotografia."
                );
            }

            window.dispatchEvent(
                new Event("profile-updated")
            );

            selectedAvatar.value = null;

            setSuccess(
                "Fotografia de perfil atualizada."
            );

            await loadProfile();
        } catch (error) {
            setError(
                error.message ||
                    "Ocorreu um erro ao atualizar a fotografia."
            );
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

        clearMessages();

        removingAvatar.value = true;

        const { error } = await deleteMyAvatar();

        if (error) {
            console.error(
                "Avatar delete error:",
                error
            );

            setError(
                "Não foi possível remover a fotografia."
            );

            removingAvatar.value = false;
            return;
        }

        window.dispatchEvent(
            new Event("profile-updated")
        );

        selectedAvatar.value = null;
        avatarPreview.value = "";

        setSuccess(
            "Fotografia de perfil removida."
        );

        removingAvatar.value = false;

        await loadProfile();
    };

    const cancelAvatarChange = () => {
        selectedAvatar.value = null;

        avatarPreview.value = buildAvatarPreview(
            profile.value?.avatar_base64,
            profile.value?.avatar_mime_type
        );
    };

    const changePassword = async () => {
        clearMessages();

        const current = currentPassword.value;
        const newPasswordValue = newPassword.value;
        const confirmation =
            confirmPassword.value;

        if (!current) {
            setError(
                "Introduz a tua palavra-passe atual."
            );

            return;
        }

        if (!newPasswordValue) {
            setError(
                "Introduz uma nova palavra-passe."
            );

            return;
        }

        if (
            newPasswordValue.length <
            MIN_PASSWORD_LENGTH
        ) {
            setError(
                `A nova palavra-passe deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`
            );

            return;
        }

        if (!confirmation) {
            setError(
                "Confirma a nova palavra-passe."
            );

            return;
        }

        if (
            newPasswordValue !== confirmation
        ) {
            setError(
                "As novas palavras-passe não coincidem."
            );

            return;
        }

        if (current === newPasswordValue) {
            setError(
                "A nova palavra-passe deve ser diferente da atual."
            );

            return;
        }

        changingPassword.value = true;

        const { error } = await updatePassword({
            currentPassword: current,
            newPassword: newPasswordValue,
        });

        if (error) {
            console.error(
                "Password update error:",
                error
            );

            if (
                error.message
                    ?.toLowerCase()
                    .includes("current password")
            ) {
                setError(
                    "A palavra-passe atual está incorreta."
                );
            } else if (
                error.message
                    ?.toLowerCase()
                    .includes("password")
            ) {
                setError(
                    "Não foi possível alterar a palavra-passe. Verifica os requisitos da nova palavra-passe."
                );
            } else {
                setError(
                    "Não foi possível alterar a palavra-passe. Tenta novamente."
                );
            }

            changingPassword.value = false;
            return;
        }

        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

        setSuccess(
            "Palavra-passe alterada com sucesso."
        );

        changingPassword.value = false;
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("pt-PT", {
            dateStyle: "long",
        }).format(new Date(date));
    };

    return {
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
    };
};