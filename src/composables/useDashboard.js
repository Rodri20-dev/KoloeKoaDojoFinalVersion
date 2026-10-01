import {
    computed,
    onMounted,
    ref,
} from "vue";

import { getDashboardData } from "../services/dashboardService";

export const useDashboard = () => {
    const loading = ref(true);

    const errorMessage = ref("");

    const stats = ref({
        gallery: 0,
        videos: 0,
        schedules: 0,
        messages: 0,
        newMessages: 0,
    });

    const recentMessages = ref([]);

    const loadDashboard = async () => {
        loading.value = true;
        errorMessage.value = "";

        try {
            const {
                stats: dashboardStats,
                recentMessages: messages,
            } = await getDashboardData();

            stats.value = dashboardStats;
            recentMessages.value = messages;
        } catch (error) {
            console.error(
                "Dashboard error:",
                error
            );

            errorMessage.value =
                error.message ||
                "Ocorreu um erro ao carregar o dashboard.";
        } finally {
            loading.value = false;
        }
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("pt-PT", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(new Date(date));
    };

    const getStatusLabel = (status) => {
        const labels = {
            new: "Nova",
            read: "Lida",
            replied: "Respondida",
        };

        return labels[status] || status;
    };

    const getStatusClass = (status) => {
        if (status === "new") {
            return "bg-yellow-100 text-yellow-800";
        }

        if (status === "read") {
            return "bg-blue-100 text-blue-800";
        }

        if (status === "replied") {
            return "bg-green-100 text-green-800";
        }

        return "bg-gray-100 text-gray-800";
    };

    const greeting = computed(() => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return "Bom dia";
        }

        if (hour < 19) {
            return "Boa tarde";
        }

        return "Boa noite";
    });

    onMounted(() => {
        loadDashboard();
    });

    return {
        loading,
        errorMessage,
        stats,
        recentMessages,

        loadDashboard,
        formatDate,
        getStatusLabel,
        getStatusClass,
        greeting,
    };
};