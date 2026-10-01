import { supabase } from "../lib/supabase";

const ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/ogg",
];

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const getVideos = async () => {
    return await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });
};

export const uploadVideoFile = async (file) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return {
            error: new Error(
                "Formato inválido. Escolhe um vídeo MP4, WebM ou OGG."
            ),
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            error: new Error(
                "O vídeo não pode ultrapassar os 100 MB."
            ),
        };
    }

    const extension =
        file.name.split(".").pop()?.toLowerCase() ||
        "mp4";

    const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath = `videos/${fileName}`;

    const { error } = await supabase.storage
        .from("videos")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error(
            "Video storage upload error:",
            error
        );

        return {
            data: null,
            error: new Error(
                "Não foi possível fazer upload do vídeo."
            ),
        };
    }

    return {
        data: filePath,
        error: null,
    };
};

export const createVideo = async ({
    title,
    description,
    category,
    videoType,
    videoUrl,
}) => {
    const { data, error } = await supabase
        .from("videos")
        .insert({
            title,
            description,
            category,
            video_type: videoType,
            video_url: videoUrl,
            published: true,
        })
        .select()
        .single();

    if (error) {
        console.error(
            "Video database insert error:",
            error
        );

        if (
            videoType === "local" &&
            videoUrl
        ) {
            await supabase.storage
                .from("videos")
                .remove([videoUrl]);
        }

        return {
            data: null,
            error: new Error(
                "Não foi possível guardar o vídeo."
            ),
        };
    }

    return {
        data,
        error: null,
    };
};

export const updateVideo = async ({
    id,
    title,
    description,
    category,
    videoType,
    videoUrl,
    published,
}) => {
    const { data, error } = await supabase
        .from("videos")
        .update({
            title,
            description,
            category,
            video_type: videoType,
            video_url: videoUrl,
            published,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(
            "Video update error:",
            error
        );

        return {
            data: null,
            error: new Error(
                "Não foi possível atualizar o vídeo."
            ),
        };
    }

    return {
        data,
        error: null,
    };
};

export const deleteVideo = async ({
    id,
    videoType,
    videoUrl,
}) => {
    if (
        videoType === "local" &&
        videoUrl
    ) {
        const { error: storageError } =
            await supabase.storage
                .from("videos")
                .remove([videoUrl]);

        if (storageError) {
            console.error(
                "Video storage delete error:",
                storageError
            );

            return {
                error: new Error(
                    "Não foi possível eliminar o ficheiro de vídeo."
                ),
            };
        }
    }

    const { error: databaseError } =
        await supabase
            .from("videos")
            .delete()
            .eq("id", id);

    if (databaseError) {
        console.error(
            "Video database delete error:",
            databaseError
        );

        return {
            error: new Error(
                "Não foi possível eliminar o registo do vídeo."
            ),
        };
    }

    return {
        error: null,
    };
};