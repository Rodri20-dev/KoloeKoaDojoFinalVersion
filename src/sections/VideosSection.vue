<script setup>
import { computed, onMounted, ref } from "vue";
import { supabase } from "../lib/supabase";

const videos = ref([]);
const loading = ref(true);

const activeCategory = ref("Todos");

const categories = [
    "Todos",
    "Treinos",
    "Demonstrações",
    "Eventos",
    "Outros",
];

const loadVideos = async () => {
    loading.value = true;

    const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Public videos error:", error);
        loading.value = false;
        return;
    }

    videos.value = data;
    loading.value = false;
};

const filteredVideos = computed(() => {
    if (activeCategory.value === "Todos") {
        return videos.value;
    }

    return videos.value.filter(
        (video) => video.category === activeCategory.value
    );
});

const getLocalVideoUrl = (storagePath) => {
    return supabase.storage
        .from("videos")
        .getPublicUrl(storagePath)
        .data.publicUrl;
};

const getYoutubeEmbedUrl = (url) => {
    try {
        const parsedUrl = new URL(url);

        /*
         * URL normal:
         * https://www.youtube.com/watch?v=ABC123
         */
        if (
            parsedUrl.hostname === "www.youtube.com" ||
            parsedUrl.hostname === "youtube.com"
        ) {
            const videoId = parsedUrl.searchParams.get("v");

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        /*
         * URL curta:
         * https://youtu.be/ABC123
         */
        if (parsedUrl.hostname === "youtu.be") {
            const videoId = parsedUrl.pathname.slice(1);

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        /*
         * Se já for um URL de embed
         */
        if (
            parsedUrl.hostname === "www.youtube.com" ||
            parsedUrl.hostname === "youtube.com"
        ) {
            if (parsedUrl.pathname.startsWith("/embed/")) {
                return url;
            }
        }

        return null;
    } catch {
        return null;
    }
};

onMounted(() => {
    loadVideos();
});
</script>

<template>
    <section
        id="videos"
        class="py-20 bg-white text-black"
    >
        <div class="container mx-auto px-6">

            <!-- Cabeçalho -->
            <div
                class="text-center max-w-3xl mx-auto mb-12"
            >
                <p
                    class="text-theme-primary font-semibold uppercase tracking-widest mb-3"
                >
                    Vídeos
                </p>

                <h2
                    class="text-4xl md:text-5xl font-theme-heading font-bold mb-5"
                >
                    Momentos do nosso caminho
                </h2>

                <p class="text-gray-600">
                    Treinos, demonstrações, eventos e outros
                    momentos vividos pela nossa Ohana.
                </p>
            </div>

            <!-- Categorias -->
            <div
                class="flex flex-wrap justify-center gap-3 mb-10"
            >
                <button
                    v-for="category in categories"
                    :key="category"
                    type="button"
                    @click="activeCategory = category"
                    class="px-4 py-2 rounded-full border transition"
                    :class="
                        activeCategory === category
                            ? 'bg-theme-primary border-theme-primary text-white'
                            : 'border-gray-300 text-gray-600 hover:border-theme-primary hover:text-black'
                    "
                >
                    {{ category }}
                </button>
            </div>

            <!-- Loading -->
            <div
                v-if="loading"
                class="text-center py-12 text-gray-500"
            >
                A carregar os vídeos...
            </div>

            <!-- Sem vídeos -->
            <div
                v-else-if="filteredVideos.length === 0"
                class="text-center py-12"
            >
                <p class="text-gray-500">
                    Ainda não existem vídeos nesta categoria.
                </p>
            </div>

            <!-- Vídeos -->
            <div
                v-else
                class="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                <article
                    v-for="video in filteredVideos"
                    :key="video.id"
                    class="bg-gray-100 rounded-xl overflow-hidden shadow-sm"
                >
                    <!-- Área do vídeo -->
                    <div
                        class="aspect-video bg-black overflow-hidden"
                    >
                        <!-- Vídeo local -->
                        <video
                            v-if="video.video_type === 'local'"
                            :src="
                                getLocalVideoUrl(
                                    video.video_url
                                )
                            "
                            controls
                            preload="metadata"
                            class="w-full h-full object-contain"
                        ></video>

                        <!-- YouTube -->
                        <iframe
                            v-else-if="
                                video.video_type === 'youtube' &&
                                getYoutubeEmbedUrl(
                                    video.video_url
                                )
                            "
                            :src="
                                getYoutubeEmbedUrl(
                                    video.video_url
                                )
                            "
                            :title="video.title"
                            class="w-full h-full"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                        ></iframe>

                        <!-- URL inválido -->
                        <div
                            v-else
                            class="w-full h-full flex items-center justify-center text-gray-400 px-6 text-center"
                        >
                            Não foi possível carregar este
                            vídeo.
                        </div>
                    </div>

                    <!-- Informação -->
                    <div class="p-6">
                        <p
                            class="text-theme-primary text-sm font-semibold uppercase tracking-wide mb-2"
                        >
                            {{ video.category }}
                        </p>

                        <h3
                            class="text-2xl font-theme-heading font-semibold"
                        >
                            {{ video.title }}
                        </h3>

                        <p
                            v-if="video.description"
                            class="text-gray-600 mt-3"
                        >
                            {{ video.description }}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>