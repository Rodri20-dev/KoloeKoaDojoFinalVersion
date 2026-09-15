<script setup>
import { ref } from "vue";

const form = ref({
    name: "",
    email: "",
    subject: "",
    message: "",
});

const submitted = ref(false);

const handleSubmit = () => {
    // Temporary behaviour.
    // Later this will send the message to the backend,
    // email service and admin area.
    submitted.value = true;
};
</script>

<template>
    <!-- Contact Section Start -->
    <section id="contact" class="bg-theme-dark text-white py-24">
        <div class="container mx-auto px-5">

            <!-- Section Header -->
            <div class="max-w-4xl mx-auto text-center">
                <p
                    class="font-theme-heading text-theme-primary uppercase tracking-widest font-semibold mb-4"
                >
                    Fala connosco
                </p>

                <h2
                    class="text-4xl xl:text-5xl font-bold font-theme-heading mb-8"
                >
                    Contactos
                </h2>

                <p
                    class="font-theme-content text-lg lg:text-xl leading-relaxed text-white/90"
                >
                    Tens alguma questão sobre o Kenpo, os treinos,
                    inscrições ou o nosso dojo? Envia-nos uma mensagem.
                </p>
            </div>

            <!-- Contact Information + Map -->
            <div
                class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mt-16"
            >

                <!-- Contact Information -->
                <div class="flex flex-col justify-center">

                    <p
                        class="font-theme-heading text-theme-primary uppercase tracking-widest font-semibold mb-4"
                    >
                        Estamos disponíveis
                    </p>

                    <h3
                        class="text-3xl lg:text-4xl font-bold font-theme-heading mb-6"
                    >
                        Gostavas de saber mais?
                    </h3>

                    <p
                        class="font-theme-content text-lg leading-relaxed text-white/80"
                    >
                        Entra em contacto connosco para esclarecer qualquer
                        dúvida ou saber mais sobre as aulas e o funcionamento
                        do Kolo'e Koa Dojo Kenpo.
                    </p>

                    <!-- Contact Details -->
                    <div class="mt-8 space-y-5">

                        <div>
                            <p
                                class="font-theme-heading text-theme-primary font-semibold"
                            >
                                Email do dojo
                            </p>

                            <a
                                href="mailto:JOHNY.KOLOE73@gmail.com"
                                class="font-theme-content text-lg text-white/80 hover:text-theme-primary transition duration-300"
                            >
                                JOHNY.KOLOE73@gmail.com
                            </a>
                        </div>

                        <div>
                            <p
                                class="font-theme-heading text-theme-primary font-semibold"
                            >
                                Telemóvel do dojo
                            </p>

                            <a
                                href="tel:+351918444455"
                                class="font-theme-content text-lg text-white/80 hover:text-theme-primary transition duration-300"
                            >
                                918 444 455
                            </a>
                        </div>

                        <div>
                            <p
                                class="font-theme-heading text-theme-primary font-semibold"
                            >
                                Localização
                            </p>

                            <p
                                class="font-theme-content text-lg text-white/80"
                            >
                                Casa do Benfica da Castanheira do Ribatejo - Kolo'e Koa Dojo Kenpo
                            </p>
                        </div>

                    </div>

                    <!-- Google Maps -->
                    <div class="mt-10">

                        <div
                            class="border border-theme-primary overflow-hidden"
                        >
                            <iframe
                                src="https://www.google.com/maps?q=38.993384,-8.973076&z=15&output=embed"
                                width="100%"
                                height="350"
                                style="border:0;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                                title="Localização do Kolo'e Koa Dojo Kenpo"
                            ></iframe>
                        </div>

                        <a
                            href="https://maps.app.goo.gl/otB1s1GRvo3hzoSp7"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-block mt-4 border border-theme-primary px-6 py-3 text-white font-theme-heading font-semibold hover:bg-theme-primary transition duration-300"
                        >
                            Obter direções
                        </a>

                    </div>

                </div>

                <!-- Contact Form -->
                <div
                    class="bg-black/60 border border-theme-primary p-8 lg:p-10"
                >

                    <!-- Success Message -->
                    <div
                        v-if="submitted"
                        class="text-center py-12"
                    >
                        <div
                            class="text-theme-primary text-5xl font-bold font-theme-heading mb-6"
                        >
                            ✓
                        </div>

                        <h3
                            class="text-2xl font-bold font-theme-heading mb-4"
                        >
                            Mensagem enviada
                        </h3>

                        <p
                            class="font-theme-content text-lg text-white/80"
                        >
                            Obrigado pelo contacto. Responderemos
                            assim que possível.
                        </p>
                    </div>

                    <!-- Form -->
                    <form
                        v-else
                        @submit.prevent="handleSubmit"
                        class="space-y-6"
                    >

                        <!-- Name -->
                        <div>
                            <label
                                for="name"
                                class="block font-theme-heading font-semibold mb-2"
                            >
                                Nome
                            </label>

                            <input
                                id="name"
                                v-model="form.name"
                                type="text"
                                required
                                class="w-full bg-white text-black border-0 px-4 py-3 focus:ring-2 focus:ring-theme-primary"
                                placeholder="O teu nome"
                            />
                        </div>

                        <!-- Email -->
                        <div>
                            <label
                                for="email"
                                class="block font-theme-heading font-semibold mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                v-model="form.email"
                                type="email"
                                required
                                class="w-full bg-white text-black border-0 px-4 py-3 focus:ring-2 focus:ring-theme-primary"
                                placeholder="O teu email"
                            />
                        </div>

                        <!-- Subject -->
                        <div>
                            <label
                                for="subject"
                                class="block font-theme-heading font-semibold mb-2"
                            >
                                Assunto
                            </label>

                            <input
                                id="subject"
                                v-model="form.subject"
                                type="text"
                                required
                                class="w-full bg-white text-black border-0 px-4 py-3 focus:ring-2 focus:ring-theme-primary"
                                placeholder="Assunto da mensagem"
                            />
                        </div>

                        <!-- Message -->
                        <div>
                            <label
                                for="message"
                                class="block font-theme-heading font-semibold mb-2"
                            >
                                Mensagem
                            </label>

                            <textarea
                                id="message"
                                v-model="form.message"
                                rows="6"
                                required
                                class="w-full bg-white text-black border-0 px-4 py-3 resize-none focus:ring-2 focus:ring-theme-primary"
                                placeholder="Escreve aqui a tua questão..."
                            ></textarea>
                        </div>

                        <!-- Submit -->
                        <button
                            type="submit"
                            class="w-full bg-theme-primary text-white font-theme-heading font-bold py-4 px-6 hover:bg-white hover:text-theme-primary transition duration-300 border border-theme-primary"
                        >
                            Enviar mensagem
                        </button>

                    </form>

                </div>

            </div>

        </div>
    </section>
    <!-- Contact Section End -->
</template>