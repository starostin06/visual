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

export const having = <T>(): Having<T> => {
  return <K extends keyof T>(
    predicate: (group: Group<T, K>) => boolean
  ): GroupTransform<T, K> => {
    return (groups: Group<T, K>[]): Group<T, K>[] => {
      return groups.filter(predicate);
    };
  };
};

type User = {
  id: number;
  name: string;
  age: number;
  active: string;
  city: string;
};

const users: User[] = [
  { id: 1, name: 'Дмитрий', age: 25, active: 'true', city: 'Иркутск' },
  { id: 2, name: 'Даниил', age: 30, active: 'false', city: 'Братск' },
  { id: 3, name: 'Александр', age: 22, active: 'true', city: 'Иркутск' }
];

const whereFn = where<User>();
const sortFn = sort<User>();
const havingFn = having<User>();

console.log('=== Фильтрация по городу Иркутск ===');
const filtered = query<User>(whereFn("city", "Иркутск"));
console.log(filtered(users));

console.log('\n=== Сортировка по возрасту ===');
const sorted = query<User>(sortFn("age"));
console.log(sorted(users));

console.log('\n=== Группы с более чем 1 пользователем ===');
const groups = groupArrayByKey(users, "city");
const havingFilter = havingFn<'city'>((group) => group.items.length > 1);
const filteredGroups = havingFilter(groups);
console.log(JSON.stringify(filteredGroups, null, 2));

console.log('\n=== Активные пользователи из Иркутска ===');
const activeIrkutsk = query<User>(
  whereFn("city", "Иркутск"),
  whereFn("active", "true")
);
console.log(activeIrkutsk(users));