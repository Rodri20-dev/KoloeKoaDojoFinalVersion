<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../lib/supabase";

const galleryItems = ref([]);

const loading = ref(true);
const editingItem = ref(null);
const saving = ref(false);

const errorMessage = ref("");
const successMessage = ref("");

const showForm = ref(false);

const title = ref("");
const description = ref("");
const category = ref("Treinos");
const selectedFile = ref(null);

const categories = [
    "Treinos",
    "Graduações",
    "Seminários",
    "Eventos",
    "Demonstrações",
    "Outros",
];

const loadGalleryItems = async () => {
    loading.value = true;
    errorMessage.value = "";

    const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Gallery error:", error);
        errorMessage.value = "Não foi possível carregar a galeria.";
        loading.value = false;
        return;
    }

    galleryItems.value = data;
    loading.value = false;
};

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0] || null;
};

const resetForm = () => {
    title.value = "";
    description.value = "";
    category.value = "Treinos";
    selectedFile.value = null;

    const fileInput = document.getElementById("gallery-file");

    if (fileInput) {
        fileInput.value = "";
    }
};

const closeForm = () => {
    if (saving.value) return;

    showForm.value = false;
    resetForm();
    errorMessage.value = "";
    successMessage.value = "";
};

const handleSubmit = async () => {
    errorMessage.value = "";
    successMessage.value = "";

    if (!title.value.trim()) {
        errorMessage.value = "Indica um título para a fotografia.";
        return;
    }

    if (!selectedFile.value) {
        errorMessage.value = "Seleciona uma fotografia.";
        return;
    }

    saving.value = true;

    try {
        const file = selectedFile.value;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            throw new Error(
                "Formato inválido. Utiliza JPG, PNG ou WebP."
            );
        }

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            throw new Error(
                "A fotografia não pode ultrapassar os 10 MB."
            );
        }

        const fileExtension = file.name.split(".").pop();

        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            throw new Error(
                "Não foi possível fazer o upload da fotografia."
            );
        }

        const { error: databaseError } = await supabase
            .from("gallery_items")
            .insert({
                title: title.value.trim(),
                description: description.value.trim() || null,
                category: category.value,
                storage_path: filePath,
                published: true,
            });

        if (databaseError) {
            console.error("Database insert error:", databaseError);

            await supabase.storage
                .from("gallery")
                .remove([filePath]);

            throw new Error(
                "A fotografia foi enviada, mas não foi possível guardar os seus dados."
            );
        }

        successMessage.value =
            "Fotografia adicionada com sucesso.";

        await loadGalleryItems();

        resetForm();

        setTimeout(() => {
            showForm.value = false;
            successMessage.value = "";
        }, 1200);
    } catch (error) {
        errorMessage.value =
            error.message || "Ocorreu um erro ao adicionar a fotografia.";
    } finally {
        saving.value = false;
    }
};

const startEditing = (item) => {
    editingItem.value = {
        id: item.id,
        title: item.title,
        description: item.description || "",
        category: item.category,
        published: item.published,
    };

    errorMessage.value = "";
    successMessage.value = "";
};

const cancelEditing = () => {
    editingItem.value = null;
    errorMessage.value = "";
};

const updateGalleryItem = async () => {
    if (!editingItem.value) {
        return;
    }

    errorMessage.value = "";
    successMessage.value = "";

    if (!editingItem.value.title.trim()) {
        errorMessage.value = "O título é obrigatório.";
        return;
    }

    saving.value = true;

    try {
        const { data, error } = await supabase
            .from("gallery_items")
            .update({
                title: editingItem.value.title.trim(),
                description:
                    editingItem.value.description.trim() || null,
                category: editingItem.value.category,
                published: editingItem.value.published,
                updated_at: new Date().toISOString(),
            })
            .eq("id", editingItem.value.id)
            .select()
            .single();

        if (error) {
            console.error("Gallery update error:", error);

            throw new Error(
                "Não foi possível atualizar a fotografia."
            );
        }

        galleryItems.value = galleryItems.value.map((item) =>
            item.id === data.id ? data : item
        );

        editingItem.value = null;

        successMessage.value =
            "Fotografia atualizada com sucesso.";
    } catch (error) {
        errorMessage.value =
            error.message ||
            "Ocorreu um erro ao atualizar a fotografia.";
    } finally {
        saving.value = false;
    }
};

