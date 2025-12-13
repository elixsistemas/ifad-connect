// app/lib/strapi/readingPlans.ts
import { strapiQuery } from "../strapiClient";

export interface DevotionalSummary {
  id: string;
  title: string;
  slug: string;
  date: string | null;
}

export interface ReadingPlan {
  id: string;
  title: string;
  slug: string;
  description?: unknown;
  durationDays?: number | null;
  createdAt?: string | null;
  devotionals: DevotionalSummary[];
}

interface RawDevotional {
  documentId: string;
  title: string;
  slug: string;
  date?: string | null;
}

interface RawReadingPlan {
  documentId: string;
  title: string;
  slug: string;
  description?: unknown;
  durationDays?: number | null;
  createdAt?: string | null;
  devotionals?: RawDevotional[] | RawDevotional | null;
}

/**
 * Algumas instalações do Strapi aceitam:
 * sort: "title:asc"
 * Outras exigem:
 * sort: ["title:asc"]
 * Aqui usamos o formato mais compatível.
 */
const READING_PLANS_QUERY = /* GraphQL */ `
  query ReadingPlans {
    readingPlans(sort: ["title:asc"]) {
      documentId
      title
      slug
      description
      durationDays
      createdAt
      devotionals {
        documentId
        title
        slug
        date
      }
    }
  }
`;

const READING_PLAN_BY_SLUG_QUERY = /* GraphQL */ `
  query ReadingPlanBySlug($slug: String!) {
    readingPlans(filters: { slug: { eq: $slug } }) {
      documentId
      title
      slug
      description
      durationDays
      createdAt
      devotionals {
        documentId
        title
        slug
        date
      }
    }
  }
`;

function normalizeDevotionals(
  devotionals: RawReadingPlan["devotionals"]
): RawDevotional[] {
  if (!devotionals) return [];
  return Array.isArray(devotionals) ? devotionals : [devotionals];
}

function sortDevotionals(
  devotionals: RawReadingPlan["devotionals"]
): DevotionalSummary[] {
  const list = normalizeDevotionals(devotionals);

  // type guard pra TS parar de reclamar
  const onlyValid = list.filter(
    (d): d is RawDevotional =>
      Boolean(d && d.documentId && d.title && d.slug)
  );

  return onlyValid
    .sort((a, b) => {
      const ad = a.date ?? "";
      const bd = b.date ?? "";
      return ad.localeCompare(bd);
    })
    .map((d) => ({
      id: d.documentId,
      title: d.title,
      slug: d.slug,
      date: d.date ?? null,
    }));
}

export async function getReadingPlans(): Promise<ReadingPlan[]> {
  const data = await strapiQuery<{ readingPlans: RawReadingPlan[] }>(
    READING_PLANS_QUERY
  );

  // strapiQuery pode retornar null (fallback mode)
  const list = data?.readingPlans ?? [];

  return list.map((plan) => ({
    id: plan.documentId,
    title: plan.title,
    slug: plan.slug,
    description: plan.description,
    durationDays: plan.durationDays ?? null,
    createdAt: plan.createdAt ?? null,
    devotionals: sortDevotionals(plan.devotionals),
  }));
}

export async function getReadingPlanBySlug(
  slug: string
): Promise<ReadingPlan | null> {
  const data = await strapiQuery<{ readingPlans: RawReadingPlan[] }>(
    READING_PLAN_BY_SLUG_QUERY,
    { slug }
  );

  const node = (data?.readingPlans ?? [])[0];
  if (!node) return null;

  return {
    id: node.documentId,
    title: node.title,
    slug: node.slug,
    description: node.description,
    durationDays: node.durationDays ?? null,
    createdAt: node.createdAt ?? null,
    devotionals: sortDevotionals(node.devotionals),
  };
}
