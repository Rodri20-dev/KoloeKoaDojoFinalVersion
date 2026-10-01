import { onMounted, ref } from "vue";

import {
    getGalleryItems,
    getGalleryImageUrl,
    uploadGalleryImage,
    createGalleryItem,
    updateGalleryItem as updateGalleryItemService,
    deleteGalleryItem as deleteGalleryItemService,
} from "../services/galleryService";

const categories = [
    "Treinos",
    "Graduações",
    "Seminários",
    "Eventos",
    "Demonstrações",
    "Outros",
];

export const useGallery = () => {
    const galleryItems = ref([]);

    const loading = ref(true);
    const saving = ref(false);
    const deletingId = ref(null);

    const editingItem = ref(null);

    const showForm = ref(false);

    const title = ref("");
    const description = ref("");
    const category = ref("Treinos");
    const selectedFile = ref(null);

    const errorMessage = ref("");
    const successMessage = ref("");

    const loadGalleryItems = async () => {
        loading.value = true;
        errorMessage.value = "";

        const { data, error } = await getGalleryItems();

        if (error) {
            console.error("Gallery load error:", error);

            errorMessage.value =
                "Não foi possível carregar a galeria.";

            loading.value = false;

            return;
        }

        galleryItems.value = data || [];

        loading.value = false;
    };

    const handleFileChange = (event) => {
        selectedFile.value =
            event.target.files?.[0] || null;
    };

    const resetForm = () => {
        title.value = "";
        description.value = "";
        category.value = "Treinos";
        selectedFile.value = null;

        const fileInput =
            document.getElementById("gallery-file");

        if (fileInput) {
            fileInput.value = "";
        }
    };

    const closeForm = () => {
        if (saving.value) {
            return;
        }

        showForm.value = false;

        resetForm();

        errorMessage.value = "";
        successMessage.value = "";
    };

    const handleSubmit = async () => {
        errorMessage.value = "";
        successMessage.value = "";

        if (!title.value.trim()) {
            errorMessage.value =
                "Indica um título para a fotografia.";

            return;
        }

        if (!selectedFile.value) {
            errorMessage.value =
                "Seleciona uma fotografia.";

            return;
        }

        saving.value = true;

        try {
            const uploadResult =
                await uploadGalleryImage(
                    selectedFile.value
                );

            if (uploadResult.error) {
                throw uploadResult.error;
            }

            const createResult =
                await createGalleryItem({
                    title: title.value.trim(),
                    description:
                        description.value.trim() || null,
                    category: category.value,
                    storagePath: uploadResult.data,
                });

            if (createResult.error) {
                throw createResult.error;
            }

            galleryItems.value = [
                createResult.data,
                ...galleryItems.value,
            ];

            successMessage.value =
                "Fotografia adicionada com sucesso.";

            resetForm();

            setTimeout(() => {
                showForm.value = false;
                successMessage.value = "";
            }, 1200);
        } catch (error) {
            errorMessage.value =
                error.message ||
                "Ocorreu um erro ao adicionar a fotografia.";
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

    const saveEditing = async () => {
        if (!editingItem.value) {
            return;
        }

        errorMessage.value = "";
        successMessage.value = "";

        if (!editingItem.value.title.trim()) {
            errorMessage.value =
                "O título é obrigatório.";

            return;
        }

        saving.value = true;

        try {
            const { data, error } =
                await updateGalleryItemService({
                    id: editingItem.value.id,
                    title: editingItem.value.title.trim(),
                    description:
                        editingItem.value.description.trim() ||
                        null,
                    category: editingItem.value.category,
                    published:
                        editingItem.value.published,
                });

            if (error) {
                throw error;
            }

            galleryItems.value =
                galleryItems.value.map((item) =>
                    item.id === data.id
                        ? data
                        : item
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

    const deleteItem = async (item) => {
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
            const { error } =
                await deleteGalleryItemService({
                    id: item.id,
                    storagePath: item.storage_path,
                });

            if (error) {
                throw error;
            }

            galleryItems.value =
                galleryItems.value.filter(
                    (galleryItem) =>
                        galleryItem.id !== item.id
                );

            successMessage.value =
                "Fotografia eliminada com sucesso.";
        } catch (error) {
            errorMessage.value =
                error.message ||
                "Ocorreu um erro ao eliminar a fotografia.";
        } finally {
            deletingId.value = null;
        }
    };

    const getImageUrl = (storagePath) => {
        return getGalleryImageUrl(storagePath);
    };

    onMounted(() => {
        loadGalleryItems();
    });

    return {
        galleryItems,
        loading,
        saving,
        deletingId,
        editingItem,
        showForm,
        title,
        description,
        category,
        selectedFile,
        categories,
        errorMessage,
        successMessage,
        handleFileChange,
        resetForm,
        closeForm,
        handleSubmit,
        startEditing,
        cancelEditing,
        saveEditing,
        deleteItem,
        getImageUrl,
    };
};