'use client';
import { getAuth, type User } from 'firebase/auth';

type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

interface FirebaseAuthToken {
  // Note: Only non-sensitive claims are included
  // PII fields are intentionally excluded to prevent leakage
  email_verified: boolean;
  sub: string; // User UID (already public via Firebase)
  firebase: {
    sign_in_provider: string;
  };
}

interface FirebaseAuthObject {
  uid: string;
  token: FirebaseAuthToken;
}

interface SecurityRuleRequest {
  auth: FirebaseAuthObject | null;
  method: string;
  path: string;
  resource?: {
    data: any;
  };
}

/**
 * Builds a security-rule-compliant auth object from the Firebase User.
 * SECURITY: Excludes sensitive PII (name, email, phone) to prevent leakage.
 * @param currentUser The currently authenticated Firebase user.
 * @returns An object that mirrors request.auth in security rules, or null.
 */
function buildAuthObject(currentUser: User | null): FirebaseAuthObject | null {
  if (!currentUser) {
    return null;
  }

  // SECURITY: Only include minimal required fields
  // Excluded: displayName, email, phoneNumber (PII that shouldn't leak)
  const token: FirebaseAuthToken = {
    email_verified: currentUser.emailVerified,
    sub: currentUser.uid,
    firebase: {
      sign_in_provider: currentUser.providerData[0]?.providerId || 'custom',
    },
  };

  return {
    uid: currentUser.uid,
    token: token,
  };
}

/**
 * Builds the complete, simulated request object for the error message.
 * It safely tries to get the current authenticated user.
 * @param context The context of the failed Firestore operation.
 * @returns A structured request object.
 */
function buildRequestObject(context: SecurityRuleContext): SecurityRuleRequest {
  let authObject: FirebaseAuthObject | null = null;
  try {
    const firebaseAuth = getAuth();
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      authObject = buildAuthObject(currentUser);
    }
  } catch {
    // Silently handle initialization errors - no debug info leaked
  }

  return {
    auth: authObject,
    method: context.operation,
    path: `/databases/(default)/documents/${context.path}`,
    resource: context.requestResourceData ? { data: context.requestResourceData } : undefined,
  };
}

/**
 * Builds the final, formatted error message for the LLM.
 * SECURITY: Returns minimal error info - no sensitive data in error messages.
 * @param requestObject The simulated request object.
 * @returns A string containing the error message.
 */
function buildErrorMessage(requestObject: SecurityRuleRequest): string {
  // SECURITY: Don't expose full request details in error messages
  return `Permission denied: Insufficient permissions for this operation.`;
}

/**
 * A custom error class designed to be consumed by an LLM for debugging.
 * SECURITY: Minimal error information to prevent session/UID leakage.
 */
export class FirestorePermissionError extends Error {
  public readonly request: SecurityRuleRequest;

  constructor(context: SecurityRuleContext) {
    const requestObject = buildRequestObject(context);
    super(buildErrorMessage(requestObject));
    this.name = 'FirebaseError';
    // SECURITY: Don't expose full request object - could contain sensitive paths
    this.request = {
      auth: requestObject.auth ? { uid: requestObject.auth.uid } : null,
      method: context.operation,
    };
  }
}
