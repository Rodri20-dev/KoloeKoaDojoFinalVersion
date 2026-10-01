import { supabase } from "../lib/supabase";

export const getMessages = async () => {
    const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data ?? [];
};

export const updateMessageStatus = async (id, status) => {
    const { data, error } = await supabase
        .from("contact_messages")
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

export const deleteMessage = async (id) => {
    const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
};