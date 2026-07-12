/**
 * Health endpoint integration test.
 *
 * Uses Supertest to make real HTTP requests against the Express app
 * without binding a port (Supertest opens a temporary socket internally).
 *
 * Convention (AGENTS.md §Testing Standards):
 *   describe('<ModuleName>') → describe('<method>') → it('should <behavior> when <condition>')
 */

// Set required env vars before any module that reads process.env loads.
// This runs before the env.ts Zod validation fires.
process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '5001';
process.env['JWT_ACCESS_SECRET'] = 'test-access-secret-that-is-long-enough-for-zod-validation';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-that-is-long-enough-for-zod-validation';
process.env['FRONTEND_URL'] = 'http://localhost:3000';
process.env['BCRYPT_ROUNDS'] = '10';
process.env['LOG_FORMAT'] = 'tiny';

import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Health Endpoint', () => {
  describe('GET /api/health', () => {
    it('should return 200 with success envelope when server is running', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'TransitOps API is running',
      });
    });

    it('should return Content-Type application/json', async () => {
      const response = await request(app).get('/api/health');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should include Helmet security headers', async () => {
      const response = await request(app).get('/api/health');

      // Helmet sets x-content-type-options to prevent MIME sniffing
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('GET /api/not-a-real-route', () => {
    it('should return 404 with NOT_FOUND error code for unmatched routes', async () => {
      const response = await request(app).get('/api/not-a-real-route');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
      expect(typeof response.body.message).toBe('string');
    });
  });

  describe('ANY /api/auth', () => {
    it('should return 501 NOT_IMPLEMENTED for placeholder auth routes', async () => {
      const response = await request(app).get('/api/auth/login');

      expect(response.status).toBe(501);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_IMPLEMENTED');
    });
  });

  describe('ANY /api/vehicles', () => {
    it('should return 501 NOT_IMPLEMENTED for placeholder vehicles routes', async () => {
      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(501);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_IMPLEMENTED');
    });
  });
});
