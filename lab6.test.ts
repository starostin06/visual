import { describe, test, expectTypeOf } from 'vitest';
import { DeepReadonly, PickedByType, EventHandlers } from './lab6';

describe('Задание 1: DeepReadonly<T>', () => {
  test('делает свойства объекта readonly', () => {
    type User = {
      name: string;
      age: number;
    };
    
    type ReadonlyUser = DeepReadonly<User>;
    
    expectTypeOf<ReadonlyUser>().toMatchTypeOf<{
      readonly name: string;
      readonly age: number;
    }>();
  });

  test('рекурсивно делает вложенные свойства readonly', () => {
    type Nested = {
      a: number;
      b: {
        c: string;
        d: {
          e: boolean;
        };
      };
    };
    
    type ReadonlyNested = DeepReadonly<Nested>;
    
    expectTypeOf<ReadonlyNested>().toMatchTypeOf<{
      readonly a: number;
      readonly b: {
        readonly c: string;
        readonly d: {
          readonly e: boolean;
        };
      };
    }>();
  });

  test('работает с массивами', () => {
    type WithArray = {
      items: { id: number; name: string }[];
    };
    
    type ReadonlyWithArray = DeepReadonly<WithArray>;
    
    expectTypeOf<ReadonlyWithArray>().toMatchTypeOf<{
      readonly items: readonly { readonly id: number; readonly name: string }[];
    }>();
  });

  test('не изменяет примитивные типы', () => {
    type Primitive = string;
    type ReadonlyPrimitive = DeepReadonly<Primitive>;
    
    expectTypeOf<ReadonlyPrimitive>().toEqualTypeOf<string>();
  });
});

describe('Задание 2: PickedByType<T, U>', () => {
  test('выбирает свойства типа string', () => {
    type Mixed = {
      id: number;
      name: string;
      age: number;
      city: string;
      active: boolean;
    };
    
    type StringProps = PickedByType<Mixed, string>;
    
    expectTypeOf<StringProps>().toMatchTypeOf<{
      name: string;
      city: string;
    }>();
  });

  test('выбирает свойства типа number', () => {
    type Mixed = {
      id: number;
      name: string;
      age: number;
      city: string;
    };
    
    type NumberProps = PickedByType<Mixed, number>;
    
    expectTypeOf<NumberProps>().toMatchTypeOf<{
      id: number;
      age: number;
    }>();
  });

  test('выбирает свойства типа boolean', () => {
    type Mixed = {
      active: boolean;
      name: string;
      verified: boolean;
      age: number;
    };
    
    type BooleanProps = PickedByType<Mixed, boolean>;
    
    expectTypeOf<BooleanProps>().toMatchTypeOf<{
      active: boolean;
      verified: boolean;
    }>();
  });

  test('возвращает пустой объект если нет свойств нужного типа', () => {
    type OnlyString = {
      name: string;
      city: string;
    };
    
    type NumberProps = PickedByType<OnlyString, number>;
    
    expectTypeOf<NumberProps>().toEqualTypeOf<{}>();
  });

  test('работает с объединением типов', () => {
    type Mixed = {
      id: number;
      name: string;
      value: string | number;
      active: boolean;
    };
    
    type StringOrNumberProps = PickedByType<Mixed, string | number>;
    
    expectTypeOf<StringOrNumberProps>().toMatchTypeOf<{
      id: number;
      name: string;
      value: string | number;
    }>();
  });
});

describe('Задание 3: EventHandlers<T>', () => {
  test('генерирует обработчики событий с префиксом on', () => {
    type Events = {
      click: { x: number; y: number };
      submit: { data: string };
      change: { value: string };
    };
    
    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers>().toMatchTypeOf<{
      onClick: (event: { x: number; y: number }) => void;
      onSubmit: (event: { data: string }) => void;
      onChange: (event: { value: string }) => void;
    }>();
  });

  test('правильно обрабатывает событие с именем из нескольких слов', () => {
    type Events = {
      mouseClick: { button: number };
      keyDown: { key: string };
    };
    
    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers>().toMatchTypeOf<{
      onMouseClick: (event: { button: number }) => void;
      onKeyDown: (event: { key: string }) => void;
    }>();
  });

  test('обрабатывает событие с типом void', () => {
    type Events = {
      start: void;
      end: void;
    };
    
    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers>().toMatchTypeOf<{
      onStart: (event: void) => void;
      onEnd: (event: void) => void;
    }>();
  });

  test('обрабатывает событие с объектом', () => {
    type Events = {
      custom: { id: number; payload: unknown };
    };
    
    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers>().toMatchTypeOf<{
      onCustom: (event: { id: number; payload: unknown }) => void;
    }>();
  });

  test('работает с одним событием', () => {
    type Events = {
      load: { url: string };
    };
    
    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers>().toMatchTypeOf<{
      onLoad: (event: { url: string }) => void;
    }>();
  });

  test('правильно капитализирует первую букву', () => {
    type Events = {
      click: { x: number };
      DoubleClick: { x: number };
      XMLRequest: { data: string };
    };
    
    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers>().toMatchTypeOf<{
      onClick: (event: { x: number }) => void;
      onDoubleClick: (event: { x: number }) => void;
      onXMLRequest: (event: { data: string }) => void;
    }>();
  });
});