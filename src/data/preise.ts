/**
 * Pricing data — single source of truth.
 * Owner: update prices here. No code changes needed elsewhere.
 * Last updated: 2026-06-14
 */

export interface LessonRate {
  priceChf: number;
  durationMin: number;
}

export interface GrundkursRate {
  priceChf: number;
  durationDays: number;
  category: string;
}

export interface Package {
  id: string;
  lessons: number;
  priceChf: number;
  /** Regular price (lessons × single rate) for showing savings */
  regularPriceChf: number;
}

export const CURRENCY = 'CHF';

/** Per-lesson rates (50-minute lesson) */
export const lessonRates: Record<'auto' | 'motorrad' | 'anhaenger', LessonRate> = {
  auto:      { priceChf: 95,  durationMin: 50 },
  motorrad:  { priceChf: 100, durationMin: 50 },
  anhaenger: { priceChf: 95,  durationMin: 50 },
};

/** Motorrad Grundkurs flat rates */
export const grundkursRates: GrundkursRate[] = [
  { category: 'A1',       priceChf: 350, durationDays: 2 },
  { category: 'A (35 kW / unbeschränkt)', priceChf: 380, durationDays: 2 },
];

/** Trailer (Anhänger) flat package */
export const trailerPackage = {
  lessons: 5,
  priceChf: 460,
  regularPriceChf: 475, // 5 × 95
};

/** Bundled lesson packages — auto only */
export const bundlePackages: Package[] = [
  { id: 'auto-10', lessons: 10, priceChf: 920,  regularPriceChf: 950  },
  { id: 'auto-20', lessons: 20, priceChf: 1_800, regularPriceChf: 1_900 },
];

/** Versicherungspauschale — added per lesson to cover insurance */
export const versicherungspauschale = {
  priceChf: 15,
  perLesson: true,
};

/** VKU flat rate */
export const vkuRate = {
  priceChf: 250,
  sessions: 2,
};
