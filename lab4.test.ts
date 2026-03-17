import { describe, test, expect } from 'vitest';
import { 
  query, 
  where, 
  sort, 
  groupArrayByKey, 
  having,
  type Group 
} from './lab4';

type User = {
  id: number;
  name: string;
  age: number;
  active: string;
  city: string;
};

describe('Query Pipeline с пользователями из Иркутска и Братска', () => {
  const users: User[] = [
    { id: 1, name: 'Дмитрий', age: 25, active: 'true', city: 'Иркутск' },
    { id: 2, name: 'Даниил', age: 30, active: 'false', city: 'Братск' },
    { id: 3, name: 'Александр', age: 22, active: 'true', city: 'Иркутск' }
  ];

  const whereFn = where<User>();
  const sortFn = sort<User>();
  const havingFn = having<User>();

  test('Пункт 1: Transform - базовая функция query с одним шагом', () => {
    const pipeline = query<User>(sortFn("age"));
    const result = pipeline(users);
    expect(result).toHaveLength(3);
    expect(result[0].age).toBe(22);
  });

  test('Пункт 2: Where - фильтрация по городу Иркутск', () => {
    const pipeline = query<User>(whereFn("city", "Иркутск"));
    const result = pipeline(users);
    expect(result).toHaveLength(2);
    expect(result.every(u => u.city === "Иркутск")).toBe(true);
    expect(result.map(u => u.name)).toEqual(['Дмитрий', 'Александр']);
  });

  test('Пункт 2: Where - фильтрация по городу Братск', () => {
    const pipeline = query<User>(whereFn("city", "Братск"));
    const result = pipeline(users);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Даниил");
  });

  test('Пункт 2: Where - фильтрация по активности', () => {
    const pipeline = query<User>(whereFn("active", "true"));
    const result = pipeline(users);
    expect(result).toHaveLength(2);
    expect(result.every(u => u.active === "true")).toBe(true);
    expect(result.map(u => u.name)).toEqual(['Дмитрий', 'Александр']);
  });

  test('Пункт 2: Where - фильтрация по нескольким полям', () => {
    const pipeline = query<User>(
      whereFn("city", "Иркутск"),
      whereFn("active", "true")
    );
    const result = pipeline(users);
    expect(result).toHaveLength(2);
    expect(result.every(u => u.city === "Иркутск" && u.active === "true")).toBe(true);
  });

  test('Пункт 3: Sort - сортировка по возрасту (возрастание)', () => {
    const pipeline = query<User>(sortFn("age"));
    const result = pipeline(users);
    expect(result[0].age).toBe(22); // Александр
    expect(result[1].age).toBe(25); // Дмитрий
    expect(result[2].age).toBe(30); // Даниил
    expect(result.map(u => u.name)).toEqual(['Александр', 'Дмитрий', 'Даниил']);
  });

  test('Пункт 3: Sort - сортировка по имени', () => {
    const pipeline = query<User>(sortFn("name"));
    const result = pipeline(users);
    expect(result.map(u => u.name)).toEqual(['Александр', 'Даниил', 'Дмитрий']);
  });

  test('Пункт 3: Sort - сортировка по id', () => {
    const pipeline = query<User>(sortFn("id"));
    const result = pipeline(users);
    expect(result.map(u => u.id)).toEqual([1, 2, 3]);
  });

  test('Пункт 4-5: Group - группировка по городам', () => {
    const groups = groupArrayByKey(users, "city") as Group<User, 'city'>[];
    
    expect(groups).toHaveLength(2);
    
    const irkutsk = groups.find(g => g.key === "Иркутск");
    expect(irkutsk).toBeDefined();
    expect(irkutsk?.items).toHaveLength(2);
    expect(irkutsk?.items.map(u => u.name)).toEqual(['Дмитрий', 'Александр']);
    
    const bratsk = groups.find(g => g.key === "Братск");
    expect(bratsk).toBeDefined();
    expect(bratsk?.items).toHaveLength(1);
    expect(bratsk?.items[0].name).toBe("Даниил");
  });

  test('Пункт 4-5: Group - группировка по активности', () => {
    const groups = groupArrayByKey(users, "active") as Group<User, 'active'>[];
    
    expect(groups).toHaveLength(2);
    
    const active = groups.find(g => g.key === "true");
    expect(active).toBeDefined();
    expect(active?.items).toHaveLength(2);
    expect(active?.items.map(u => u.name)).toEqual(['Дмитрий', 'Александр']);
    
    const inactive = groups.find(g => g.key === "false");
    expect(inactive).toBeDefined();
    expect(inactive?.items).toHaveLength(1);
    expect(inactive?.items[0].name).toBe("Даниил");
  });

  test('Пункт 6-7: Having - фильтрация групп с более чем 1 пользователем', () => {
    const groups = groupArrayByKey(users, "city") as Group<User, 'city'>[];
    const havingFilter = havingFn<'city'>((group) => group.items.length > 1);
    const filteredGroups = havingFilter(groups);
    
    expect(filteredGroups).toHaveLength(1);
    expect(filteredGroups[0].key).toBe("Иркутск");
    expect(filteredGroups[0].items).toHaveLength(2);
  });

  test('Пункт 6-7: Having - фильтрация групп с пользователями младше 25', () => {
    const groups = groupArrayByKey(users, "city") as Group<User, 'city'>[];
    const havingFilter = havingFn<'city'>((group) => 
      group.items.some(u => u.age < 25)
    );
    const filteredGroups = havingFilter(groups);
    
    expect(filteredGroups).toHaveLength(1);
    expect(filteredGroups[0].key).toBe("Иркутск"); // Александр 22 года
  });

  // ИСПРАВЛЕНО: тест для пользователей старше 25
  test('Пункт 6-7: Having - фильтрация групп с пользователями старше 25', () => {
    const groups = groupArrayByKey(users, "city") as Group<User, 'city'>[];
    const havingFilter = havingFn<'city'>((group) => 
      group.items.some(u => u.age > 25)
    );
    const filteredGroups = havingFilter(groups);
    
    expect(filteredGroups).toHaveLength(1); // Только Братск с Даниилом (30 > 25)
    expect(filteredGroups[0].key).toBe("Братск");
    expect(filteredGroups[0].items[0].name).toBe("Даниил");
  });

  // ДОБАВЛЕН: тест для пользователей старше или равно 25
  test('Пункт 6-7: Having - фильтрация групп с пользователями старше или равно 25', () => {
    const groups = groupArrayByKey(users, "city") as Group<User, 'city'>[];
    const havingFilter = havingFn<'city'>((group) => 
      group.items.some(u => u.age >= 25)
    );
    const filteredGroups = havingFilter(groups);
    
    expect(filteredGroups).toHaveLength(2); // Обе группы
    expect(filteredGroups.map(g => g.key)).toContain('Иркутск');
    expect(filteredGroups.map(g => g.key)).toContain('Братск');
  });

  test('Пункт 8: Query - пустой конвейер возвращает исходные данные', () => {
    const pipeline = query<User>();
    const result = pipeline(users);
    expect(result).toEqual(users);
    expect(result).toHaveLength(3);
  });

  test('Пункт 8: Query - фильтр + сортировка', () => {
    const pipeline = query<User>(
      whereFn("city", "Иркутск"),
      sortFn("age")
    );
    const result = pipeline(users);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Александр"); // 22 года
    expect(result[1].name).toBe("Дмитрий");   // 25 лет
  });

  test('Пункт 8: Query - сортировка + фильтр', () => {
    const pipeline = query<User>(
      sortFn("age"),
      whereFn("active", "true")
    );
    const result = pipeline(users);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Александр");
    expect(result[1].name).toBe("Дмитрий");
  });

  test('Полный конвейер: группировка + having', () => {
    const groups = groupArrayByKey(users, "city");
    const havingFilter = havingFn<'city'>((group) => group.items.length > 1);
    const filteredGroups = havingFilter(groups as Group<User, 'city'>[]);
    
    expect(filteredGroups).toHaveLength(1);
    expect(filteredGroups[0].items).toHaveLength(2);
    
    const names = filteredGroups[0].items.map(u => u.name).sort();
    expect(names).toEqual(['Александр', 'Дмитрий']);
  });

  test('Краевой случай: фильтрация по несуществующему городу', () => {
    const pipeline = query<User>(whereFn("city", "Москва" as any));
    const result = pipeline(users);
    expect(result).toHaveLength(0);
  });

  test('Краевой случай: сортировка пустого массива', () => {
    const pipeline = query<User>(sortFn("age"));
    const result = pipeline([]);
    expect(result).toHaveLength(0);
  });

  test('Краевой случай: группировка пустого массива', () => {
    const groups = groupArrayByKey([], "city" as keyof User);
    expect(groups).toHaveLength(0);
  });

  test('Краевой случай: фильтрация групп пустого массива', () => {
    const havingFilter = havingFn<'city'>((group) => group.items.length > 1);
    const filteredGroups = havingFilter([]);
    expect(filteredGroups).toHaveLength(0);
  });
});