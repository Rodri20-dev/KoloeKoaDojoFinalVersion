import { withSupabase } from "npm:@supabase/server@1";

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://koloekoadojokenpo.com",
];

const getCorsHeaders = (origin: string | null) => {
    const allowedOrigin =
        origin && allowedOrigins.includes(origin)
            ? origin
            : allowedOrigins[0];

    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };
};

const jsonResponse = (
    body: Record<string, unknown>,
    status: number,
    origin: string | null
) => {
    return new Response(JSON.stringify(body), {
        status,
        headers: getCorsHeaders(origin),
    });
};

export default {
    fetch: withSupabase(
        { auth: "user" },
        async (req, ctx) => {
            const origin = req.headers.get("origin");

            if (req.method === "OPTIONS") {
                return new Response("ok", {
                    status: 200,
                    headers: getCorsHeaders(origin),
                });
            }

            if (req.method !== "POST") {
                return jsonResponse(
                    {
                        error: "Método não permitido.",
                    },
                    405,
                    origin
                );
            }

            try {
                /*
                 * 1. Identificar o utilizador autenticado
                 */
                const {
                    data: { user },
                    error: userError,
                } = await ctx.supabase.auth.getUser();

                if (userError || !user) {
                    return jsonResponse(
                        {
                            error: "Não autenticado.",
                        },
                        401,
                        origin
                    );
                }

                /*
                 * 2. Confirmar que é administrador
                 */
                const { data: profile, error: profileError } =
                    await ctx.supabase
                        .from("profiles")
                        .select("role")
                        .eq("id", user.id)
                        .single();

                if (
                    profileError ||
                    !profile ||
                    profile.role !== "admin"
                ) {
                    return jsonResponse(
                        {
                            error: "Sem permissões para executar esta operação.",
                        },
                        403,
                        origin
                    );
                }

                /*
                 * 3. Ler os dados enviados pelo frontend
                 */
                const body = await req.json();

                const fullName =
                    typeof body.fullName === "string"
                        ? body.fullName.trim()
                        : "";

                const email =
                    typeof body.email === "string"
                        ? body.email.trim().toLowerCase()
                        : "";

                /*
                 * 4. Validar nome
                 */
                if (!fullName) {
                    return jsonResponse(
                        {
                            error: "O nome completo é obrigatório.",
                        },
                        400,
                        origin
                    );
                }

                if (fullName.length < 2) {
                    return jsonResponse(
                        {
                            error: "O nome completo é demasiado curto.",
                        },
                        400,
                        origin
                    );
                }

                if (fullName.length > 100) {
                    return jsonResponse(
                        {
                            error: "O nome completo é demasiado longo.",
                        },
                        400,
                        origin
                    );
                }

                /*
                 * 5. Validar email
                 */
                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!email || !emailRegex.test(email)) {
                    return jsonResponse(
                        {
                            error: "Introduz um endereço de email válido.",
                        },
                        400,
                        origin
                    );
                }

                if (email.length > 254) {
                    return jsonResponse(
                        {
                            error: "O endereço de email é demasiado longo.",
                        },
                        400,
                        origin
                    );
                }

                /*
                 * 6. URL para onde o convite vai redirecionar
                 */
                const siteUrl =
                    Deno.env.get("SITE_URL") ||
                    "https://koloekoadojokenpo.com";

                const redirectTo =
                    `${siteUrl}/admin/activate`;

                /*
                 * 7. Criar o convite através do Auth Admin API
                 *
                 * ctx.supabaseAdmin é fornecido pelo @supabase/server
                 * e utiliza uma chave privilegiada apenas no backend.
                 */
                const { data, error } =
                    await ctx.supabaseAdmin.auth.admin.inviteUserByEmail(
                        email,
                        {
                            data: {
                                full_name: fullName,
                            },
                            redirectTo,
                        }
                    );

                if (error) {
                    console.error(
                        "Invite admin error:",
                        error.message
                    );

                    return jsonResponse(
                        {
                            error:
                                "Não foi possível enviar o convite. Verifica se este email já possui uma conta.",
                        },
                        400,
                        origin
                    );
                }

                /*
                 * 8. Sucesso
                 */
                return jsonResponse(
                    {
                        success: true,
                        userId: data.user?.id ?? null,
                        message:
                            "Convite enviado com sucesso.",
                    },
                    200,
                    origin
                );
            } catch (error) {
                console.error(
                    "Unexpected invite error:",
                    error
                );

                return jsonResponse(
                    {
                        error:
                            "Ocorreu um erro inesperado ao enviar o convite.",
                    },
                    500,
                    origin
                );
            }
        }
    ),
};