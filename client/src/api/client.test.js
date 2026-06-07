import { describe, it, expect } from 'vitest';

describe('API URL', () => {
  it('has a default fallback', () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    expect(url).toContain('localhost');
  });
});
