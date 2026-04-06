/**
 * AgentSkill: Google Maps Search
 * Searches Google Maps Places API for locations matching a query.
 * Requires: GOOGLE_MAPS_API_KEY environment variable
 */

export const skill = {
  id: 'google-maps-search',
  name: 'Google Maps Search',
};

/**
 * Execute the skill
 * @param {Object} input - { query, location, radius, limit }
 * @param {Object} env - { GOOGLE_MAPS_API_KEY }
 * @returns {Object} - { results, count }
 */
export async function execute(input, env = {}) {
  const apiKey = env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY is required');

  const { query, location, radius = 5000, limit = 5 } = input;
  if (!query) throw new Error('query is required');

  // Build the Places Text Search URL
  const params = new URLSearchParams({
    query: location ? `${query} near ${location}` : query,
    key: apiKey,
  });
  if (location && !location.includes(',')) {
    // If location is a city name, geocode it first via the query param
    params.set('query', `${query} in ${location}`);
  } else if (location) {
    params.set('location', location);
    params.set('radius', String(radius));
  }

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Maps API error: ${response.status}`);

  const data = await response.json();
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Maps API returned status: ${data.status} — ${data.error_message || ''}`);
  }

  const results = (data.results || []).slice(0, Math.min(limit, 20)).map(place => ({
    name: place.name,
    address: place.formatted_address,
    rating: place.rating || null,
    totalRatings: place.user_ratings_total || 0,
    coordinates: {
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
    },
    placeId: place.place_id,
    isOpen: place.opening_hours?.open_now ?? null,
    types: place.types || [],
  }));

  return { results, count: results.length };
}

// OpenAI / LM Studio / Ollama tool definition
export const toolDefinition = {
  type: 'function',
  function: {
    name: 'google_maps_search',
    description: 'Search Google Maps for places, businesses, or locations. Returns names, addresses, ratings, and coordinates.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'What to search for, e.g. "HVAC contractors" or "coffee shops"' },
        location: { type: 'string', description: 'Where to search, e.g. "New York, NY" or "40.7128,-74.0060"' },
        radius: { type: 'number', description: 'Search radius in meters (default 5000)' },
        limit: { type: 'number', description: 'Number of results to return (default 5)' },
      },
      required: ['query'],
    },
  },
};
