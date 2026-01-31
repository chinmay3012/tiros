import { StandardCheckoutClient, Env } from "pg-sdk-node";

let _phonepeClient = null;

function getPhonePeClient() {
  if (_phonepeClient) return _phonepeClient;
  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION) || 1;
    const env = process.env.PHONEPE_ENV === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX;
    _phonepeClient = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
    return _phonepeClient;
  } catch (err) {
    console.error("PhonePe client init failed:", err.message);
    return null;
  }
}

export const phonepeClient = new Proxy(
  {},
  {
    get(_, prop) {
      const client = getPhonePeClient();
      if (!client) return undefined;
      const val = client[prop];
      return typeof val === "function" ? val.bind(client) : val;
    },
  }
);
