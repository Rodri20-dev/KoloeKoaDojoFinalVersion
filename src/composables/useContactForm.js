import { ref } from "vue";
import { createContactMessage } from "../services/contactService";

export const useContactForm = () => {
    const name = ref("");
    const email = ref("");
    const subject = ref("");
    const message = ref("");

    const loading = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");

    const submitForm = async () => {
        successMessage.value = "";
        errorMessage.value = "";

        if (
            !name.value.trim() ||
            !email.value.trim() ||
            !subject.value.trim() ||
            !message.value.trim()
        ) {
            errorMessage.value =
                "Preenche todos os campos.";
            return false;
        }

        loading.value = true;

        const { error } = await createContactMessage({
            name: name.value.trim(),
            email: email.value.trim(),
            subject: subject.value.trim(),
            message: message.value.trim(),
        });

        if (error) {
            console.error(
                "Contact form error:",
                error
            );

            errorMessage.value =
                "Não foi possível enviar a mensagem. Tenta novamente.";

            loading.value = false;

            return false;
        }

        successMessage.value =
            "Mensagem enviada com sucesso. Obrigado pelo contacto!";

        name.value = "";
        email.value = "";
        subject.value = "";
        message.value = "";

        loading.value = false;

        return true;
    };

    return {
        name,
        email,
        subject,
        message,
        loading,
        successMessage,
        errorMessage,
        submitForm,
    };
};