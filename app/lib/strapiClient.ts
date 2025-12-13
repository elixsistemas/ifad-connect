// app/lib/strapiClient.ts

const STRAPI_GRAPHQL_URL = process.env.STRAPI_GRAPHQL_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_GRAPHQL_URL) {
  console.warn(
    "[strapiClient] STRAPI_GRAPHQL_URL não definido. Strapi ficará indisponível e as páginas devem tratar fallback."
  );
}

export async function strapiQuery<TData = any>(
  query: string,
  variables?: Record<string, any>
): Promise<TData | null> {
  // ✅ não derruba build nem runtime quando env não existe
  if (!STRAPI_GRAPHQL_URL) {
    return null;
  }

  const res = await fetch(STRAPI_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({
      query,
      variables: variables ?? {},
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[strapiQuery] HTTP error", res.status, text);
    throw new Error(`Erro ao consultar Strapi (status ${res.status}).`);
  }

  const json = await res.json();

  if (json.errors) {
    console.error("[strapiQuery] GraphQL errors", json.errors);
    throw new Error("Erro GraphQL ao consultar Strapi.");
  }

  return (json.data ?? null) as TData | null;
}
