import { supabase } from "../lib/supabase";

export const getDashboardData = async () => {
    const [
        galleryResult,
        videosResult,
        scheduleResult,
        messagesResult,
        newMessagesResult,
        recentMessagesResult,
    ] = await Promise.all([
        supabase
            .from("gallery_items")
            .select("*", {
                count: "exact",
                head: true,
            }),

        supabase
            .from("videos")
            .select("*", {
                count: "exact",
                head: true,
            }),

        supabase
            .from("schedule")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("active", true),

        supabase
            .from("contact_messages")
            .select("*", {
                count: "exact",
                head: true,
            }),

        supabase
            .from("contact_messages")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("status", "new"),

        supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", {
                ascending: false,
            })
            .limit(5),
    ]);

    const results = [
        galleryResult,
        videosResult,
        scheduleResult,
        messagesResult,
        newMessagesResult,
        recentMessagesResult,
    ];

    const failedResult = results.find(
        (result) => result.error
    );

    if (failedResult) {
        console.error(
            "Dashboard query error:",
            failedResult.error
        );

        throw new Error(
            "Não foi possível carregar todos os dados do dashboard."
        );
    }

    return {
        stats: {
            gallery: galleryResult.count ?? 0,
            videos: videosResult.count ?? 0,
            schedules: scheduleResult.count ?? 0,
            messages: messagesResult.count ?? 0,
            newMessages: newMessagesResult.count ?? 0,
        },

        recentMessages:
            recentMessagesResult.data ?? [],
    };
};