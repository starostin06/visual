import { describe, test, expect } from 'vitest';
import { 
  query, 
  where, 
  sort, 
  groupArrayByKey, 
  having,
  type Group
} from './lab5';

type User = {
  id: number;
  name: string;
  age: number;
  active: string;
  city: string;
};

describe('Query Pipeline с проверкой порядка операторов', () => {
  const users: User[] = [
    { id: 1, name: 'Дмитрий', age: 25, active: 'true', city: 'Иркутск' },
    { id: 2, name: 'Даниил', age: 30, active: 'false', city: 'Братск' },
    { id: 3, name: 'Александр', age: 22, active: 'true', city: 'Иркутск' }
  ];

  test('правильный порядок: where -> groupBy -> having -> sort', () => {
    const pipeline = query<User>()
      .where("city", "Иркутск")
      .groupBy("city")
      .having((group: Group<User, 'city'>) => group.items.length > 1)
      .sort("age")
      .build();
    
    const result = pipeline(users);
    expect(result).toBeDefined();
  });

  test('только where', () => {
    const pipeline = query<User>()
      .where("city", "Иркутск")
      .build();
    
    const result = pipeline(users);
    expect(result).toHaveLength(2);
    expect(result.every((u: User) => u.city === "Иркутск")).toBe(true);
  });

  test('несколько where подряд', () => {
    const pipeline = query<User>()
      .where("city", "Иркутск")
      .where("active", "true")
      .build();
    
    const result = pipeline(users);
    expect(result).toHaveLength(2);
    expect(result.every((u: User) => u.city === "Иркутск" && u.active === "true")).toBe(true);
  });

  test('groupBy + having', () => {
    const pipeline = query<User>()
      .groupBy("city")
      .having((group: Group<User, 'city'>) => group.items.length > 1)
      .build();
    
    const result = pipeline(users);
    expect(result).toHaveLength(1);
  });

  test('несколько groupBy подряд', () => {
    const pipeline = query<User>()
      .groupBy("city")
      .groupBy("active")
      .build();
    
    const result = pipeline(users);
    expect(result).toBeDefined();
  });

  test('where + sort (без groupBy)', () => {
    const pipeline = query<User>()
      .where("active", "true")
      .sort("age")
      .build();
    
    const result = pipeline(users);
    expect(result).toHaveLength(2);
    expect(result[0].age).toBe(22);
    expect(result[1].age).toBe(25);
  });

  test('having + sort', () => {
    const pipeline = query<User>()
      .groupBy("city")
      .having((group: Group<User, 'city'>) => group.items.length > 1)
      .sort("age")
      .build();
    
    const result = pipeline(users);
    expect(result).toBeDefined();
  });

  test('только sort', () => {
    const pipeline = query<User>()
      .sort("age")
      .build();
    
    const result = pipeline(users);
    expect(result[0].age).toBe(22);
    expect(result[1].age).toBe(25);
    expect(result[2].age).toBe(30);
  });

  test('несколько sort подряд', () => {
    const pipeline = query<User>()
      .sort("age")
      .sort("name")
      .build();
    
    const result = pipeline(users);
    expect(result).toBeDefined();
  });

  test('пустой конвейер', () => {
    const pipeline = query<User>().build();
    const result = pipeline(users);
    expect(result).toEqual(users);
  });
});

describe('Функциональность операторов', () => {
  const users: User[] = [
    { id: 1, name: 'Дмитрий', age: 25, active: 'true', city: 'Иркутск' },
    { id: 2, name: 'Даниил', age: 30, active: 'false', city: 'Братск' },
    { id: 3, name: 'Александр', age: 22, active: 'true', city: 'Иркутск' }
  ];

  test('where фильтрует по городу', () => {
    const whereFn = where<User>();
    const result = whereFn('city', 'Иркутск')(users);
    expect(result).toHaveLength(2);
  });

  test('sort сортирует по возрасту', () => {
    const sortFn = sort<User>();
    const result = sortFn('age')(users);
    expect(result[0].age).toBe(22);
    expect(result[1].age).toBe(25);
    expect(result[2].age).toBe(30);
  });

  test('groupArrayByKey группирует по городу', () => {
    const groups = groupArrayByKey(users, 'city');
    expect(groups).toHaveLength(2);
    
    const irkutsk = groups.find((g: Group<User, 'city'>) => g.key === 'Иркутск');
    expect(irkutsk?.items).toHaveLength(2);
  });

  test('having фильтрует группы', () => {
    const groups = groupArrayByKey(users, 'city');
    const havingFn = having<User>()<'city'>((group: Group<User, 'city'>) => group.items.length > 1);
    const filtered = havingFn(groups);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].key).toBe('Иркутск');
  });
});