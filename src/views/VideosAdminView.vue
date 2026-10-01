<script setup>
import { useVideos } from "../composables/useVideos";

const {
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
    changeVideoType,
    handleVideoFileChange,
    addVideo,
    startEditing,
    cancelEditing,
    saveEditing,
    deleteItem,
} = useVideos();
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
                        @change="changeVideoType"
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
                <div v-if="isLocalVideo">
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
                @submit.prevent="saveEditing"
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
                                @click="deleteItem(video)"
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