<script setup>
import { ref, computed } from "vue";

// Categories available for gallery filtering
const categories = [
    "Todos",
    "Treinos",
    "Graduações",
    "Seminários",
    "Eventos",
    "Demonstrações",
    "Outros",
];

// Selected category
const selectedCategory = ref("Todos");

// Gallery items
// These will later be loaded dynamically from Supabase
const galleryItems = ref([
    {
        id: 1,
        type: "image",
        url: "",
        title: "Treino no dojo",
        category: "Treinos",
    },
    {
        id: 2,
        type: "image",
        url: "",
        title: "Graduação",
        category: "Graduações",
    },
    {
        id: 3,
        type: "image",
        url: "",
        title: "Seminário",
        category: "Seminários",
    },
    {
        id: 4,
        type: "image",
        url: "",
        title: "Evento",
        category: "Eventos",
    },
    {
        id: 5,
        type: "image",
        url: "",
        title: "Demonstração",
        category: "Demonstrações",
    },
    {
        id: 6,
        type: "image",
        url: "",
        title: "Momentos do dojo",
        category: "Outros",
    },
]);

// Filter gallery according to selected category
const filteredGallery = computed(() => {
    if (selectedCategory.value === "Todos") {
        return galleryItems.value;
    }

    return galleryItems.value.filter(
        (item) => item.category === selectedCategory.value
    );
});
</script>

<template>
    <!-- Gallery Section Start -->
    <section id="gallery" class="bg-white text-black py-24">
        <div class="container mx-auto px-5">

            <!-- Section Header -->
            <div class="max-w-4xl mx-auto text-center">
                <p
                    class="font-theme-heading text-theme-primary uppercase tracking-widest font-semibold mb-4"
                >
                    Momentos do dojo
                </p>

                <h2
                    class="text-4xl xl:text-5xl font-bold font-theme-heading mb-8"
                >
                    Galeria
                </h2>

                <p
                    class="font-theme-content text-lg lg:text-xl leading-relaxed text-black/80"
                >
                    Um olhar sobre os treinos, as graduações, os eventos e os
                    momentos que fazem parte do Kolo'e Koa Dojo Kenpo.
                </p>
            </div>

            <!-- Category Filters -->
            <div
                class="flex flex-wrap justify-center gap-3 mt-12"
            >
                <button
                    v-for="category in categories"
                    :key="category"
                    type="button"
                    @click="selectedCategory = category"
                    class="px-5 py-2 border border-theme-primary font-theme-heading font-semibold transition duration-300"
                    :class="
                        selectedCategory === category
                            ? 'bg-theme-primary text-white'
                            : 'bg-transparent text-black hover:bg-theme-primary hover:text-white'
                    "
                >
                    {{ category }}
                </button>
            </div>

            <!-- Gallery Grid -->
            <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-7xl mx-auto"
            >
                <article
                    v-for="item in filteredGallery"
                    :key="item.id"
                    class="group aspect-square overflow-hidden border-2 border-theme-primary relative"
                >
                    <!-- Image -->
                    <img
                        v-if="item.type === 'image' && item.url"
                        :src="item.url"
                        :alt="item.title"
                        class="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <!-- Empty State -->
                    <div
                        v-else
                        class="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-center p-6"
                    >
                        <span
                            class="text-theme-primary text-3xl font-bold font-theme-heading mb-3"
                        >
                            KENPO
                        </span>

                        <span
                            class="font-theme-heading text-black/50"
                        >
                            {{ item.category }}
                        </span>
                    </div>

                    <!-- Image Information -->
                    <div
                        v-if="item.url"
                        class="absolute inset-x-0 bottom-0 bg-black/70 text-white p-4 opacity-0 group-hover:opacity-100 transition duration-300"
                    >
                        <p class="font-theme-heading font-semibold">
                            {{ item.title }}
                        </p>

                        <p class="font-theme-content text-sm text-white/80">
                            {{ item.category }}
                        </p>
                    </div>
                </article>
            </div>

            <!-- Empty Gallery Message -->
            <div
                v-if="filteredGallery.length === 0"
                class="text-center mt-16"
            >
                <p class="font-theme-content text-lg text-black/60">
                    Ainda não existem fotografias nesta categoria.
                </p>
            </div>

            <!-- Gallery Information -->
            <div class="max-w-3xl mx-auto text-center mt-20">
                <div
                    class="w-24 h-1 bg-theme-primary mx-auto mb-8"
                ></div>

                <p
                    class="font-theme-content text-lg lg:text-xl leading-relaxed text-black/70"
                >
                    A galeria será atualizada regularmente com fotografias
                    dos treinos, graduações, seminários, eventos e
                    demonstrações do nosso dojo.
                </p>
            </div>

        </div>
    </section>
    <!-- Gallery Section End -->
</template>