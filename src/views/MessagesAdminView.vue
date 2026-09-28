<script setup>
import { computed, onMounted, ref } from "vue";
import { supabase } from "../lib/supabase";

const messages = ref([]);
const loading = ref(true);
const errorMessage = ref("");
const selectedMessage = ref(null);
const updatingId = ref(null);
const deletingId = ref(null);

const statusOptions = [
    { value: "new", label: "Nova" },
    { value: "read", label: "Lida" },
    { value: "replied", label: "Respondida" },
];

const loadMessages = async () => {
    loading.value = true;
    errorMessage.value = "";

    const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Messages load error:", error);
        errorMessage.value = "Não foi possível carregar as mensagens.";
        loading.value = false;
        return;
    }

    messages.value = data || [];
    loading.value = false;
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat("pt-PT", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(date));
};

const getStatusLabel = (status) => {
    const option = statusOptions.find(
        (item) => item.value === status
    );

    return option?.label || status;
};

const getStatusClass = (status) => {
    if (status === "new") {
        return "bg-yellow-100 text-yellow-800";
    }

    if (status === "read") {
        return "bg-blue-100 text-blue-800";
    }

    if (status === "replied") {
        return "bg-green-100 text-green-800";
    }

    return "bg-gray-100 text-gray-800";
};

const openMessage = async (message) => {
    selectedMessage.value = message;

    if (message.status === "new") {
        await updateStatus(message.id, "read");
    }
};

const closeMessage = () => {
    selectedMessage.value = null;
};

const updateStatus = async (id, status) => {
    updatingId.value = id;
    errorMessage.value = "";

    const { data, error } = await supabase
        .from("contact_messages")
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Message status update error:", error);
        errorMessage.value =
            "Não foi possível atualizar o estado da mensagem.";
        updatingId.value = null;
        return;
    }

    messages.value = messages.value.map((message) =>
        message.id === id ? data : message
    );

    if (selectedMessage.value?.id === id) {
        selectedMessage.value = data;
    }

    updatingId.value = null;
};

const deleteMessage = async (message) => {
    const confirmed = window.confirm(
        `Tens a certeza que queres eliminar a mensagem de "${message.name}"?`
    );

    if (!confirmed) {
        return;
    }

    deletingId.value = message.id;
    errorMessage.value = "";

    const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", message.id);

    if (error) {
        console.error("Message delete error:", error);
        errorMessage.value =
            "Não foi possível eliminar a mensagem.";
        deletingId.value = null;
        return;
    }

    messages.value = messages.value.filter(
        (item) => item.id !== message.id
    );

    if (selectedMessage.value?.id === message.id) {
        selectedMessage.value = null;
    }

    deletingId.value = null;
};

const newMessagesCount = computed(() => {
    return messages.value.filter(
        (message) => message.status === "new"
    ).length;
});

