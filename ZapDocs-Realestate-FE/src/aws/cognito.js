import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";

const region = import.meta.env.VITE_AWS_REGION;
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

if (region && userPoolId && userPoolClientId) {
  Amplify.configure({
    Auth: { Cognito: { userPoolId, userPoolClientId } },
  });
}

/** The FastAPI backend requires Cognito access tokens for Authorization. */
export async function getAccessToken() {
  if (!region || !userPoolId || !userPoolClientId) return null;
  const session = await fetchAuthSession();
  return session.tokens?.accessToken?.toString() ?? null;
}
