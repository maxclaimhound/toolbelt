/**
 * AgentSkill: Route Planner
 * Gets directions between two locations using Google Maps Directions API.
 */

export async function execute(input, env = {}) {
  const apiKey = env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY is required');

  const { origin, destination, mode = 'driving' } = input;
  if (!origin || !destination) throw new Error('origin and destination are required');

  const params = new URLSearchParams({ origin, destination, mode, key: apiKey });
  const url = `https://maps.googleapis.com/maps/api/directions/json?${params}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Directions API error: ${response.status}`);

  const data = await response.json();
  if (data.status !== 'OK') throw new Error(`Directions API: ${data.status}`);

  const route = data.routes[0];
  const leg = route.legs[0];

  const steps = leg.steps.map((step, i) => ({
    step: i + 1,
    instruction: step.html_instructions.replace(/<[^>]+>/g, ''), // strip HTML
    distance: step.distance.text,
    duration: step.duration.text,
  }));

  return {
    distance: leg.distance.text,
    duration: leg.duration.text,
    summary: route.summary,
    steps,
    startAddress: leg.start_address,
    endAddress: leg.end_address,
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'route_planner',
    description: 'Get driving, walking, or transit directions between two locations with turn-by-turn steps.',
    parameters: {
      type: 'object',
      properties: {
        origin: { type: 'string', description: 'Starting address or location' },
        destination: { type: 'string', description: 'Destination address or location' },
        mode: { type: 'string', enum: ['driving', 'walking', 'transit', 'bicycling'], description: 'Travel mode' },
      },
      required: ['origin', 'destination'],
    },
  },
};
