import { supabase } from "../lib/supabase";

export const inviteAdmin = async ({
    fullName,
    email,
}) => {
    return await supabase.functions.invoke(
        "invite-admin",
        {
            body: {
                fullName,
                email,
            },
        }
    );
};