<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { supabase } from "../lib/supabase";

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

const categories = [
    "Treinos",
    "Demonstrações",
    "Eventos",
    "Outros",
];

const allowedVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
];

const maxFileSize = 100 * 1024 * 1024;

const isLocalVideo = computed(() => {
    return videoType.value === "local";
});

const loadVideos = async () => {
    loading.value = true;
    errorMessage.value = "";

    const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Videos load error:", error);
        errorMessage.value =
            "Não foi possível carregar os vídeos.";
        loading.value = false;
        return;
    }

    videos.value = data;
    loading.value = false;
};

const clearPreview = () => {
    if (localPreviewUrl.value) {
        URL.revokeObjectURL(localPreviewUrl.value);
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
};

const handleVideoFileChange = (event) => {
    const file = event.target.files?.[0];

    clearPreview();
    videoFile.value = null;

    if (!file) {
        return;
    }

    if (!allowedVideoTypes.includes(file.type)) {
        errorMessage.value =
            "Formato inválido. Escolhe um vídeo MP4, WebM ou OGG.";
        event.target.value = "";
        return;
    }

    if (file.size > maxFileSize) {
        errorMessage.value =
            "O vídeo não pode ultrapassar os 100 MB.";
        event.target.value = "";
        return;
    }

    errorMessage.value = "";

    videoFile.value = file;
    localPreviewUrl.value = URL.createObjectURL(file);
};

const addVideo = async () => {
    errorMessage.value = "";
    successMessage.value = "";

    if (!title.value.trim()) {
        errorMessage.value = "O título é obrigatório.";
        return;
    }

    if (videoType.value === "local" && !videoFile.value) {
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

        /*
         * VÍDEO LOCAL
         */
        if (videoType.value === "local") {
            const file = videoFile.value;

            const extension =
                file.name.split(".").pop()?.toLowerCase() ||
                "mp4";

            const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

            const filePath = `videos/${fileName}`;

            const { error: uploadError } =
                await supabase.storage
                    .from("videos")
                    .upload(filePath, file, {
                        cacheControl: "3600",
                        upsert: false,
                    });

            if (uploadError) {
                console.error(
                    "Video upload error:",
                    uploadError
                );

                throw new Error(
                    "Não foi possível fazer upload do vídeo."
                );
            }

            finalVideoUrl = filePath;
        }

        /*
         * YOUTUBE
         */
        if (videoType.value === "youtube") {
            finalVideoUrl = videoUrl.value.trim();
        }

        const { data, error } = await supabase
            .from("videos")
            .insert({
                title: title.value.trim(),
                description:
                    description.value.trim() || null,
                category: category.value,
                video_type: videoType.value,
                video_url: finalVideoUrl,
                published: true,
            })
            .select()
            .single();

        if (error) {
            console.error(
                "Video database insert error:",
                error
            );

            /*
             * Se a BD falhar depois do upload,
             * tentamos remover o ficheiro.
             */
            if (videoType.value === "local" && finalVideoUrl) {
                await supabase.storage
                    .from("videos")
                    .remove([finalVideoUrl]);
            }

            throw new Error(
                "Não foi possível guardar o vídeo."
            );
        }

        videos.value = [data, ...videos.value];

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
        description: video.description || "",
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

const updateVideo = async () => {
    if (!editingVideo.value) {
        return;
    }

    errorMessage.value = "";
    successMessage.value = "";

    if (!editingVideo.value.title.trim()) {
        errorMessage.value = "O título é obrigatório.";
        return;
    }

    if (!editingVideo.value.video_url.trim()) {
        errorMessage.value =
            "O URL/caminho do vídeo é obrigatório.";
        return;
    }

    saving.value = true;

    try {
        const { data, error } = await supabase
            .from("videos")
            .update({
                title: editingVideo.value.title.trim(),
                description:
                    editingVideo.value.description.trim() ||
                    null,
                category: editingVideo.value.category,
                video_type: editingVideo.value.video_type,
                video_url:
                    editingVideo.value.video_url.trim(),
                published: editingVideo.value.published,
                updated_at: new Date().toISOString(),
            })
            .eq("id", editingVideo.value.id)
            .select()
            .single();

        if (error) {
            console.error(
                "Video update error:",
                error
            );

            throw new Error(
                "Não foi possível atualizar o vídeo."
            );
        }

        videos.value = videos.value.map((video) =>
            video.id === data.id ? data : video
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

const deleteVideo = async (video) => {
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
        /*
         * Se for vídeo local,
         * primeiro removemos o ficheiro do Storage.
         */
        if (
            video.video_type === "local" &&
            video.video_url
        ) {
            const { error: storageError } =
                await supabase.storage
                    .from("videos")
                    .remove([video.video_url]);

            if (storageError) {
                console.error(
                    "Video storage delete error:",
                    storageError
                );

                throw new Error(
                    "Não foi possível eliminar o ficheiro de vídeo."
                );
            }
        }

        /*
         * Depois removemos o registo da BD.
         */
        const { error: databaseError } =
            await supabase
                .from("videos")
                .delete()
                .eq("id", video.id);

        if (databaseError) {
            console.error(
                "Video database delete error:",
                databaseError
            );

            throw new Error(
                "Não foi possível eliminar o registo do vídeo."
            );
        }

        videos.value = videos.value.filter(
            (item) => item.id !== video.id
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
</script>

<template>
    <div class="p-6 md:p-8">

        <!-- Cabeçalho -->
        <div class="mb-8">
            <p
                class="text-theme-primary font-semibold uppercase tracking-widest text-sm mb-2"
            >
                Conteúdo
            </p>

            <h1
                class="text-3xl md:text-4xl font-theme-heading font-bold text-gray-900"
            >
                Vídeos
            </h1>

            <p class="text-gray-500 mt-2">
                Gere os vídeos apresentados no site.
            </p>
        </div>

        <!-- Mensagem de erro -->
        <div
            v-if="errorMessage"
            class="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4"
        >
            {{ errorMessage }}
        </div>

        <!-- Mensagem de sucesso -->
        <div
            v-if="successMessage"
            class="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4"
        >
            {{ successMessage }}
        </div>

        <!-- Adicionar vídeo -->
        <div
            class="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
            <h2
                class="text-xl font-semibold text-gray-900 mb-6"
            >
                Adicionar vídeo
            </h2>

            <form
                @submit.prevent="addVideo"
                class="space-y-5"
            >
                <!-- Título -->
                <div>
                    <label
                        for="video-title"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Título
                    </label>

                    <input
                        id="video-title"
                        v-model="title"
                        type="text"
                        placeholder="Ex.: Treino de Kenpo"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    />
                </div>

                <!-- Categoria -->
                <div>
                    <label
                        for="video-category"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Categoria
                    </label>

                    <select
                        id="video-category"
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

                <!-- Tipo -->
                <div>
                    <label
                        for="video-type"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Origem do vídeo
                    </label>

                    <select
                        id="video-type"
                        v-model="videoType"
                        @change="
                            videoFile = null;
                            videoUrl = '';
                            clearPreview();
                        "
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    >
                        <option value="local">
                            Vídeo local
                        </option>

                        <option value="youtube">
                            YouTube
                        </option>
                    </select>
                </div>

                <!-- Vídeo local -->
                <div v-if="videoType === 'local'">
                    <label
                        for="video-file"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Ficheiro de vídeo
                    </label>

                    <input
                        id="video-file"
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        @change="handleVideoFileChange"
                        class="w-full rounded-lg border border-gray-300 p-2 bg-white"
                    />

                    <p class="text-xs text-gray-500 mt-2">
                        MP4, WebM ou OGG — máximo 100 MB.
                    </p>

                    <!-- Nome do ficheiro -->
                    <p
                        v-if="videoFile"
                        class="text-sm text-gray-700 mt-3"
                    >
                        Ficheiro selecionado:
                        <strong>
                            {{ videoFile.name }}
                        </strong>
                    </p>

                    <!-- Preview -->
                    <div
                        v-if="localPreviewUrl"
                        class="mt-5 max-w-2xl"
                    >
                        <video
                            :src="localPreviewUrl"
                            controls
                            class="w-full rounded-lg bg-black"
                        ></video>
                    </div>
                </div>

                <!-- YouTube -->
                <div v-else>
                    <label
                        for="video-url"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        URL do YouTube
                    </label>

                    <input
                        id="video-url"
                        v-model="videoUrl"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    />

                    <p class="text-xs text-gray-500 mt-2">
                        Introduz o URL normal do vídeo no YouTube.
                    </p>
                </div>

                <!-- Descrição -->
                <div>
                    <label
                        for="video-description"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Descrição
                    </label>

                    <textarea
                        id="video-description"
                        v-model="description"
                        rows="4"
                        placeholder="Descrição opcional..."
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    ></textarea>
                </div>

                <!-- Submit -->
                <button
                    type="submit"
                    :disabled="saving"
                    class="px-5 py-3 rounded-lg bg-theme-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                    {{
                        saving
                            ? "A guardar..."
                            : "Adicionar vídeo"
                    }}
                </button>
            </form>
        </div>

        <!-- Editar -->
        <div
            v-if="editingVideo"
            class="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
            <div
                class="flex items-center justify-between mb-6"
            >
                <div>
                    <h2
                        class="text-xl font-semibold text-gray-900"
                    >
                        Editar vídeo
                    </h2>

                    <p
                        class="text-sm text-gray-500 mt-1"
                    >
                        Altera as informações do vídeo.
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

            <form
                @submit.prevent="updateVideo"
                class="space-y-5"
            >
                <div>
                    <label
                        for="edit-video-title"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Título
                    </label>

                    <input
                        id="edit-video-title"
                        v-model="editingVideo.title"
                        type="text"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    />
                </div>

                <div>
                    <label
                        for="edit-video-category"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Categoria
                    </label>

                    <select
                        id="edit-video-category"
                        v-model="editingVideo.category"
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

                <div>
                    <label
                        for="edit-video-type"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Origem do vídeo
                    </label>

                    <select
                        id="edit-video-type"
                        v-model="editingVideo.video_type"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    >
                        <option value="local">
                            Vídeo local
                        </option>

                        <option value="youtube">
                            YouTube
                        </option>
                    </select>
                </div>

                <!-- Local existente -->
                <div
                    v-if="editingVideo.video_type === 'local'"
                >
                    <p
                        class="text-sm font-medium text-gray-700 mb-2"
                    >
                        Ficheiro atual
                    </p>

                    <p
                        class="text-sm text-gray-500 break-all bg-gray-50 rounded-lg p-3"
                    >
                        {{ editingVideo.video_url }}
                    </p>

                    <p
                        class="text-xs text-gray-500 mt-2"
                    >
                        Nesta fase, a edição altera os dados do
                        vídeo. A substituição do ficheiro será
                        adicionada depois.
                    </p>
                </div>

                <!-- YouTube -->
                <div v-else>
                    <label
                        for="edit-video-url"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        URL do YouTube
                    </label>

                    <input
                        id="edit-video-url"
                        v-model="editingVideo.video_url"
                        type="url"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    />
                </div>

                <div>
                    <label
                        for="edit-video-description"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Descrição
                    </label>

                    <textarea
                        id="edit-video-description"
                        v-model="editingVideo.description"
                        rows="4"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    ></textarea>
                </div>

                <label
                    class="flex items-center gap-3 cursor-pointer"
                >
                    <input
                        v-model="editingVideo.published"
                        type="checkbox"
                        class="rounded border-gray-300 text-theme-primary focus:ring-theme-primary"
                    />

                    <span
                        class="text-sm font-medium text-gray-700"
                    >
                        Publicar vídeo no site
                    </span>
                </label>

                <div
                    class="flex flex-col sm:flex-row gap-3"
                >
                    <button
                        type="submit"
                        :disabled="saving"
                        class="px-5 py-3 rounded-lg bg-theme-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {{
                            saving
                                ? "A guardar..."
                                : "Guardar alterações"
                        }}
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

        <!-- Lista -->
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
            >
                <div>
                    <h2
                        class="text-xl font-semibold text-gray-900"
                    >
                        Vídeos existentes
                    </h2>

                    <p
                        class="text-sm text-gray-500 mt-1"
                    >
                        {{ videos.length }} vídeo(s)
                    </p>
                </div>
            </div>

            <div
                v-if="loading"
                class="text-center py-12 text-gray-500"
            >
                A carregar vídeos...
            </div>

            <div
                v-else-if="videos.length === 0"
                class="text-center py-12 text-gray-500"
            >
                Ainda não existem vídeos.
            </div>

            <div
                v-else
                class="space-y-5"
            >
                <article
                    v-for="video in videos"
                    :key="video.id"
                    class="border border-gray-200 rounded-xl p-5"
                >
                    <div
                        class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5"
                    >
                        <div class="flex-1">
                            <div
                                class="flex flex-wrap items-center gap-2 mb-2"
                            >
                                <span
                                    class="text-xs font-semibold uppercase tracking-wide text-theme-primary"
                                >
                                    {{ video.category }}
                                </span>

                                <span
                                    class="text-xs px-2 py-1 rounded-full"
                                    :class="
                                        video.published
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                    "
                                >
                                    {{
                                        video.published
                                            ? "Publicado"
                                            : "Oculto"
                                    }}
                                </span>

                                <span
                                    class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                                >
                                    {{
                                        video.video_type ===
                                        "youtube"
                                            ? "YouTube"
                                            : "Local"
                                    }}
                                </span>
                            </div>

                            <h3
                                class="text-lg font-semibold text-gray-900"
                            >
                                {{ video.title }}
                            </h3>

                            <p
                                v-if="video.description"
                                class="text-gray-500 mt-2"
                            >
                                {{ video.description }}
                            </p>

                            <p
                                class="text-sm text-gray-400 mt-3 break-all"
                            >
                                {{ video.video_url }}
                            </p>
                        </div>

                        <div
                            class="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-40"
                        >
                            <button
                                type="button"
                                @click="startEditing(video)"
                                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                @click="deleteVideo(video)"
                                :disabled="
                                    deletingId === video.id
                                "
                                class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {{
                                    deletingId === video.id
                                        ? "A eliminar..."
                                        : "Eliminar"
                                }}
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>