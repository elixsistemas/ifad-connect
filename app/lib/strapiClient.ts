// app/lib/strapiClient.ts

const STRAPI_GRAPHQL_URL = process.env.STRAPI_GRAPHQL_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export function isStrapiConfigured() {
  return Boolean(STRAPI_GRAPHQL_URL && STRAPI_API_TOKEN);
}

if (!STRAPI_GRAPHQL_URL) {
  console.warn(
    "[strapiClient] STRAPI_GRAPHQL_URL não definido em process.env. A integração com devocionais/planos vai usar fallback."
  );
}

export async function strapiQuery<TData = any>(
  query: string,
  variables?: Record<string, any>
): Promise<TData | null> {
  // NÃO derruba a aplicação: permite fallback local
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
    return null; // deixa o caller usar fallback
  }

  const json = await res.json();

  if (json.errors) {
    console.error("[strapiQuery] GraphQL errors", json.errors);
    return null; // deixa o caller usar fallback
  }

  return json.data as TData;
}
