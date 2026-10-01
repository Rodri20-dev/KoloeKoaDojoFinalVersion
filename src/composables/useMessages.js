import { computed, onMounted, ref } from "vue";
import {
    getMessages,
    updateMessageStatus,
    deleteMessage,
} from "../services/messageService";

export const useMessages = () => {
    const messages = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");
    const successMessage = ref("");
    const deletingId = ref(null);

    const newMessagesCount = computed(() => {
        return messages.value.filter(
            (message) => message.status === "new"
        ).length;
    });

    const loadMessages = async () => {
        loading.value = true;
        errorMessage.value = "";

        try {
            messages.value = await getMessages();
        } catch (error) {
            console.error("Messages load error:", error);

            errorMessage.value =
                "Não foi possível carregar as mensagens.";
        } finally {
            loading.value = false;
        }
    };

    const markAsRead = async (message) => {
        if (message.status !== "new") {
            return;
        }

        try {
            const updatedMessage = await updateMessageStatus(
                message.id,
                "read"
            );

            const index = messages.value.findIndex(
                (item) => item.id === message.id
            );

            if (index !== -1) {
                messages.value[index] = updatedMessage;
            }
        } catch (error) {
            console.error(
                "Mark message as read error:",
                error
            );

            errorMessage.value =
                "Não foi possível atualizar a mensagem.";
        }
    };

    const markAsReplied = async (message) => {
        try {
            const updatedMessage = await updateMessageStatus(
                message.id,
                "replied"
            );

            const index = messages.value.findIndex(
                (item) => item.id === message.id
            );

            if (index !== -1) {
                messages.value[index] = updatedMessage;
            }

            successMessage.value =
                "Mensagem marcada como respondida.";

            setTimeout(() => {
                successMessage.value = "";
            }, 3000);
        } catch (error) {
            console.error(
                "Mark message as replied error:",
                error
            );

            errorMessage.value =
                "Não foi possível atualizar a mensagem.";
        }
    };

    const removeMessage = async (message) => {
        const confirmed = window.confirm(
            "Tens a certeza que queres eliminar esta mensagem?"
        );

        if (!confirmed) {
            return;
        }

        deletingId.value = message.id;
        errorMessage.value = "";

        try {
            await deleteMessage(message.id);

            messages.value = messages.value.filter(
                (item) => item.id !== message.id
            );

            successMessage.value =
                "Mensagem eliminada com sucesso.";

            setTimeout(() => {
                successMessage.value = "";
            }, 3000);
        } catch (error) {
            console.error(
                "Delete message error:",
                error
            );

            errorMessage.value =
                "Não foi possível eliminar a mensagem.";
        } finally {
            deletingId.value = null;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("pt-PT", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    onMounted(loadMessages);

    return {
        messages,
        loading,
        errorMessage,
        successMessage,
        deletingId,
        newMessagesCount,
        loadMessages,
        markAsRead,
        markAsReplied,
        removeMessage,
        formatDate,
    };
};