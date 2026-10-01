import { onMounted, ref } from "vue";
import {
    getScheduleItems,
    createScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    toggleScheduleItem,
} from "../services/scheduleService";

export const useSchedule = () => {
    const scheduleItems = ref([]);

    const loading = ref(true);
    const saving = ref(false);
    const deletingId = ref(null);

    const errorMessage = ref("");
    const successMessage = ref("");

    const showForm = ref(false);
    const editingItem = ref(null);

    const dayOfWeek = ref(1);
    const startTime = ref("");
    const endTime = ref("");
    const title = ref("");
    const description = ref("");
    const active = ref(true);

    const daysOfWeek = [
        {
            value: 1,
            label: "Segunda-feira",
        },
        {
            value: 2,
            label: "Terça-feira",
        },
        {
            value: 3,
            label: "Quarta-feira",
        },
        {
            value: 4,
            label: "Quinta-feira",
        },
        {
            value: 5,
            label: "Sexta-feira",
        },
        {
            value: 6,
            label: "Sábado",
        },
        {
            value: 7,
            label: "Domingo",
        },
    ];

    const loadSchedule = async () => {
        loading.value = true;
        errorMessage.value = "";

        try {
            scheduleItems.value = await getScheduleItems();
        } catch (error) {
            console.error("Schedule load error:", error);

            errorMessage.value =
                "Não foi possível carregar o horário.";
        } finally {
            loading.value = false;
        }
    };

    const resetForm = () => {
        dayOfWeek.value = 1;
        startTime.value = "";
        endTime.value = "";
        title.value = "";
        description.value = "";
        active.value = true;
        editingItem.value = null;
    };

    const openCreateForm = () => {
        resetForm();
        errorMessage.value = "";
        successMessage.value = "";
        showForm.value = true;
    };

    const closeForm = () => {
        showForm.value = false;
        resetForm();
    };

    const startEditing = (item) => {
        editingItem.value = item;

        dayOfWeek.value = item.day_of_week;
        startTime.value = item.start_time?.slice(0, 5) || "";
        endTime.value = item.end_time?.slice(0, 5) || "";
        title.value = item.title || "";
        description.value = item.description || "";
        active.value = item.active;

        errorMessage.value = "";
        successMessage.value = "";

        showForm.value = true;
    };

    const validateForm = () => {
        if (!dayOfWeek.value) {
            errorMessage.value =
                "Seleciona o dia da semana.";

            return false;
        }

        if (!startTime.value || !endTime.value) {
            errorMessage.value =
                "Preenche a hora de início e de fim.";

            return false;
        }

        if (startTime.value >= endTime.value) {
            errorMessage.value =
                "A hora de fim deve ser posterior à hora de início.";

            return false;
        }

        if (!title.value.trim()) {
            errorMessage.value =
                "Preenche o nome da aula.";

            return false;
        }

        return true;
    };

    const saveSchedule = async () => {
        errorMessage.value = "";
        successMessage.value = "";

        if (!validateForm()) {
            return false;
        }

        saving.value = true;

        const payload = {
            dayOfWeek: Number(dayOfWeek.value),
            startTime: startTime.value,
            endTime: endTime.value,
            title: title.value.trim(),
            description: description.value.trim(),
            active: active.value,
        };

        try {
            if (editingItem.value) {
                const updatedItem =
                    await updateScheduleItem({
                        id: editingItem.value.id,
                        ...payload,
                    });

                const index =
                    scheduleItems.value.findIndex(
                        (item) =>
                            item.id === updatedItem.id
                    );

                if (index !== -1) {
                    scheduleItems.value[index] =
                        updatedItem;
                }

                successMessage.value =
                    "Horário atualizado com sucesso.";
            } else {
                const newItem =
                    await createScheduleItem(payload);

                scheduleItems.value.push(newItem);

                scheduleItems.value.sort(
                    (a, b) =>
                        a.day_of_week -
                            b.day_of_week ||
                        a.start_time.localeCompare(
                            b.start_time
                        )
                );

                successMessage.value =
                    "Horário criado com sucesso.";
            }

            closeForm();

            setTimeout(() => {
                successMessage.value = "";
            }, 3000);

            return true;
        } catch (error) {
            console.error(
                "Save schedule error:",
                error
            );

            errorMessage.value =
                "Não foi possível guardar o horário.";

            return false;
        } finally {
            saving.value = false;
        }
    };

    const removeSchedule = async (item) => {
        const confirmed = window.confirm(
            "Tens a certeza que queres eliminar este horário?"
        );

        if (!confirmed) {
            return;
        }

        deletingId.value = item.id;
        errorMessage.value = "";

        try {
            await deleteScheduleItem(item.id);

            scheduleItems.value =
                scheduleItems.value.filter(
                    (schedule) =>
                        schedule.id !== item.id
                );

            successMessage.value =
                "Horário eliminado com sucesso.";

            setTimeout(() => {
                successMessage.value = "";
            }, 3000);
        } catch (error) {
            console.error(
                "Delete schedule error:",
                error
            );

            errorMessage.value =
                "Não foi possível eliminar o horário.";
        } finally {
            deletingId.value = null;
        }
    };

    const toggleActive = async (item) => {
        errorMessage.value = "";

        try {
            const updatedItem =
                await toggleScheduleItem(
                    item.id,
                    !item.active
                );

            const index =
                scheduleItems.value.findIndex(
                    (schedule) =>
                        schedule.id === updatedItem.id
                );

            if (index !== -1) {
                scheduleItems.value[index] =
                    updatedItem;
            }
        } catch (error) {
            console.error(
                "Toggle schedule error:",
                error
            );

            errorMessage.value =
                "Não foi possível alterar o estado do horário.";
        }
    };

    const getDayName = (day) => {
        return (
            daysOfWeek.find(
                (item) => item.value === day
            )?.label || ""
        );
    };

    onMounted(loadSchedule);

    return {
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

        loadSchedule,
        openCreateForm,
        closeForm,
        startEditing,
        saveSchedule,
        removeSchedule,
        toggleActive,
        getDayName,
    };
};