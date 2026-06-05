export function reactive<T extends object>(
  obj: T,
  callback: (key: keyof T, value: any, oldValue: any) => void
): T {
  return new Proxy(obj, {
    set(target, key, value) {
      const oldValue = target[key as keyof T];
      if (oldValue !== value) {
        (target as any)[key] = value;
        callback(key as keyof T, value, oldValue);
      }
      return true;
    },
  });
}
