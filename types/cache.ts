export type CacheValue = string | number | boolean | object | null;

export default interface Cache {
  get(key: string): Promise<string | null>;
  set(key: string, value: CacheValue): Promise<CacheValue>;
  del(key: string): Promise<number>;
}