const deletingId = ref(null);

const deleteGalleryItem = async (item) => {
    const confirmed = window.confirm(
        `Tens a certeza que queres eliminar "${item.title}"?`
    );

    if (!confirmed) {
        return;
    }

    errorMessage.value = "";
    successMessage.value = "";
    deletingId.value = item.id;

    try {
        // 1. Apagar o ficheiro do Storage
        const { error: storageError } = await supabase.storage
            .from("gallery")
            .remove([item.storage_path]);

        if (storageError) {
            console.error("Storage delete error:", storageError);

            throw new Error(
                "Não foi possível eliminar a fotografia do Storage."
            );
        }

        // 2. Apagar o registo da base de dados
        const { error: databaseError } = await supabase
            .from("gallery_items")
            .delete()
            .eq("id", item.id);

        if (databaseError) {
            console.error("Database delete error:", databaseError);

            throw new Error(
                "A fotografia foi removida do Storage, mas não foi possível remover o registo da galeria."
            );
        }

        // 3. Atualizar a lista
        galleryItems.value = galleryItems.value.filter(
            (galleryItem) => galleryItem.id !== item.id
        );

        successMessage.value =
            "Fotografia eliminada com sucesso.";
    } catch (error) {
        errorMessage.value =
            error.message || "Ocorreu um erro ao eliminar a fotografia.";
    } finally {
        deletingId.value = null;
    }
};
onMounted(() => {
    loadGalleryItems();
});
</script>

