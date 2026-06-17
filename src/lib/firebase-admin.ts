import * as admin from 'firebase-admin';

let dbAdminInstance: admin.firestore.Firestore;
let authAdminInstance: admin.auth.Auth;

if (!admin.apps.length) {
  try {
    // Only attempt to initialize if we actually have some environment variables
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // The private key must be handled carefully, replacing newlines if necessary
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
      dbAdminInstance = admin.firestore();
      authAdminInstance = admin.auth();
    } else {
       console.warn('Firebase Admin: Missing FIREBASE_PRIVATE_KEY. Not initializing.');
    }
  } catch (error) {
    console.warn('Firebase Admin initialization failed. Server actions might not work without environment variables.', error);
  }
} else {
  dbAdminInstance = admin.firestore();
  authAdminInstance = admin.auth();
}

// Export dbAdmin
export const dbAdmin = dbAdminInstance! || {
  collection: () => ({
    doc: () => ({ 
      get: async () => ({ exists: false, data: () => null, id: 'mock-id' }),
      set: async () => {},
      update: async () => {}, 
      delete: async () => {} 
    }),
    add: async () => ({ id: 'mock-id' }),
    where: () => ({ 
      limit: () => ({ 
        get: async () => ({ empty: true, docs: [] }) 
      }) 
    })
  })
} as unknown as admin.firestore.Firestore;

// Export authAdmin
export const authAdmin = authAdminInstance! || {
  verifyIdToken: async () => { throw new Error('Auth Admin not initialized') },
  getUser: async () => { throw new Error('Auth Admin not initialized') }
} as unknown as admin.auth.Auth;

