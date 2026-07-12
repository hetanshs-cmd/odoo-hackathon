/**
 * Module augmentation for Express's Request interface.
 *
 * Adds `req.user` typed as AuthenticatedUser so every downstream layer
 * gets type-safe access to the authenticated principal without casting.
 *
 * This file is NOT imported explicitly — TypeScript merges it automatically
 * because it is a `.d.ts` declaration file included via tsconfig.
 */

import { AuthenticatedUser } from './common';

declare global {
  namespace Express {
    interface Request {
      /**
       * Set by the `authenticate` JWT middleware on protected routes.
       * Undefined on public routes.
       */
      user?: AuthenticatedUser;
    }
  }
}

// This empty export converts the file into a module so the declaration
// merging above applies globally (TypeScript requires at least one
// import/export for global augmentation to work correctly).
export {};
