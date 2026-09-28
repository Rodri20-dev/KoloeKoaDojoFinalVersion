<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../lib/supabase";

const schedules = ref([]);

const dayOfWeek = ref(1);
const startTime = ref("");
const endTime = ref("");
const title = ref("");
const description = ref("");
const active = ref(true);

const editingSchedule = ref(null);

const loading = ref(true);
const saving = ref(false);
const deletingId = ref(null);

const errorMessage = ref("");
const successMessage = ref("");

const daysOfWeek = [
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
    { value: 6, label: "Sábado" },
    { value: 7, label: "Domingo" },
];

const getDayName = (day) => {
    return (
        daysOfWeek.find(
            (item) => item.value === day
        )?.label || "Dia desconhecido"
    );
};

const loadSchedules = async () => {
    loading.value = true;
    errorMessage.value = "";

    const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

    if (error) {
        console.error("Schedule load error:", error);

        errorMessage.value =
            "Não foi possível carregar os horários.";

        loading.value = false;
        return;
    }

    schedules.value = data;
    loading.value = false;
};

const resetForm = () => {
    dayOfWeek.value = 1;
    startTime.value = "";
    endTime.value = "";
    title.value = "";
    description.value = "";
    active.value = true;
};

const addSchedule = async () => {
    errorMessage.value = "";
    successMessage.value = "";

    if (!startTime.value || !endTime.value) {
        errorMessage.value =
            "A hora de início e de fim são obrigatórias.";

        return;
    }

    if (startTime.value >= endTime.value) {
        errorMessage.value =
            "A hora de fim deve ser posterior à hora de início.";

        return;
    }

    saving.value = true;

    try {
        const { data, error } = await supabase
            .from("schedule")
            .insert({
                day_of_week: dayOfWeek.value,
                start_time: startTime.value,
                end_time: endTime.value,
                title: title.value.trim() || null,
                description:
                    description.value.trim() || null,
                active: active.value,
            })
            .select()
            .single();

        if (error) {
            console.error(
                "Schedule insert error:",
                error
            );

            throw new Error(
                "Não foi possível adicionar o horário."
            );
        }

        schedules.value = [
            ...schedules.value,
            data,
        ].sort((a, b) => {
            if (a.day_of_week !== b.day_of_week) {
                return a.day_of_week - b.day_of_week;
            }

            return a.start_time.localeCompare(
                b.start_time
            );
        });

        resetForm();

        successMessage.value =
            "Horário adicionado com sucesso.";
    } catch (error) {
        errorMessage.value =
            error.message ||
            "Ocorreu um erro ao adicionar o horário.";
    } finally {
        saving.value = false;
    }
};

const startEditing = (schedule) => {
    editingSchedule.value = {
        id: schedule.id,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time.slice(0, 5),
        end_time: schedule.end_time.slice(0, 5),
        title: schedule.title || "",
        description: schedule.description || "",
        active: schedule.active,
    };

    errorMessage.value = "";
    successMessage.value = "";
};

const cancelEditing = () => {
    editingSchedule.value = null;
    errorMessage.value = "";
};

const updateSchedule = async () => {
    if (!editingSchedule.value) {
        return;
    }

    errorMessage.value = "";
    successMessage.value = "";

    if (
        !editingSchedule.value.start_time ||
        !editingSchedule.value.end_time
    ) {
        errorMessage.value =
            "A hora de início e de fim são obrigatórias.";

        return;
    }

    if (
        editingSchedule.value.start_time >=
        editingSchedule.value.end_time
    ) {
        errorMessage.value =
            "A hora de fim deve ser posterior à hora de início.";

        return;
    }

    saving.value = true;

    try {
        const { data, error } = await supabase
            .from("schedule")
            .update({
                day_of_week:
                    editingSchedule.value.day_of_week,

                start_time:
                    editingSchedule.value.start_time,

                end_time:
                    editingSchedule.value.end_time,

                title:
                    editingSchedule.value.title.trim() ||
                    null,

                description:
                    editingSchedule.value.description
                        .trim() || null,

                active:
                    editingSchedule.value.active,

                updated_at: new Date().toISOString(),
            })
            .eq(
                "id",
                editingSchedule.value.id
            )
            .select()
            .single();

        if (error) {
            console.error(
                "Schedule update error:",
                error
            );

            throw new Error(
                "Não foi possível atualizar o horário."
            );
        }

        schedules.value = schedules.value
            .map((schedule) =>
                schedule.id === data.id
                    ? data
                    : schedule
            )
            .sort((a, b) => {
                if (
                    a.day_of_week !==
                    b.day_of_week
                ) {
                    return (
                        a.day_of_week -
                        b.day_of_week
                    );
                }

                return a.start_time.localeCompare(
                    b.start_time
                );
            });

        editingSchedule.value = null;

        successMessage.value =
            "Horário atualizado com sucesso.";
    } catch (error) {
        errorMessage.value =
            error.message ||
            "Ocorreu um erro ao atualizar o horário.";
    } finally {
        saving.value = false;
    }
};

