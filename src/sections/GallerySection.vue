<script setup>
import { computed, onMounted, ref } from "vue";
import { supabase } from "../lib/supabase";

const galleryItems = ref([]);
const loading = ref(true);
const activeCategory = ref("Todos");

const categories = [
    "Todos",
    "Treinos",
    "Graduações",
    "Seminários",
    "Eventos",
    "Demonstrações",
    "Outros",
];

const loadGallery = async () => {
    loading.value = true;

    const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Public gallery error:", error);
        loading.value = false;
        return;
    }

    galleryItems.value = data;
    loading.value = false;
};

const filteredItems = computed(() => {
    if (activeCategory.value === "Todos") {
        return galleryItems.value;
    }

    return galleryItems.value.filter(
        (item) => item.category === activeCategory.value
    );
});

const getImageUrl = (storagePath) => {
    return supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath)
        .data.publicUrl;
};

onMounted(() => {
    loadGallery();
});
</script>

<template>
    <section
        id="gallery"
        class="py-20 bg-black text-white"
    >
        <div class="container mx-auto px-6">
            <!-- Header -->
            <div class="text-center max-w-3xl mx-auto mb-12">
                <p
                    class="text-theme-primary font-semibold uppercase tracking-widest mb-3"
                >
                    Galeria
                </p>

                <h2
                    class="text-4xl md:text-5xl font-theme-heading font-bold mb-5"
                >
                    Momentos do nosso caminho
                </h2>

                <p class="text-gray-300">
                    Treinos, graduações, seminários e momentos
                    vividos pela nossa Ohana.
                </p>
            </div>

            <!-- Categories -->
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
                            : 'border-gray-600 text-gray-300 hover:border-theme-primary hover:text-white'
                    "
                >
                    {{ category }}
                </button>
            </div>

            <!-- Loading -->
            <div
                v-if="loading"
                class="text-center py-12 text-gray-400"
            >
                A carregar a galeria...
            </div>

            <!-- Empty -->
            <div
                v-else-if="filteredItems.length === 0"
                class="text-center py-12"
            >
                <p class="text-gray-400">
                    Ainda não existem fotografias nesta categoria.
                </p>
            </div>

            <!-- Gallery -->
            <div
                v-else
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <article
                    v-for="item in filteredItems"
                    :key="item.id"
                    class="group overflow-hidden rounded-xl bg-gray-900"
                >
                    <div class="aspect-[4/3] overflow-hidden">
                        <img
                            :src="getImageUrl(item.storage_path)"
                            :alt="item.title"
                            class="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div class="p-5">
                        <p
                            class="text-theme-primary text-sm font-semibold mb-2"
                        >
                            {{ item.category }}
                        </p>

                        <h3
                            class="text-xl font-theme-heading font-semibold"
                        >
                            {{ item.title }}
                        </h3>

                        <p
                            v-if="item.description"
                            class="text-gray-400 mt-2"
                        >
                            {{ item.description }}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>