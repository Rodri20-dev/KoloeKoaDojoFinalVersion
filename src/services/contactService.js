import { supabase } from "../lib/supabase";

export const createContactMessage = async ({
    name,
    email,
    subject,
    message,
}) => {
    return await supabase
        .from("contact_messages")
        .insert({
            name,
            email,
            subject,
            message,
            status: "new",
        });
};