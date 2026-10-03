<script setup>
</script>

<template>
    <!-- Masters Section Start -->
    <section
        id="mestres"
        class="relative min-h-[800px] flex items-center overflow-hidden"
    >
        <!-- Background Image -->
        <img
            src="../assets/images/GuerreiroIkaika.jpeg"
            alt="Mestres da linhagem Kolo'e Koa Dojo Kenpo"
            class="absolute inset-0 w-full h-full object-contain bg-black"
        />

        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-black/70"></div>

        <!-- Content -->
        <div class="relative z-10 container mx-auto px-5 py-24">

            <!-- Section Header -->
            <div class="max-w-4xl mx-auto text-center text-white">
                <p
                    class="font-theme-heading text-theme-primary uppercase tracking-widest font-semibold mb-4"
                >
                    A nossa linhagem
                </p>

                <h2
                    class="text-4xl xl:text-5xl font-bold font-theme-heading mb-8"
                >
                    Os Mestres da Nossa Linhagem
                </h2>

                <p
                    class="font-theme-content text-lg lg:text-xl leading-relaxed text-white/90"
                >
                    Conhece os mestres que representam a linhagem e a
                    transmissão da Arte do Kenpo que seguimos no Kolo'e Koa.
                </p>
            </div>

            <!-- Masters -->
            <!-- Masters Cards -->
            <div
                class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto"
            >
                <!-- Professor James Muro - Left -->
                <article
                    class="bg-black/70 backdrop-blur-sm border border-theme-primary overflow-hidden"
                >
                    <!-- Photo -->
                    <div class="w-full flex justify-center">
                        <img
                            src="../assets/images/ProfessorMuro.jpeg"
                            alt="Professor James Muro"
                            class="w-auto max-w-full max-h-[380px] block"
                        />
                    </div>

                    <!-- Information -->
                    <div class="p-8 text-center">
                        <p
                            class="text-theme-primary uppercase tracking-widest font-theme-heading font-semibold mb-3"
                        >
                            Grão-Mestre
                        </p>

                        <h3
                            class="text-2xl lg:text-3xl font-bold font-theme-heading text-white mb-5"
                        >
                            Professor James Muro
                        </h3>

                        <div
                            class="w-16 h-1 bg-theme-primary mx-auto mb-6"
                        ></div>

                        <p
                            class="font-theme-content text-lg text-white/80 leading-relaxed"
                        >
                            Grão-Mestre James Muro é uma das figuras de referência da linhagem Chow-Hoon. 
                            <br><br>
                            Discípulo do Professor John Chow-Hoon, desenvolveu ao longo de décadas um 
                            vasto percurso nas Artes Marciais.
                            <br><br> 
                            Sendo atualmente graduado em 10.º Dan de Kenpo e 
                            10.º Dan de Danzan Ryu. 
                            É líder da Chow-Hoon Ohana e uma referência na preservação e 
                            transmissão deste legado marcial.
                        </p>
                    </div>
                </article>

                <!-- Professor Pedro Porém - Right -->
                <article
                    class="bg-black/70 backdrop-blur-sm border border-theme-primary overflow-hidden"
                >
                    <!-- Photo -->
                    <div class="w-full flex justify-center">
                        <img
                            src="../assets/images/ProfessorPedroPorem.jpeg"
                            alt="Professor Pedro Porém"
                            class="w-auto max-w-full max-h-[380px] block"
                        />
                    </div>

                    <!-- Information -->
                    <div class="p-8 text-center">
                        <p
                            class="text-theme-primary uppercase tracking-widest font-theme-heading font-semibold mb-3"
                        >
                            Diretor Técnico da Arte
                        </p>

                        <h3
                            class="text-2xl lg:text-3xl font-bold font-theme-heading text-white mb-5"
                        >
                            Professor Pedro Porém
                        </h3>

                        <div
                            class="w-16 h-1 bg-theme-primary mx-auto mb-6"
                        ></div>

                        <p
                            class="font-theme-content text-lg text-white/80 leading-relaxed"
                        >
                            Professor Pedro Porém, Diretor Técnico da Arte e fundador da UPKK (União Portuguesa de Karate KeNpo).
                            <br><br>
                            É graduado em 7.º Dan de Kenpo Chow-Hoon Goshin Jitsu e 6.º Dan de Kosho-Ryu Kenpo. 
                            <br><br>
                            Iniciou a sua ligação ao Kenpo em 1987/1988 e, em 1994, trouxe o Kosho-Ryu Kenpo para Portugal, 
                            dando origem à organização que viria a conduzir ao desenvolvimento da modalidade no país. 
                            <br><br>
                            É também representante europeu do Professor James Muro e da Chow-Hoon Ohana.
                        </p>
                    </div>
                </article>
            </div>

            <!-- Closing Message -->
            <div class="max-w-3xl mx-auto text-center mt-24">
                <div
                    class="w-24 h-1 bg-theme-primary mx-auto mb-8"
                ></div>

                <p
                    class="font-theme-heading text-2xl lg:text-3xl font-semibold text-white"
                >
                    A tradição transmite-se. A Arte continua.
                </p>
            </div>

        </div>
    </section>
    <!-- Masters Section End -->
</template>