const deleteSchedule = async (schedule) => {
    const confirmed = window.confirm(
        `Tens a certeza que queres eliminar o horário "${getDayName(
            schedule.day_of_week
        )} ${schedule.start_time.slice(
            0,
            5
        )}"?`
    );

    if (!confirmed) {
        return;
    }

    errorMessage.value = "";
    successMessage.value = "";
    deletingId.value = schedule.id;

    try {
        const { error } = await supabase
            .from("schedule")
            .delete()
            .eq("id", schedule.id);

        if (error) {
            console.error(
                "Schedule delete error:",
                error
            );

            throw new Error(
                "Não foi possível eliminar o horário."
            );
        }

        schedules.value =
            schedules.value.filter(
                (item) =>
                    item.id !== schedule.id
            );

        successMessage.value =
            "Horário eliminado com sucesso.";
    } catch (error) {
        errorMessage.value =
            error.message ||
            "Ocorreu um erro ao eliminar o horário.";
    } finally {
        deletingId.value = null;
    }
};

onMounted(() => {
    loadSchedules();
});
</script>

<template>
    <div class="p-6 md:p-8">

        <!-- Cabeçalho -->
        <div class="mb-8">
            <p
                class="text-theme-primary font-semibold uppercase tracking-widest text-sm mb-2"
            >
                Conteúdo
            </p>

            <h1
                class="text-3xl md:text-4xl font-theme-heading font-bold text-gray-900"
            >
                Horários
            </h1>

            <p class="text-gray-500 mt-2">
                Gere os horários de treino do dojo.
            </p>
        </div>

        <!-- Mensagens -->
        <div
            v-if="errorMessage"
            class="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4"
        >
            {{ errorMessage }}
        </div>

        <div
            v-if="successMessage"
            class="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4"
        >
            {{ successMessage }}
        </div>

        <!-- Adicionar -->
        <div
            class="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
            <h2
                class="text-xl font-semibold text-gray-900 mb-6"
            >
                Adicionar horário
            </h2>

            <form
                @submit.prevent="addSchedule"
                class="space-y-5"
            >
                <!-- Dia -->
                <div>
                    <label
                        for="schedule-day"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Dia da semana
                    </label>

                    <select
                        id="schedule-day"
                        v-model.number="dayOfWeek"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    >
                        <option
                            v-for="day in daysOfWeek"
                            :key="day.value"
                            :value="day.value"
                        >
                            {{ day.label }}
                        </option>
                    </select>
                </div>

                <!-- Horas -->
                <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    <div>
                        <label
                            for="schedule-start"
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Hora de início
                        </label>

                        <input
                            id="schedule-start"
                            v-model="startTime"
                            type="time"
                            class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                        />
                    </div>

                    <div>
                        <label
                            for="schedule-end"
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Hora de fim
                        </label>

                        <input
                            id="schedule-end"
                            v-model="endTime"
                            type="time"
                            class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                        />
                    </div>
                </div>

                <!-- Título -->
                <div>
                    <label
                        for="schedule-title"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Nome da aula
                    </label>

                    <input
                        id="schedule-title"
                        v-model="title"
                        type="text"
                        placeholder="Ex.: Kenpo — Iniciantes"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    />
                </div>

                <!-- Descrição -->
                <div>
                    <label
                        for="schedule-description"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Descrição
                    </label>

                    <textarea
                        id="schedule-description"
                        v-model="description"
                        rows="3"
                        placeholder="Descrição opcional..."
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    ></textarea>
                </div>

                <!-- Ativo -->
                <label
                    class="flex items-center gap-3 cursor-pointer"
                >
                    <input
                        v-model="active"
                        type="checkbox"
                        class="rounded border-gray-300 text-theme-primary focus:ring-theme-primary"
                    />

                    <span
                        class="text-sm font-medium text-gray-700"
                    >
                        Mostrar este horário no site
                    </span>
                </label>

                <button
                    type="submit"
                    :disabled="saving"
                    class="px-5 py-3 rounded-lg bg-theme-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                    {{
                        saving
                            ? "A guardar..."
                            : "Adicionar horário"
                    }}
                </button>
            </form>
        </div>

        <!-- Editar -->
        <div
            v-if="editingSchedule"
            class="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
            <div
                class="flex items-center justify-between mb-6"
            >
                <div>
                    <h2
                        class="text-xl font-semibold text-gray-900"
                    >
                        Editar horário
                    </h2>

                    <p
                        class="text-sm text-gray-500 mt-1"
                    >
                        Altera as informações do horário.
                    </p>
                </div>

                <button
                    type="button"
                    @click="cancelEditing"
                    :disabled="saving"
                    class="text-gray-500 hover:text-black text-xl"
                >
                    ✕
                </button>
            </div>

            <form
                @submit.prevent="updateSchedule"
                class="space-y-5"
            >
                <!-- Dia -->
                <div>
                    <label
                        for="edit-schedule-day"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Dia da semana
                    </label>

                    <select
                        id="edit-schedule-day"
                        v-model.number="
                            editingSchedule.day_of_week
                        "
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    >
                        <option
                            v-for="day in daysOfWeek"
                            :key="day.value"
                            :value="day.value"
                        >
                            {{ day.label }}
                        </option>
                    </select>
                </div>

                <!-- Horas -->
                <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    <div>
                        <label
                            for="edit-schedule-start"
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Hora de início
                        </label>

                        <input
                            id="edit-schedule-start"
                            v-model="
                                editingSchedule.start_time
                            "
                            type="time"
                            class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                        />
                    </div>

                    <div>
                        <label
                            for="edit-schedule-end"
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Hora de fim
                        </label>

                        <input
                            id="edit-schedule-end"
                            v-model="
                                editingSchedule.end_time
                            "
                            type="time"
                            class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                        />
                    </div>
                </div>

                <!-- Título -->
                <div>
                    <label
                        for="edit-schedule-title"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Nome da aula
                    </label>

                    <input
                        id="edit-schedule-title"
                        v-model="
                            editingSchedule.title
                        "
                        type="text"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    />
                </div>

                <!-- Descrição -->
                <div>
                    <label
                        for="edit-schedule-description"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Descrição
                    </label>

                    <textarea
                        id="edit-schedule-description"
                        v-model="
                            editingSchedule.description
                        "
                        rows="3"
                        class="w-full rounded-lg border-gray-300 focus:border-theme-primary focus:ring-theme-primary"
                    ></textarea>
                </div>

                <!-- Ativo -->
                <label
                    class="flex items-center gap-3 cursor-pointer"
                >
                    <input
                        v-model="
                            editingSchedule.active
                        "
                        type="checkbox"
                        class="rounded border-gray-300 text-theme-primary focus:ring-theme-primary"
                    />

                    <span
                        class="text-sm font-medium text-gray-700"
                    >
                        Mostrar este horário no site
                    </span>
                </label>

                <div
                    class="flex flex-col sm:flex-row gap-3"
                >
                    <button
                        type="submit"
                        :disabled="saving"
                        class="px-5 py-3 rounded-lg bg-theme-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {{
                            saving
                                ? "A guardar..."
                                : "Guardar alterações"
                        }}
                    </button>

                    <button
                        type="button"
                        @click="cancelEditing"
                        :disabled="saving"
                        class="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>

        <!-- Lista -->
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
            >
                <div>
                    <h2
                        class="text-xl font-semibold text-gray-900"
                    >
                        Horários existentes
                    </h2>

                    <p
                        class="text-sm text-gray-500 mt-1"
                    >
                        {{ schedules.length }} horário(s)
                    </p>
                </div>
            </div>

            <!-- Loading -->
            <div
                v-if="loading"
                class="text-center py-12 text-gray-500"
            >
                A carregar horários...
            </div>

            <!-- Vazio -->
            <div
                v-else-if="schedules.length === 0"
                class="text-center py-12 text-gray-500"
            >
                Ainda não existem horários.
            </div>

            <!-- Lista -->
            <div
                v-else
                class="space-y-4"
            >
                <article
                    v-for="schedule in schedules"
                    :key="schedule.id"
                    class="border border-gray-200 rounded-xl p-5"
                >
                    <div
                        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                    >
                        <div>
                            <div
                                class="flex flex-wrap items-center gap-2 mb-2"
                            >
                                <span
                                    class="text-sm font-semibold text-theme-primary"
                                >
                                    {{
                                        getDayName(
                                            schedule.day_of_week
                                        )
                                    }}
                                </span>

                                <span
                                    class="text-xs px-2 py-1 rounded-full"
                                    :class="
                                        schedule.active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                    "
                                >
                                    {{
                                        schedule.active
                                            ? "Ativo"
                                            : "Oculto"
                                    }}
                                </span>
                            </div>

                            <h3
                                class="text-lg font-semibold text-gray-900"
                            >
                                {{
                                    schedule.start_time.slice(
                                        0,
                                        5
                                    )
                                }}
                                —
                                {{
                                    schedule.end_time.slice(
                                        0,
                                        5
                                    )
                                }}
                            </h3>

                            <p
                                v-if="schedule.title"
                                class="text-gray-700 mt-1"
                            >
                                {{ schedule.title }}
                            </p>

                            <p
                                v-if="schedule.description"
                                class="text-sm text-gray-500 mt-1"
                            >
                                {{ schedule.description }}
                            </p>
                        </div>

                        <div
                            class="flex flex-col sm:flex-row gap-2 lg:w-40"
                        >
                            <button
                                type="button"
                                @click="
                                    startEditing(
                                        schedule
                                    )
                                "
                                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                @click="
                                    deleteSchedule(
                                        schedule
                                    )
                                "
                                :disabled="
                                    deletingId ===
                                    schedule.id
                                "
                                class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {{
                                    deletingId ===
                                    schedule.id
                                        ? "A eliminar..."
                                        : "Eliminar"
                                }}
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>