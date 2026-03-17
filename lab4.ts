export type Transform<T> = (data: T[]) => T[];

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export function query<T>(
  ...steps: Array<Transform<T> | GroupTransform<T, any>>
): Transform<T> {
  return (data: T[]): T[] => {
    let result: any = data;
    for (const step of steps) {
      result = step(result);
    }
    return result;
  };
}

export const where = <T>(): Where<T> => {
  return <K extends keyof T>(key: K, value: T[K]): Transform<T> => {
    return (data: T[]): T[] => {
      return data.filter((item) => item[key] === value);
    };
  };
};

export const sort = <T>(): Sort<T> => {
  return <K extends keyof T>(key: K): Transform<T> => {
    return (data: T[]): T[] => {
      return [...data].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
      });
    };
  };
};

export const groupBy = <T>(): GroupBy<T> => {
  return <K extends keyof T>(key: K): Transform<Group<T, K>> => {
    return (groups: Group<T, K>[]): Group<T, K>[] => {
      return groups;
    };
  };
};

export function groupArrayByKey<T, K extends keyof T>(arr: T[], key: K): Group<T, K>[] {
  const groups: Record<string, Group<T, K>> = {};
  for (const item of arr) {
    const keyValue = String(item[key]);
    if (!groups[keyValue]) {
      groups[keyValue] = { key: item[key], items: [] };
    }
    groups[keyValue].items.push(item);
  }
  return Object.values(groups);
}