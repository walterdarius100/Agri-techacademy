export async function sendMockEmail(message) {
  return {
    ok: true,
    provider: 'mock',
    id: `mock-email-${Date.now()}`,
    message
  };
}
