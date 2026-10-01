import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
} from "vue";

import {
    getVideos,
    uploadVideoFile,
    createVideo,
    updateVideo as updateVideoService,
    deleteVideo as deleteVideoService,
} from "../services/videoService";

const categories = [
    "Treinos",
    "Demonstrações",
    "Eventos",
    "Outros",
];

export const useVideos = () => {
    const videos = ref([]);

    const title = ref("");
    const description = ref("");
    const category = ref("Treinos");

    const videoType = ref("local");
    const videoFile = ref(null);
    const videoUrl = ref("");

    const editingVideo = ref(null);

    const loading = ref(true);
    const saving = ref(false);
    const deletingId = ref(null);

    const errorMessage = ref("");
    const successMessage = ref("");

    const localPreviewUrl = ref(null);

    const isLocalVideo = computed(() => {
        return videoType.value === "local";
    });

    const loadVideos = async () => {
        loading.value = true;
        errorMessage.value = "";

        const { data, error } = await getVideos();

        if (error) {
            console.error(
                "Videos load error:",
                error
            );

            errorMessage.value =
                "Não foi possível carregar os vídeos.";

            loading.value = false;

            return;
        }

        videos.value = data || [];

        loading.value = false;
    };

    const clearPreview = () => {
        if (localPreviewUrl.value) {
            URL.revokeObjectURL(
                localPreviewUrl.value
            );

            localPreviewUrl.value = null;
        }
    };

    const resetForm = () => {
        title.value = "";
        description.value = "";
        category.value = "Treinos";
        videoType.value = "local";
        videoFile.value = null;
        videoUrl.value = "";

        clearPreview();

        const fileInput =
            document.getElementById("video-file");

        if (fileInput) {
            fileInput.value = "";
        }
    };

    const changeVideoType = () => {
        videoFile.value = null;
        videoUrl.value = "";

        clearPreview();

        errorMessage.value = "";
    };

    const handleVideoFileChange = (event) => {
        const file =
            event.target.files?.[0];

        clearPreview();

        videoFile.value = null;

        if (!file) {
            return;
        }

        videoFile.value = file;

        localPreviewUrl.value =
            URL.createObjectURL(file);

        errorMessage.value = "";
    };

    const addVideo = async () => {
        errorMessage.value = "";
        successMessage.value = "";

        if (!title.value.trim()) {
            errorMessage.value =
                "O título é obrigatório.";

            return;
        }

        if (
            videoType.value === "local" &&
            !videoFile.value
        ) {
            errorMessage.value =
                "Seleciona um ficheiro de vídeo.";

            return;
        }

        if (
            videoType.value === "youtube" &&
            !videoUrl.value.trim()
        ) {
            errorMessage.value =
                "O URL do YouTube é obrigatório.";

            return;
        }

        saving.value = true;

        try {
            let finalVideoUrl = "";

            if (videoType.value === "local") {
                const uploadResult =
                    await uploadVideoFile(
                        videoFile.value
                    );

                if (uploadResult.error) {
                    throw uploadResult.error;
                }

                finalVideoUrl =
                    uploadResult.data;
            }

            if (videoType.value === "youtube") {
                finalVideoUrl =
                    videoUrl.value.trim();
            }

            const { data, error } =
                await createVideo({
                    title: title.value.trim(),
                    description:
                        description.value.trim() ||
                        null,
                    category: category.value,
                    videoType: videoType.value,
                    videoUrl: finalVideoUrl,
                });

            if (error) {
                throw error;
            }

            videos.value = [
                data,
                ...videos.value,
            ];

            resetForm();

            successMessage.value =
                "Vídeo adicionado com sucesso.";
        } catch (error) {
            errorMessage.value =
                error.message ||
                "Ocorreu um erro ao adicionar o vídeo.";
        } finally {
            saving.value = false;
        }
    };

    const startEditing = (video) => {
        editingVideo.value = {
            id: video.id,
            title: video.title,
            description:
                video.description || "",
            category: video.category,
            video_type: video.video_type,
            video_url: video.video_url,
            published: video.published,
        };

        errorMessage.value = "";
        successMessage.value = "";
    };

    const cancelEditing = () => {
        editingVideo.value = null;
        errorMessage.value = "";
    };

    const saveEditing = async () => {
        if (!editingVideo.value) {
            return;
        }

        errorMessage.value = "";
        successMessage.value = "";

        if (!editingVideo.value.title.trim()) {
            errorMessage.value =
                "O título é obrigatório.";

            return;
        }

        if (
            !editingVideo.value.video_url.trim()
        ) {
            errorMessage.value =
                "O URL/caminho do vídeo é obrigatório.";

            return;
        }

        saving.value = true;

        try {
            const { data, error } =
                await updateVideoService({
                    id: editingVideo.value.id,
                    title:
                        editingVideo.value.title.trim(),
                    description:
                        editingVideo.value.description.trim() ||
                        null,
                    category:
                        editingVideo.value.category,
                    videoType:
                        editingVideo.value.video_type,
                    videoUrl:
                        editingVideo.value.video_url.trim(),
                    published:
                        editingVideo.value.published,
                });

            if (error) {
                throw error;
            }

            videos.value =
                videos.value.map((video) =>
                    video.id === data.id
                        ? data
                        : video
                );

            editingVideo.value = null;

            successMessage.value =
                "Vídeo atualizado com sucesso.";
        } catch (error) {
            errorMessage.value =
                error.message ||
                "Ocorreu um erro ao atualizar o vídeo.";
        } finally {
            saving.value = false;
        }
    };

    const deleteItem = async (video) => {
        const confirmed = window.confirm(
            `Tens a certeza que queres eliminar "${video.title}"?`
        );

        if (!confirmed) {
            return;
        }

        errorMessage.value = "";
        successMessage.value = "";

        deletingId.value = video.id;

        try {
            const { error } =
                await deleteVideoService({
                    id: video.id,
                    videoType: video.video_type,
                    videoUrl: video.video_url,
                });

            if (error) {
                throw error;
            }

            videos.value =
                videos.value.filter(
                    (item) =>
                        item.id !== video.id
                );

            successMessage.value =
                "Vídeo eliminado com sucesso.";
        } catch (error) {
            errorMessage.value =
                error.message ||
                "Ocorreu um erro ao eliminar o vídeo.";
        } finally {
            deletingId.value = null;
        }
    };

    onMounted(() => {
        loadVideos();
    });

    onBeforeUnmount(() => {
        clearPreview();
    });

    return {
        videos,
        title,
        description,
        category,
        videoType,
        videoFile,
        videoUrl,
        editingVideo,
        loading,
        saving,
        deletingId,
        errorMessage,
        successMessage,
        localPreviewUrl,
        categories,
        isLocalVideo,
        clearPreview,
        resetForm,
        changeVideoType,
        handleVideoFileChange,
        addVideo,
        startEditing,
        cancelEditing,
        saveEditing,
        deleteItem,
    };
};