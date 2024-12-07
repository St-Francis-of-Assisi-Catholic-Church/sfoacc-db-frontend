export class Cache {
  private static instance: Cache;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly DEFAULT_STALE_TIME = 5 * 60 * 1000;

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isStale = Date.now() - item.timestamp > this.DEFAULT_STALE_TIME;
    if (isStale) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cache = Cache.getInstance();
