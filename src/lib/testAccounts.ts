export const TEST_ACCOUNT_EMAILS = [
  'test@example.com',
  'demo@example.com',
  'testuser@test.com',
];

export function isTestAccount(email: string | undefined): boolean {
  if (!email) return false;
  return TEST_ACCOUNT_EMAILS.includes(email.toLowerCase());
}
