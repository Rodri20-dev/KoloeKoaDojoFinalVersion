<script setup>
import { useSchedule } from "../composables/useSchedule.js";

const {
    scheduleItems,
    loading,
    saving,
    deletingId,
    errorMessage,
    successMessage,

    showForm,
    editingItem,

    dayOfWeek,
    startTime,
    endTime,
    title,
    description,
    active,

    daysOfWeek,

    openCreateForm,
    closeForm,
    startEditing,
    saveSchedule,
    removeSchedule,
    toggleActive,
    getDayName,
} = useSchedule();
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
                @submit.prevent="saveSchedule"
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
            v-if="editingItem"
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
                    @click="closeForm"
                    :disabled="saving"
                    class="text-gray-500 hover:text-black text-xl"
                >
                    ✕
                </button>
            </div>

            <form
                @submit.prevent="saveSchedule"
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
                            dayOfWeek
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
                                startTime
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
                                endTime
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
                            title
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
                            description
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
                            active
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
                        @click="closeForm"
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
                        {{ scheduleItems.length }} horário(s)
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
                v-else-if="scheduleItems.length === 0"
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
                    v-for="schedule in scheduleItems"
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
                                    removeSchedule(
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