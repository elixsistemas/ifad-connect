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

/**
 * Tipagem da resposta vinda do Strapi (GraphQL/REST)
 */
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

// queries como STRING, igual você já usa nos devocionais
const READING_PLANS_QUERY = /* GraphQL */ `
  query ReadingPlans {
    readingPlans(sort: "title:asc") {
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

function sortDevotionals(devotionals: RawReadingPlan["devotionals"]): DevotionalSummary[] {
  if (!devotionals) return [];

  // Se vier um único objeto, transforma em array
  const list = Array.isArray(devotionals) ? devotionals : [devotionals];

  return list
    .filter(Boolean)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      // YYYY-MM-DD ordena bem como string
      return a.date.localeCompare(b.date);
    })
    .map((d) => ({
      id: d.documentId,
      title: d.title,
      slug: d.slug,
      date: d.date ?? null,
    }));
}

export async function getReadingPlans(): Promise<ReadingPlan[]> {
  const data = await strapiQuery<{
    readingPlans: RawReadingPlan[];
  }>(READING_PLANS_QUERY);

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
  const data = await strapiQuery<{
    readingPlans: RawReadingPlan[];
  }>(READING_PLAN_BY_SLUG_QUERY, { slug });

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
