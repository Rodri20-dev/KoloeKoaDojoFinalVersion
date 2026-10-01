<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const goToAdmin = () => {
    router.push("/admin/login");
};

const mobileNav = ref(false);

const toggleMobileNav = () => {
    mobileNav.value = !mobileNav.value;
};

const closeMobileNav = () => {
    mobileNav.value = false;
};
</script>

<template>
    <!-- Navbar Start -->
    <div class="bg-theme-dark text-white">
        <div class="container mx-auto px-5">

            <header class="flex justify-between items-center py-4 md:py-8">

                <!-- Logo -->
                <div>
                    <a href="#home" v-smooth-scroll>
                        <img
                            src="/images/KoloeKoaLogo.jpeg"
                            alt="Kolo'e Koa Dojo Kenpo"
                            class="h-12 md:h-16 w-auto object-contain"
                        />
                    </a>
                </div>

                <nav>

                    <!-- Mobile Menu Toggler -->
                    <button
                        @click="toggleMobileNav"
                        type="button"
                        class="flex md:hidden focus:outline-none"
                        :aria-expanded="mobileNav"
                        aria-label="Abrir menu"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            class="h-7 w-7 fill-current"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
                            />
                        </svg>
                    </button>

                    <!-- Desktop Menu -->
                    <ul
                        class="hidden md:flex flex-col md:flex-row items-center space-x-10 font-theme-heading font-medium"
                    >

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#home" v-smooth-scroll>
                                Início
                            </a>
                        </li>

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#dojo" v-smooth-scroll>
                                O Dojo
                            </a>
                        </li>

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#kenpo" v-smooth-scroll>
                                Kenpo
                            </a>
                        </li>

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#philosophy" v-smooth-scroll>
                                Filosofia
                            </a>
                        </li>

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#kenpo-path" v-smooth-scroll>
                                O Caminho
                            </a>
                        </li>

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#lineage" v-smooth-scroll>
                                Linhagem
                            </a>
                        </li>

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#ohana" v-smooth-scroll>
                                Ohana
                            </a>
                        </li>

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#gallery" v-smooth-scroll>
                                Galeria
                            </a>
                        </li>

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#videos" v-smooth-scroll>
                                Vídeos
                            </a>
                        </li>

                        <li class="uppercase hover:text-theme-secondary transition duration-200">
                            <a href="#schedule" v-smooth-scroll>
                                Horários
                            </a>
                        </li>

                        <!-- Contact Button -->
                        <li
                            class="uppercase bg-theme-secondary px-6 py-2 text-white rounded shadow-md hover:bg-white border-2 border-theme-secondary hover:text-theme-secondary cursor-pointer transition duration-200"
                        >
                            <a href="#contact" v-smooth-scroll>
                                Contactos
                            </a>
                        </li>

                        <button
                            type="button"
                            @click="goToAdmin"
                            aria-label="Área Reservada"
                            title="Área Reservada"
                            class="flex items-center justify-center ml-4 text-white transition hover:text-theme-primary"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.8"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0"
                                />
                            </svg>
                        </button>

                    </ul>

                </nav>
            </header>

            <!-- Mobile Menu -->
            <div v-if="mobileNav">

                <div
                    class="fixed inset-0 z-50 isolate bg-black px-5 py-5 overflow-y-auto"
                >

                    <!-- Mobile Header -->
                    <div class="flex justify-between items-center">

                        <a
                            href="#home"
                            v-smooth-scroll
                            @click="closeMobileNav"
                        >
                            <img
                                src="/images/KoloeKoaLogo.jpeg"
                                alt="Kolo'e Koa Dojo Kenpo"
                                class="h-12 w-12 object-contain"
                            />
                        </a>

                        <!-- Close Button -->
                        <button
                            @click="closeMobileNav"
                            type="button"
                            class="focus:outline-none"
                            aria-label="Fechar menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                class="text-white"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                />
                            </svg>
                        </button>

                    </div>

                    <!-- Mobile Links -->
                    <ul
                        class="uppercase text-white text-sm tracking-widest items-center flex flex-col mt-8"
                    >

                        <li class="mobile-nav-item">
                            <a
                                href="#home"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                Início
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#dojo"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                O Dojo
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#kenpo"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                Kenpo
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#philosophy"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                Filosofia
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#kenpo-path"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                O Caminho
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#lineage"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                Linhagem
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#ohana"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                Ohana
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#gallery"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                Galeria
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#videos"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                Vídeos
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#schedule"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                Horários
                            </a>
                        </li>

                        <li class="mobile-nav-item">
                            <a
                                href="#contact"
                                v-smooth-scroll
                                @click="closeMobileNav"
                            >
                                Contactos
                            </a>
                        </li>
                        <button
                            type="button"
                            @click="goToAdmin"
                            class="flex items-center gap-3 w-full py-3 text-left text-white transition hover:text-theme-primary"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.8"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0"
                                />
                            </svg>

                            <span>Área Reservada</span>
                        </button>

                    </ul>

                </div>

            </div>

        </div>
    </div>

    <!-- Navbar End -->
</template>

<style scoped>
.mobile-nav-item {
    @apply hover:text-theme-secondary transition duration-200 py-3 border-b border-white w-full text-center;
}

.mobile-nav-item:first-child {
    @apply border-t;
}
</style>