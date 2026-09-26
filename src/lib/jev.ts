import {
  TypeSafeClient,
  choice,
  noul,
  score,
  APIError,
  AuthenticationError,
  RateLimitError,
  UnprocessableEntityError,
  APIConnectionError,
  type Questions,
  type SystemOneResult,
  type ModelCard,
} from '@typesafe-ai/sdk';

/**
 * Base URL for Jev AI's compatible hosted endpoint.
 * Note: Must include /api, and MUST NOT include /v1 or /systemone,
 * as the SDK appends the appropriate resource paths automatically.
 */
export const JEV_API_BASE_URL = 'https://jev-ai.pro/api';

/**
 * Stable model alias recommended by Jev AI documentation.
 */
export const JEV_DEFAULT_MODEL = 'jev-latest';

let cachedClient: TypeSafeClient | null = null;

/**
 * Obtains or initializes the TypeSafeClient configured for Jev AI.
 * 
 * IMPORTANT:
 * 1. JEV_AI_API_KEY is read strictly from server-side process.env.
 * 2. baseURL is explicitly set to https://jev-ai.pro/api because changing only
 *    the key would otherwise route requests to TypeSafe's default endpoint.
 * 3. Automatic retries are disabled (maxRetries: 0) per Jev AI documentation
 *    to prevent unintentional replays of billed requests when network outcomes are ambiguous.
 */
export function getJevClient(): TypeSafeClient {
  const apiKey = process.env.JEV_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'JEV_AI_API_KEY is not configured in the server environment. ' +
      'Please add JEV_AI_API_KEY to .env.local (local development) or your hosting provider secrets.'
    );
  }

  if (!cachedClient) {
    cachedClient = new TypeSafeClient({
      apiKey,
      baseURL: JEV_API_BASE_URL,
      retry: { maxRetries: 0 },
    });
  }

  return cachedClient;
}

/**
 * Check connectivity and retrieve models exposed to the authenticated account
 * WITHOUT running any model inference or spending balance.
 * Calls GET https://jev-ai.pro/api/v1/models.
 */
export async function listJevModels(): Promise<{
  success: boolean;
  destination: string;
  models: ModelCard[];
}> {
  const client = getJevClient();
  try {
    const models = await client.models.list();
    return {
      success: true,
      destination: `${JEV_API_BASE_URL}/v1/models`,
      models,
    };
  } catch (error) {
    handleJevError(error, 'listJevModels');
    throw error;
  }
}

/**
 * Evaluates state against typed questions (choice, noul, score).
 * 
 * @param state - Context text or structured object to evaluate
 * @param questions - Named typed questions
 * @param model - Jev model identifier (defaults to 'jev-latest')
 */
export async function makeJevDecision<const Q extends Questions>({
  state,
  questions,
  model = JEV_DEFAULT_MODEL,
}: {
  state: Parameters<TypeSafeClient['systemOne']>[0]['state'];
  questions: Q;
  model?: string;
}): Promise<{
  success: boolean;
  destination: string;
  model: string;
  answers: SystemOneResult<Q>['answers'];
  usage: SystemOneResult<Q>['usage'];
}> {
  const client = getJevClient();
  try {
    const result = await client.systemOne({
      model,
      state,
      questions,
    });

    return {
      success: true,
      destination: `${JEV_API_BASE_URL}/v1/systemone`,
      model: result.model,
      answers: result.answers,
      usage: result.usage,
    };
  } catch (error) {
    handleJevError(error, 'makeJevDecision');
    throw error;
  }
}

/**
 * Real estate inquiry triage helper tailored for Sofinfra.
 * Classifies lead category, assesses urgency, and flags potential spam.
 */
export async function triageInquiry(inquiryText: string) {
  return makeJevDecision({
    model: JEV_DEFAULT_MODEL,
    state: {
      inquiry: inquiryText,
    },
    questions: {
      category: choice('What is the primary category of this real estate inquiry?', {
        residential_buy: 'Customer wants to buy residential property or home.',
        commercial_lease: 'Customer wants commercial space, office, or retail lease.',
        seller_submission: 'Property owner looking to list or sell property.',
        general_info: 'General inquiries regarding projects, pricing, or locations.',
        spam_or_irrelevant: 'Spam, advertising, test data, or completely unrelated message.',
      }),
      urgent: noul('Does the inquiry require immediate same-day advisory contact?'),
    },
  });
}

/**
 * Standardized error handling matching Jev AI docs specifications.
 */
export function handleJevError(error: unknown, context = 'Jev API'): never {
  if (error instanceof AuthenticationError) {
    // HTTP 401
    throw new Error(
      `[${context}] Authentication failed (HTTP 401). Verify that JEV_AI_API_KEY is valid and the baseURL is correctly pointing to ${JEV_API_BASE_URL}.`
    );
  }

  if (error instanceof RateLimitError) {
    // HTTP 429
    const retryAfter = error.retryAfterMs ? `${error.retryAfterMs}ms` : 'specified duration';
    throw new Error(
      `[${context}] Rate limit exceeded (HTTP 429). Max limit is 1000 requests/min. Retry after ${retryAfter}.`
    );
  }

  if (error instanceof UnprocessableEntityError) {
    // HTTP 422
    throw new Error(
      `[${context}] Request validation error (HTTP 422). Check limits: max 64 questions, max 256KB payload, max 48 tokens per choice label.`
    );
  }

  if (error instanceof APIError) {
    // HTTP 402, 404, 502, 503, etc.
    if (error.status === 402) {
      throw new Error(
        `[${context}] Insufficient balance/credits (HTTP 402). Top up paid tokens or credits in your Jev AI account.`
      );
    }
    if (error.status === 404) {
      throw new Error(
        `[${context}] Resource not found (HTTP 404). Verify that baseURL retains '/api' and does not duplicate '/v1'.`
      );
    }
    if (error.status === 503) {
      throw new Error(
        `[${context}] Service unavailable (HTTP 503). The requested model is temporarily unconnected or undergoing maintenance.`
      );
    }
    throw new Error(`[${context}] API Error (${error.status}): ${error.message}`);
  }

  if (error instanceof APIConnectionError) {
    throw new Error(`[${context}] Network/connection error to ${JEV_API_BASE_URL}: ${(error as Error).message}`);
  }

  throw error as Error;
}

export { choice, noul, score };