<template>
    <div>
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-theme-heading font-bold text-black">
                    Galeria
                </h1>

                <p class="text-gray-500 mt-1">
                    Gere as fotografias apresentadas no site.
                </p>
            </div>

            <button
                type="button"
                @click="showForm = true"
                class="px-5 py-3 rounded-lg bg-theme-primary text-white font-semibold hover:opacity-90 transition"
            >
                + Adicionar fotografia
            </button>
        </div>

        <!-- Messages -->
        <div
            v-if="successMessage"
            class="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4"
        >
            {{ successMessage }}
        </div>

        <div
            v-if="errorMessage && !showForm"
            class="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4"
        >
            {{ errorMessage }}
        </div>

        <!-- Add form -->
        <div
            v-if="showForm"
            class="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900">
                        Adicionar fotografia
                    </h2>

                    <p class="text-sm text-gray-500 mt-1">
                        Adiciona uma nova fotografia à galeria.
                    </p>
                </div>

                <button
                    type="button"
                    @click="closeForm"
                    class="text-gray-500 hover:text-black text-xl"
                    :disabled="saving"
                >
                    ✕
                </button>
            </div>

            <!-- Form error -->
            <div
                v-if="errorMessage"
                class="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4"
            >
                {{ errorMessage }}
            </div>

            <form
                @submit.prevent="handleSubmit"
                class="space-y-5"
            >
                <!-- Title -->
                <div>
                    <label
                        for="gallery-title"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Título
                    </label>

                    <input
                        id="gallery-title"
                        v-model="title"
                        type="text"
                        placeholder="Ex.: Treino de Kenpo"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    />
                </div>

                <!-- Category -->
                <div>
                    <label
                        for="gallery-category"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Categoria
                    </label>

                    <select
                        id="gallery-category"
                        v-model="category"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    >
                        <option
                            v-for="item in categories"
                            :key="item"
                            :value="item"
                        >
                            {{ item }}
                        </option>
                    </select>
                </div>

                <!-- Description -->
                <div>
                    <label
                        for="gallery-description"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Descrição
                    </label>

                    <textarea
                        id="gallery-description"
                        v-model="description"
                        rows="4"
                        placeholder="Descrição opcional..."
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    ></textarea>
                </div>

                <!-- File -->
                <div>
                    <label
                        for="gallery-file"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Fotografia
                    </label>

                    <input
                        id="gallery-file"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        @change="handleFileChange"
                        class="block w-full text-sm text-gray-600"
                    />

                    <p class="text-xs text-gray-400 mt-2">
                        JPG, PNG ou WebP — máximo 10 MB.
                    </p>
                </div>

                <!-- Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="submit"
                        :disabled="saving"
                        class="px-5 py-3 rounded-lg bg-theme-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {{ saving ? "A carregar..." : "Adicionar fotografia" }}
                    </button>

                    <button
                        type="button"
                        @click="closeForm"
                        :disabled="saving"
                        class="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>

        <!-- Loading -->
        <div
            v-if="loading"
            class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500"
        >
            A carregar a galeria...
        </div>

        <!-- Empty -->
        <div
            v-else-if="galleryItems.length === 0"
            class="bg-white rounded-xl shadow-sm p-10 text-center"
        >
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Ainda não existem fotografias
            </h2>

            <p class="text-gray-500">
                Quando adicionares fotografias, elas aparecerão aqui.
            </p>
        </div>

        <!-- Edit form -->
        <div
            v-if="editingItem"
            class="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900">
                        Editar fotografia
                    </h2>

                    <p class="text-sm text-gray-500 mt-1">
                        Altera as informações da fotografia.
                    </p>
                </div>

                <button
                    type="button"
                    @click="cancelEditing"
                    :disabled="saving"
                    class="text-gray-500 hover:text-black text-xl"
                >
                    ✕
                </button>
            </div>

            <div
                v-if="errorMessage"
                class="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4"
            >
                {{ errorMessage }}
            </div>

            <form
                @submit.prevent="updateGalleryItem"
                class="space-y-5"
            >
                <!-- Title -->
                <div>
                    <label
                        for="edit-gallery-title"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Título
                    </label>

                    <input
                        id="edit-gallery-title"
                        v-model="editingItem.title"
                        type="text"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    />
                </div>

                <!-- Category -->
                <div>
                    <label
                        for="edit-gallery-category"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Categoria
                    </label>

                    <select
                        id="edit-gallery-category"
                        v-model="editingItem.category"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    >
                        <option
                            v-for="item in categories"
                            :key="item"
                            :value="item"
                            :disabled="item === 'Todos'"
                        >
                            {{ item }}
                        </option>
                    </select>
                </div>

                <!-- Description -->
                <div>
                    <label
                        for="edit-gallery-description"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Descrição
                    </label>

                    <textarea
                        id="edit-gallery-description"
                        v-model="editingItem.description"
                        rows="4"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    ></textarea>
                </div>

                <!-- Published -->
                <label
                    class="flex items-center gap-3 cursor-pointer"
                >
                    <input
                        v-model="editingItem.published"
                        type="checkbox"
                        class="rounded border-gray-300 text-theme-primary focus:ring-theme-primary"
                    />

                    <span class="text-sm font-medium text-gray-700">
                        Publicar fotografia no site
                    </span>
                </label>

                <!-- Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="submit"
                        :disabled="saving"
                        class="px-5 py-3 rounded-lg bg-theme-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {{ saving ? "A guardar..." : "Guardar alterações" }}
                    </button>

                    <button
                        type="button"
                        @click="cancelEditing"
                        :disabled="saving"
                        class="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>

        <!-- Gallery -->
        <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <article
                v-for="item in galleryItems"
                :key="item.id"
                class="bg-white rounded-xl shadow-sm overflow-hidden"
            >
                <div class="aspect-video bg-gray-100">
                    <img
                        :src="supabase.storage
                            .from('gallery')
                            .getPublicUrl(item.storage_path).data.publicUrl"
                        :alt="item.title"
                        class="w-full h-full object-cover"
                    />
                </div>

                <div class="p-5">
                    <h2 class="font-semibold text-gray-900">
                        {{ item.title }}
                    </h2>

                    <p class="text-sm text-gray-500 mt-1">
                        {{ item.category }}
                    </p>

                    <p
                        v-if="item.description"
                        class="text-sm text-gray-500 mt-3"
                    >
                        {{ item.description }}
                    </p>

                    <button
                        type="button"
                        @click="startEditing(item)"
                        class="mt-5 w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Editar fotografia
                    </button>

                    <button
                        type="button"
                        @click="deleteGalleryItem(item)"
                        :disabled="deletingId === item.id"
                        class="mt-5 w-full px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    >
                        {{
                            deletingId === item.id
                                ? "A eliminar..."
                                : "Eliminar fotografia"
                        }}
                    </button>
                </div>
            </article>
        </div>
    </div>
</template>