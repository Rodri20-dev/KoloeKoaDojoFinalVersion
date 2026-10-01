import { supabase } from "../lib/supabase";

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const getGalleryItems = async () => {
    return await supabase
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false });
};

export const getGalleryImageUrl = (storagePath) => {
    return supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath).data.publicUrl;
};

export const uploadGalleryImage = async (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            error: new Error(
                "Formato inválido. Utiliza JPG, PNG ou WebP."
            ),
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            error: new Error(
                "A fotografia não pode ultrapassar os 10 MB."
            ),
        };
    }

    const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

    const filePath = `gallery/${fileName}`;

    const { error } = await supabase.storage
        .from("gallery")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error("Storage upload error:", error);

        return {
            error: new Error(
                "Não foi possível fazer o upload da fotografia."
            ),
        };
    }

    return {
        data: filePath,
        error: null,
    };
};

export const createGalleryItem = async ({
    title,
    description,
    category,
    storagePath,
}) => {
    const { data, error } = await supabase
        .from("gallery_items")
        .insert({
            title,
            description,
            category,
            storage_path: storagePath,
            published: true,
        })
        .select()
        .single();

    if (error) {
        console.error("Gallery database insert error:", error);

        if (storagePath) {
            await supabase.storage
                .from("gallery")
                .remove([storagePath]);
        }

        return {
            data: null,
            error: new Error(
                "A fotografia foi enviada, mas não foi possível guardar os seus dados."
            ),
        };
    }

    return {
        data,
        error: null,
    };
};

export const updateGalleryItem = async ({
    id,
    title,
    description,
    category,
    published,
}) => {
    const { data, error } = await supabase
        .from("gallery_items")
        .update({
            title,
            description,
            category,
            published,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Gallery update error:", error);

        return {
            data: null,
            error: new Error(
                "Não foi possível atualizar a fotografia."
            ),
        };
    }

    return {
        data,
        error: null,
    };
};

export const deleteGalleryItem = async ({
    id,
    storagePath,
}) => {
    if (storagePath) {
        const { error: storageError } = await supabase.storage
            .from("gallery")
            .remove([storagePath]);

        if (storageError) {
            console.error(
                "Gallery storage delete error:",
                storageError
            );

            return {
                error: new Error(
                    "Não foi possível eliminar a fotografia do Storage."
                ),
            };
        }
    }

    const { error: databaseError } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", id);

    if (databaseError) {
        console.error(
            "Gallery database delete error:",
            databaseError
        );

        return {
            error: new Error(
                "A fotografia foi removida do Storage, mas não foi possível remover o registo da galeria."
            ),
        };
    }

    return {
        error: null,
    };
};