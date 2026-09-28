<script setup>
import { computed, onMounted, ref } from "vue";
import { supabase } from "../lib/supabase";

const schedules = ref([]);
const loading = ref(true);

const daysOfWeek = [
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
    { value: 6, label: "Sábado" },
    { value: 7, label: "Domingo" },
];

const loadSchedules = async () => {
    loading.value = true;

    const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .eq("active", true)
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

    if (error) {
        console.error("Public schedule error:", error);
        loading.value = false;
        return;
    }

    schedules.value = data;
    loading.value = false;
};

const groupedSchedules = computed(() => {
    return daysOfWeek
        .map((day) => ({
            ...day,
            schedules: schedules.value.filter(
                (schedule) =>
                    schedule.day_of_week === day.value
            ),
        }))
        .filter((day) => day.schedules.length > 0);
});

const formatTime = (time) => {
    return time.slice(0, 5);
};

onMounted(() => {
    loadSchedules();
});
</script>

<template>
    <section
        id="schedule"
        class="py-20 bg-black text-white"
    >
        <div class="container mx-auto px-6">

            <!-- Cabeçalho -->
            <div
                class="text-center max-w-3xl mx-auto mb-12"
            >
                <p
                    class="text-theme-primary font-semibold uppercase tracking-widest mb-3"
                >
                    Horários
                </p>

                <h2
                    class="text-4xl md:text-5xl font-theme-heading font-bold mb-5"
                >
                    Horários de treino
                </h2>

                <p class="text-gray-300">
                    Consulta os horários das nossas aulas e
                    encontra o momento certo para fazer parte
                    da nossa Ohana.
                </p>
            </div>

            <!-- Loading -->
            <div
                v-if="loading"
                class="text-center py-12 text-gray-400"
            >
                A carregar os horários...
            </div>

            <!-- Sem horários -->
            <div
                v-else-if="groupedSchedules.length === 0"
                class="text-center py-12"
            >
                <p class="text-gray-400">
                    Os horários de treino serão disponibilizados
                    em breve.
                </p>
            </div>

            <!-- Horários -->
            <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
                <article
                    v-for="day in groupedSchedules"
                    :key="day.value"
                    class="bg-gray-900 rounded-xl p-6 border border-gray-800"
                >
                    <!-- Dia -->
                    <div
                        class="flex items-center justify-between mb-5"
                    >
                        <h3
                            class="text-xl font-theme-heading font-semibold"
                        >
                            {{ day.label }}
                        </h3>

                        <div
                            class="w-2 h-2 rounded-full bg-theme-primary"
                        ></div>
                    </div>

                    <!-- Aulas -->
                    <div class="space-y-4">
                        <div
                            v-for="schedule in day.schedules"
                            :key="schedule.id"
                            class="border-l-2 border-theme-primary pl-4"
                        >
                            <p
                                class="text-theme-primary font-semibold"
                            >
                                {{ formatTime(schedule.start_time) }}
                                —
                                {{ formatTime(schedule.end_time) }}
                            </p>

                            <h4
                                v-if="schedule.title"
                                class="text-white font-semibold mt-1"
                            >
                                {{ schedule.title }}
                            </h4>

                            <p
                                v-if="schedule.description"
                                class="text-gray-400 text-sm mt-1"
                            >
                                {{ schedule.description }}
                            </p>
                        </div>
                    </div>
                </article>
            </div>

        </div>
    </section>
</template>