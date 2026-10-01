import { supabase } from "../lib/supabase";

export const updatePassword = async ({
    currentPassword,
    newPassword,
}) => {
    return await supabase.auth.updateUser({
        password: newPassword,
        current_password: currentPassword,
    });
};