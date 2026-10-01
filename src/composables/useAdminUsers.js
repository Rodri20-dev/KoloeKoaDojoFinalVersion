import { ref } from "vue";
import { inviteAdmin } from "../services/adminUserService";

export const useAdminUsers = () => {
    const fullName = ref("");
    const email = ref("");

    const loading = ref(false);

    const successMessage = ref("");
    const errorMessage = ref("");

    const clearMessages = () => {
        successMessage.value = "";
        errorMessage.value = "";
    };

    const resetForm = () => {
        fullName.value = "";
        email.value = "";
    };

    const submitInvite = async () => {
        clearMessages();

        const trimmedName = fullName.value.trim();
        const trimmedEmail =
            email.value.trim().toLowerCase();

        if (!trimmedName) {
            errorMessage.value =
                "O nome completo é obrigatório.";
            return false;
        }

        if (!trimmedEmail) {
            errorMessage.value =
                "O email é obrigatório.";
            return false;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            errorMessage.value =
                "Introduz um endereço de email válido.";
            return false;
        }

        loading.value = true;

        const { data, error } = await inviteAdmin({
            fullName: trimmedName,
            email: trimmedEmail,
        });

        if (error) {
            console.error(
                "Admin invitation error:",
                error
            );

            if (
                error.message
                    ?.toLowerCase()
                    .includes("function")
            ) {
                errorMessage.value =
                    "Não foi possível contactar o serviço de convites.";
            } else {
                errorMessage.value =
                    data?.error ||
                    "Não foi possível enviar o convite.";
            }

            loading.value = false;
            return false;
        }

        if (!data?.success) {
            errorMessage.value =
                data?.error ||
                "Não foi possível enviar o convite.";

            loading.value = false;
            return false;
        }

        successMessage.value =
            `Convite enviado para ${trimmedEmail}.`;

        resetForm();

        loading.value = false;

        return true;
    };

    return {
        fullName,
        email,
        loading,
        successMessage,
        errorMessage,
        submitInvite,
        clearMessages,
    };
};