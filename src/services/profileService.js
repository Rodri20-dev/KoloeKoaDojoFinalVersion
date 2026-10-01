import { supabase } from "../lib/supabase";

export const getCurrentUser = async () => {
    return await supabase.auth.getUser();
};

export const getMyProfile = async () => {
    return await supabase.rpc("get_my_profile");
};

export const updateMyProfile = async (userId, fullName) => {
    return await supabase
        .from("profiles")
        .update({
            full_name: fullName,
        })
        .eq("id", userId);
};

export const updateMyAvatar = async ({
    base64,
    mimeType,
    size,
}) => {
    return await supabase.rpc("update_my_avatar", {
        p_avatar_base64: base64,
        p_avatar_mime_type: mimeType,
        p_avatar_size: size,
    });
};

export const deleteMyAvatar = async () => {
    return await supabase.rpc("delete_my_avatar");
};