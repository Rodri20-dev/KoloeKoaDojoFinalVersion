<script setup>
import sponsorOne from "../assets/images/Patrocinador1.jpeg";
import sponsorTwo from "../assets/images/Patrocinador2.jpeg";
</script>

<template>
    <!-- Footer Start -->
    <footer class="bg-theme-dark-blue text-white">
        <div class="container mx-auto px-5 py-16">
            <div
                class="flex flex-col lg:flex-row items-center justify-between gap-12"
            >
                <!-- Logo & Description -->
                <div
                    class="flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                    <div class="mb-6">
                        <img
                            src="/images/KoloeKoaLogo.jpeg"
                            alt="Logótipo Kolo'e Koa Dojo Kenpo"
                        />
                    </div>

                    <p
                        class="font-theme-content text-white/70 text-lg leading-relaxed max-w-md"
                    >
                        Kolo'e Koa Dojo Kenpo — uma escola dedicada
                        à prática do Kenpo, defesa pessoal, disciplina
                        e desenvolvimento do corpo, mente e espírito.
                    </p>
                </div>

                <!-- Sponsors -->
                <div class="flex flex-col items-center text-center">
                    <p
                        class="font-theme-heading text-theme-primary uppercase tracking-widest font-semibold mb-6"
                    >
                        Patrocinadores
                    </p>

                    <div
                        class="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <img
                            :src="sponsorOne"
                            alt="Patrocinador"
                            class="w-40 h-28 object-contain"
                        />

                        <img
                            :src="sponsorTwo"
                            alt="Patrocinador"
                            class="w-40 h-28 object-contain"
                        />
                    </div>
                </div>

                <!-- Social Media -->
                <div
                    class="flex flex-col items-center text-center"
                >
                    <p
                        class="font-theme-heading text-theme-primary uppercase tracking-widest font-semibold mb-4"
                    >
                        Segue-nos
                    </p>

                    <p
                        class="font-theme-content text-white/70 text-lg leading-relaxed max-w-sm mb-6"
                    >
                        Acompanha o nosso trabalho, treinos e novidades
                        através das nossas redes sociais.
                    </p>

                    <!-- Social Networks -->
                    <div
                        class="flex flex-col sm:flex-row items-start justify-center gap-8"
                    >
                        <!-- Instagram - Kolo'e Koa -->
                        <a
                            href="https://www.instagram.com/johnny_romaneiro?stkn=bXEweW9wamljcWxt"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram do Kolo'e Koa Dojo Kenpo"
                            class="flex flex-col items-center text-center group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                class="text-white group-hover:text-theme-primary transition duration-200"
                            >
                                <path
                                    d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.96 3.96 0 0 0-1.437.935A3.96 3.96 0 0 0 .42 2.81c-.198.509-.332 1.09-.372 1.943C.01 5.556 0 5.829 0 8s.01 2.444.048 3.297c.04.853.174 1.434.372 1.943.205.526.478.972.933 1.457.485.455.931.728 1.457.933.509.198 1.09.332 1.943.372C5.556 15.99 5.829 16 8 16s2.444-.01 3.297-.048c.853-.04 1.434-.174 1.943-.372a3.96 3.96 0 0 0 1.457-.933c.455-.485.728-.931.933-1.457.198-.509.332-1.09.372-1.943C15.99 10.444 16 10.171 16 8s-.01-2.444-.048-3.297c-.04-.853-.174-1.434-.372-1.943a3.96 3.96 0 0 0-.933-1.457A3.96 3.96 0 0 0 13.24.42c-.509-.198-1.09-.332-1.943-.372C10.444.01 10.171 0 8 0zM8 1.441c2.131 0 2.389.008 3.232.046.78.036 1.204.166 1.486.276.373.137.685.301.984.6.299.299.463.611.6.984.11.282.24.706.276 1.486.038.844.046 1.097.046 3.233s-.008 2.389-.046 3.233c-.036.78-.166 1.204-.276 1.486a2.516 2.516 0 0 1-.6.984c-.299.299-.611.463-.984.6-.282.11-.706.24-1.486.276-.844.038-1.097.046-3.233.046s-2.389-.008-3.233-.046c-.78-.036-1.204-.166-1.486-.276a2.516 2.516 0 0 1-.984-.6 2.516 2.516 0 0 1-.6-.984c-.11-.282-.24-.706-.276-1.486C1.449 10.389 1.441 10.136 1.441 8s.008-2.389.046-3.233c.036-.78.166-1.204.276-1.486.137-.373.301-.685.6-.984.299-.299.611-.685.984-.984.282-.11.706-.24.984-.276.844-.038 1.097-.046 3.233-.046zm0 2.451A4.108 4.108 0 1 0 8 12.108 4.108 4.108 0 0 0 8 3.892zm0 6.775A2.667 2.667 0 1 1 8 5.333a2.667 2.667 0 0 1 0 5.334zm5.22-6.935a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0z"
                                />
                            </svg>

                            <span
                                class="mt-3 font-theme-content text-white/70 text-sm group-hover:text-theme-primary transition duration-200"
                            >
                                Instagram
                            </span>

                            <span
                                class="font-theme-content text-white/50 text-xs"
                            >
                                Kolo'e Koa Dojo Kenpo
                            </span>
                        </a>

                        <!-- Facebook - Kolo'e Koa -->
                        <a
                            href="https://www.facebook.com/share/19JbGEeyKV/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook do Kolo'e Koa Dojo Kenpo"
                            class="flex flex-col items-center text-center group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                class="text-white group-hover:text-theme-primary transition duration-200"
                            >
                                <path
                                    d="M16 8.049C16 3.603 12.418 0 8 0S0 3.603 0 8.049c0 4.017 2.926 7.347 6.75 7.951v-5.625H4.718V8.049H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791 1.258v1.51h-2.218v2.137h2.218l-.354 2.326H9.345V16C13.169 15.396 16 12.066 16 8.049z"
                                />
                            </svg>

                            <span
                                class="mt-3 font-theme-content text-white/70 text-sm group-hover:text-theme-primary transition duration-200"
                            >
                                Facebook
                            </span>

                            <span
                                class="font-theme-content text-white/50 text-xs"
                            >
                                Kolo'e Koa Dojo Kenpo
                            </span>
                        </a>

                        <!-- Facebook - Chow Hoon Ohana -->
                        <a
                            href="https://www.facebook.com/share/14rj38gHAYJ/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook da Chow Hoon Ohana"
                            class="flex flex-col items-center text-center group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                class="text-white group-hover:text-theme-primary transition duration-200"
                            >
                                <path
                                    d="M16 8.049C16 3.603 12.418 0 8 0S0 3.603 0 8.049c0 4.017 2.926 7.347 6.75 7.951v-5.625H4.718V8.049H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791 1.258v1.51h-2.218v2.137h2.218l-.354 2.326H9.345V16C13.169 15.396 16 12.066 16 8.049z"
                                />
                            </svg>

                            <span
                                class="mt-3 font-theme-content text-white/70 text-sm group-hover:text-theme-primary transition duration-200"
                            >
                                Facebook
                            </span>

                            <span
                                class="font-theme-content text-white/50 text-xs"
                            >
                                Chow Hoon Ohana
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Copyright -->
            <div class="text-center mt-12">
                <p class="font-theme-content text-white/40 text-sm">
                    © {{ new Date().getFullYear() }} Kolo'e Koa Dojo Kenpo.
                    Todos os direitos reservados.
                </p>
            </div>
        </div>
    </footer>
    <!-- Footer End -->
</template>