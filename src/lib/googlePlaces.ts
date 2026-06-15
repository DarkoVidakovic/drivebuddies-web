export interface PlaceRating {
  value: number;
  count: number;
}

const FALLBACK: PlaceRating = { value: 5.0, count: 32 };

const MAPS_URL =
  'https://www.google.com/maps/place/Drive+Buddies+Fahrschule/@47.2911056,8.5656282,17z/data=!4m6!3m5!1s0x2449d0653ab27353:0xaed93d82704b5f67!8m2!3d47.2911056!4d8.5656282!16s%2Fg%2F11y10yn98f';

export const GOOGLE_MAPS_URL = MAPS_URL;

/**
 * Fetch live rating + review count from the Places API (New) at build time.
 * Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in the environment.
 *
 * How to get GOOGLE_PLACE_ID:
 *   1. Go to https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
 *   2. Search for "Drive Buddies Fahrschule"
 *   3. Copy the Place ID (starts with "ChIJ…")
 *
 * Falls back to the hardcoded values when the env vars are absent so the site
 * still builds locally without credentials.
 */
export async function fetchPlaceRating(): Promise<PlaceRating> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY;
  const placeId = import.meta.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return FALLBACK;
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount&key=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.warn(`[googlePlaces] API returned ${res.status} — using fallback`);
      return FALLBACK;
    }

    const data = (await res.json()) as { rating?: number; userRatingCount?: number };

    return {
      value: data.rating ?? FALLBACK.value,
      count: data.userRatingCount ?? FALLBACK.count,
    };
  } catch (err) {
    console.warn('[googlePlaces] fetch failed — using fallback', err);
    return FALLBACK;
  }
}
