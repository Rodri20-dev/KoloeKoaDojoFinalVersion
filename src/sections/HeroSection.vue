<script setup>
import upkkLogo from "../assets/images/logo-upkk.jpeg";
import chowHoonLogo from "../assets/images/LogoChowHoon.jpeg";
</script>

<template>

    <!-- Hero Section Start -->

    <div
        id="home"
        class="bg-theme-dark text-white"
    >

        <div
            class="container mx-auto px-5 overflow-x-hidden lg:overflow-x-visible"
        >

            <section
                class="grid grid-cols-none lg:grid-cols-2 pb-16 pt-8 items-center"
            >

                <!-- Hero Content -->
                <div class="lg:w-5/6 order-2 lg:order-none">

                    <h1
                        class="text-4xl xl:text-5xl font-bold font-theme-heading text-center lg:text-left"
                    >
                        Kolo'e Koa Dojo Kenpo
                    </h1>

                    <!-- Presentation -->
                    <p
                        class="lg:text-xl mt-10 font-theme-content text-white text-center lg:text-left"
                    >
                        É uma Escola / Dojo de Artes Marciais KENPO,
                        defesa pessoal de linhagem Havaiana, pertencente à
                        UPKK - União Portuguesa de Karaté KENPO, fundada há
                        mais de 3 décadas pelo PROFESSOR PEDRO PORÉM,
                        Diretor Técnico da Arte, graduado em 7º DAN da arte de KENPO Chow Hoon Goshin Jitsu, 
                        e 6º DAN de Kenpo Kosho Ryu Kenpo.
                    </p>
                    
                    <br>

                    <p>
                        Assenta em princípios como o RESPEITO, a DISCIPLINA, a AUTOESTIMA e a AUTOCONFIANÇA, 
                        promovendo também os princípios basilares de uma sociedade sã, a qualidade física e uma 
                        longevidade saudável. Tens tantos motivos... MOTIVA-TE!
                    </p>

                    <!-- Logos UPKK & Chow Hoon -->
                    <div class="mt-10 flex flex-row items-center justify-center lg:justify-start gap-8 md:gap-12 w-full">
                        <img
                            :src="upkkLogo"
                            class="w-64 md:w-80 lg:w-[22rem] h-auto object-contain"
                            alt="União Portuguesa de Karaté Kenpo"
                        />
                        <img
                            :src="chowHoonLogo"
                            class="w-64 md:w-80 lg:w-[22rem] h-auto object-contain ml-12 md:ml-20"
                            alt="Chow-Hoon Ohana"
                        />
                    </div>
                </div>

                <!-- Kolo'e Koa Logo -->
                <div
                    class="relative order-1 lg:order-none mb-20 lg:mt-0 lg:mb-0 lg:-mr-10"
                >

                    <img
                        class="z-10 w-full"
                        src="/images/KoloeKoaLogo.svg"
                        alt="Logótipo Kolo'e Koa Dojo Kenpo"
                    />

                </div>

            </section>

        </div>

    </div>

    <!-- Hero Section End -->

</template>