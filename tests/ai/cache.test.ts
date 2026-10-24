import { describe, it, expect } from 'vitest';
import { PlanLRUCache, hashString } from '@/ai/cache';
import { checkRateLimit } from '@/lib/rate-limiter';

describe('LRU Cache & Rate Limiter', () => {
  it('hashes normalized brief strings deterministically', () => {
    const hash1 = hashString('wedding 200 guests 15L');
    const hash2 = hashString('  wedding   200  guests   15L ');
    expect(hash1).toBe(hash2);
  });

  it('evicts oldest entries when capacity is exceeded', () => {
    const cache = new PlanLRUCache<string>(2, 60000);
    cache.set('key1', 'val1');
    cache.set('key2', 'val2');
    cache.set('key3', 'val3'); // Should evict key1

    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBe('val2');
    expect(cache.get('key3')).toBe('val3');
  });

  it('rate limiter tracks and permits valid request rates', () => {
    const ip = '192.168.1.100';
    const status = checkRateLimit(ip);
    expect(status.allowed).toBe(true);
    expect(status.remaining).toBeGreaterThan(0);
  });
});