onMounted(() => {
    loadMessages();
});
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
            <div>
                <h1
                    class="text-3xl font-theme-heading font-bold text-gray-900"
                >
                    Mensagens
                </h1>

                <p class="text-gray-500 mt-1">
                    Gere as mensagens recebidas através do site.
                </p>
            </div>

            <div
                class="bg-theme-primary text-white rounded-lg px-4 py-3"
            >
                <span class="text-sm">
                    Novas mensagens:
                </span>

                <span class="font-bold ml-2">
                    {{ newMessagesCount }}
                </span>
            </div>
        </div>

        <!-- Error -->
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
            A carregar mensagens...
        </div>

        <!-- Empty -->
        <div
            v-else-if="messages.length === 0"
            class="bg-white rounded-xl border border-gray-200 p-10 text-center"
        >
            <h2
                class="text-xl font-theme-heading font-semibold text-gray-900"
            >
                Não existem mensagens
            </h2>

            <p class="text-gray-500 mt-2">
                As mensagens enviadas através do formulário de
                contacto aparecerão aqui.
            </p>
        </div>

        <!-- Messages table -->
        <div
            v-else
            class="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th
                                class="text-left px-6 py-4 text-sm font-semibold text-gray-700"
                            >
                                Remetente
                            </th>

                            <th
                                class="text-left px-6 py-4 text-sm font-semibold text-gray-700"
                            >
                                Assunto
                            </th>

                            <th
                                class="text-left px-6 py-4 text-sm font-semibold text-gray-700"
                            >
                                Estado
                            </th>

                            <th
                                class="text-left px-6 py-4 text-sm font-semibold text-gray-700"
                            >
                                Data
                            </th>

                            <th
                                class="text-right px-6 py-4 text-sm font-semibold text-gray-700"
                            >
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="message in messages"
                            :key="message.id"
                            class="hover:bg-gray-50 transition"
                        >
                            <td class="px-6 py-4">
                                <p class="font-semibold text-gray-900">
                                    {{ message.name }}
                                </p>

                                <p class="text-sm text-gray-500">
                                    {{ message.email }}
                                </p>
                            </td>

                            <td class="px-6 py-4">
                                <p class="text-gray-900">
                                    {{ message.subject }}
                                </p>
                            </td>

                            <td class="px-6 py-4">
                                <select
                                    :value="message.status"
                                    :disabled="updatingId === message.id"
                                    @change="
                                        updateStatus(
                                            message.id,
                                            $event.target.value
                                        )
                                    "
                                    class="rounded-lg border-gray-300 text-sm focus:border-theme-primary focus:ring-theme-primary"
                                >
                                    <option
                                        v-for="option in statusOptions"
                                        :key="option.value"
                                        :value="option.value"
                                    >
                                        {{ option.label }}
                                    </option>
                                </select>
                            </td>

                            <td
                                class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"
                            >
                                {{ formatDate(message.created_at) }}
                            </td>

                            <td class="px-6 py-4">
                                <div
                                    class="flex justify-end gap-2"
                                >
                                    <button
                                        type="button"
                                        @click="openMessage(message)"
                                        class="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 transition"
                                    >
                                        Ver
                                    </button>

                                    <button
                                        type="button"
                                        :disabled="
                                            deletingId === message.id
                                        "
                                        @click="
                                            deleteMessage(message)
                                        "
                                        class="px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        {{
                                            deletingId === message.id
                                                ? "..."
                                                : "Eliminar"
                                        }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Message modal -->
        <div
            v-if="selectedMessage"
            class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            @click.self="closeMessage"
        >
            <div
                class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                <!-- Modal header -->
                <div
                    class="flex items-center justify-between px-6 py-5 border-b border-gray-200"
                >
                    <div>
                        <h2
                            class="text-2xl font-theme-heading font-bold text-gray-900"
                        >
                            {{ selectedMessage.subject }}
                        </h2>

                        <p class="text-sm text-gray-500 mt-1">
                            {{ formatDate(selectedMessage.created_at) }}
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="closeMessage"
                        class="text-gray-500 hover:text-gray-900 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <!-- Modal content -->
                <div class="p-6 space-y-6">
                    <div>
                        <p
                            class="text-sm font-semibold text-gray-500"
                        >
                            Nome
                        </p>

                        <p class="text-gray-900 mt-1">
                            {{ selectedMessage.name }}
                        </p>
                    </div>

                    <div>
                        <p
                            class="text-sm font-semibold text-gray-500"
                        >
                            Email
                        </p>

                        <a
                            :href="`mailto:${selectedMessage.email}`"
                            class="text-theme-primary hover:underline mt-1 inline-block"
                        >
                            {{ selectedMessage.email }}
                        </a>
                    </div>

                    <div>
                        <p
                            class="text-sm font-semibold text-gray-500"
                        >
                            Estado
                        </p>

                        <span
                            class="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold"
                            :class="
                                getStatusClass(
                                    selectedMessage.status
                                )
                            "
                        >
                            {{
                                getStatusLabel(
                                    selectedMessage.status
                                )
                            }}
                        </span>
                    </div>

                    <div>
                        <p
                            class="text-sm font-semibold text-gray-500 mb-2"
                        >
                            Mensagem
                        </p>

                        <div
                            class="bg-gray-50 rounded-xl p-4 text-gray-800 whitespace-pre-wrap"
                        >
                            {{ selectedMessage.message }}
                        </div>
                    </div>

                    <!-- Status buttons -->
                    <div
                        class="flex flex-wrap gap-3 pt-2"
                    >
                        <button
                            type="button"
                            @click="
                                updateStatus(
                                    selectedMessage.id,
                                    'new'
                                )
                            "
                            class="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:opacity-90 transition"
                        >
                            Marcar como nova
                        </button>

                        <button
                            type="button"
                            @click="
                                updateStatus(
                                    selectedMessage.id,
                                    'read'
                                )
                            "
                            class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:opacity-90 transition"
                        >
                            Marcar como lida
                        </button>

                        <button
                            type="button"
                            @click="
                                updateStatus(
                                    selectedMessage.id,
                                    'replied'
                                )
                            "
                            class="px-4 py-2 rounded-lg bg-green-600 text-white hover:opacity-90 transition"
                        >
                            Marcar como respondida
                        </button>
                    </div>

                    <!-- Reply -->
                    <div class="pt-2">
                        <a
                            :href="`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                                selectedMessage.subject
                            )}`"
                            class="inline-flex items-center justify-center w-full bg-theme-primary text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition"
                        >
                            Responder por email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>