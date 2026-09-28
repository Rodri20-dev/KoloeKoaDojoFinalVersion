<script setup>
import { ref } from "vue";
import { supabase } from "../lib/supabase";

const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const submitForm = async () => {
    successMessage.value = "";
    errorMessage.value = "";

    if (
        !name.value.trim() ||
        !email.value.trim() ||
        !subject.value.trim() ||
        !message.value.trim()
    ) {
        errorMessage.value = "Preenche todos os campos.";
        return;
    }

    loading.value = true;

    const { error } = await supabase
        .from("contact_messages")
        .insert({
            name: name.value.trim(),
            email: email.value.trim(),
            subject: subject.value.trim(),
            message: message.value.trim(),
            status: "new",
        });

    if (error) {
        console.error("Contact form error:", error);

        errorMessage.value =
            "Não foi possível enviar a mensagem. Tenta novamente.";
        loading.value = false;
        return;
    }

    successMessage.value =
        "Mensagem enviada com sucesso. Obrigado pelo contacto!";

    name.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";

    loading.value = false;
};
</script>

<template>
    <section
        id="contact"
        class="py-20 bg-white text-black"
    >
        <div class="container mx-auto px-6">
            <!-- Header -->
            <div class="text-center max-w-3xl mx-auto mb-12">
                <p
                    class="text-theme-primary font-semibold uppercase tracking-widest mb-3"
                >
                    Contactos
                </p>

                <h2
                    class="text-4xl md:text-5xl font-theme-heading font-bold mb-5"
                >
                    Fala connosco
                </h2>

                <p class="text-gray-600">
                    Tens alguma dúvida sobre o dojo, os treinos ou o
                    Kenpo? Entra em contacto connosco.
                </p>
            </div>

            <div
                class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
            >
                <!-- Contact information -->
                <div>
                    <h3
                        class="text-2xl font-theme-heading font-bold mb-6"
                    >
                        Encontra-nos
                    </h3>

                    <div class="space-y-5 text-gray-700">
                        <div>
                            <p
                                class="text-theme-primary font-semibold"
                            >
                                Email
                            </p>

                            <a
                                href="mailto:JOHNY.KOLOE73@gmail.com"
                                class="hover:text-theme-primary transition"
                            >
                                JOHNY.KOLOE73@gmail.com
                            </a>
                        </div>

                        <div>
                            <p
                                class="text-theme-primary font-semibold"
                            >
                                Telefone
                            </p>

                            <a
                                href="tel:+351918444455"
                                class="hover:text-theme-primary transition"
                            >
                                918 444 455
                            </a>
                        </div>

                        <div>
                            <p
                                class="text-theme-primary font-semibold"
                            >
                                Localização
                            </p>

                            <p>
                                Castanheira do Ribatejo, Portugal
                            </p>
                        </div>
                    </div>

                    <!-- Google Maps -->
                    <div
                        class="mt-8 overflow-hidden rounded-xl border border-gray-200"
                    >
                        <iframe
                            src="https://www.google.com/maps?q=38.993384,-8.973076&z=15&output=embed"
                            width="100%"
                            height="320"
                            style="border: 0"
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                <!-- Contact form -->
                <div
                    class="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200"
                >
                    <h3
                        class="text-2xl font-theme-heading font-bold mb-6"
                    >
                        Envia-nos uma mensagem
                    </h3>

                    <!-- Success -->
                    <div
                        v-if="successMessage"
                        class="mb-6 rounded-lg bg-green-100 border border-green-300 text-green-800 px-4 py-3"
                    >
                        {{ successMessage }}
                    </div>

                    <!-- Error -->
                    <div
                        v-if="errorMessage"
                        class="mb-6 rounded-lg bg-red-100 border border-red-300 text-red-800 px-4 py-3"
                    >
                        {{ errorMessage }}
                    </div>

                    <form
                        @submit.prevent="submitForm"
                        class="space-y-5"
                    >
                        <!-- Name -->
                        <div>
                            <label
                                for="contact-name"
                                class="block text-sm font-semibold mb-2"
                            >
                                Nome
                            </label>

                            <input
                                id="contact-name"
                                v-model="name"
                                type="text"
                                autocomplete="name"
                                required
                                class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                                placeholder="O teu nome"
                            />
                        </div>

                        <!-- Email -->
                        <div>
                            <label
                                for="contact-email"
                                class="block text-sm font-semibold mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="contact-email"
                                v-model="email"
                                type="email"
                                autocomplete="email"
                                required
                                class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                                placeholder="O teu email"
                            />
                        </div>

                        <!-- Subject -->
                        <div>
                            <label
                                for="contact-subject"
                                class="block text-sm font-semibold mb-2"
                            >
                                Assunto
                            </label>

                            <input
                                id="contact-subject"
                                v-model="subject"
                                type="text"
                                required
                                class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                                placeholder="Assunto da mensagem"
                            />
                        </div>

                        <!-- Message -->
                        <div>
                            <label
                                for="contact-message"
                                class="block text-sm font-semibold mb-2"
                            >
                                Mensagem
                            </label>

                            <textarea
                                id="contact-message"
                                v-model="message"
                                rows="6"
                                required
                                class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary resize-none"
                                placeholder="Escreve a tua mensagem..."
                            ></textarea>
                        </div>

                        <!-- Submit -->
                        <button
                            type="submit"
                            :disabled="loading"
                            class="w-full bg-theme-primary text-white font-semibold py-3 px-6 rounded-lg transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{
                                loading
                                    ? "A enviar..."
                                    : "Enviar mensagem"
                            }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>