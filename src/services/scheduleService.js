import { supabase } from "../lib/supabase";

export const getScheduleItems = async () => {
    const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

    if (error) {
        throw error;
    }

    return data ?? [];
};

export const createScheduleItem = async ({
    dayOfWeek,
    startTime,
    endTime,
    title,
    description,
    active,
}) => {
    const { data, error } = await supabase
        .from("schedule")
        .insert({
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime,
            title,
            description,
            active,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

export const updateScheduleItem = async ({
    id,
    dayOfWeek,
    startTime,
    endTime,
    title,
    description,
    active,
}) => {
    const { data, error } = await supabase
        .from("schedule")
        .update({
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime,
            title,
            description,
            active,
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

export const deleteScheduleItem = async (id) => {
    const { error } = await supabase
        .from("schedule")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
};

export const toggleScheduleItem = async (id, active) => {
    const { data, error } = await supabase
        .from("schedule")
        .update({
            active,
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