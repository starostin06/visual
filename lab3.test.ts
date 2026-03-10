import { describe, it, expect } from 'vitest';
import { csvToJSON } from './lab3';

describe('csvToJSON', () => {
    describe('Тесты на корректных входных данных', () => {
        it('должен преобразовывать CSV с числами и строками', () => {
            const input = [
                "id;name;age;active",
                "1;Дмитрий;25;true",
                "2;Даниил;30;false",
                "3;Александр;22;true"
            ];
            
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { id: 1, name: 'Дмитрий', age: 25, active: 'true' },
                { id: 2, name: 'Даниил', age: 30, active: 'false' },
                { id: 3, name: 'Александр', age: 22, active: 'true' }
            ]);
        });

        it('должен преобразовывать CSV с числами с плавающей точкой', () => {
            const input = [
                "product,price,quantity",
                "apple,99.99,10",
                "banana,150.50,5"
            ];
            
            const result = csvToJSON(input, ',');
            
            expect(result).toEqual([
                { product: 'apple', price: 99.99, quantity: 10 },
                { product: 'banana', price: 150.50, quantity: 5 }
            ]);
        });

        it('должен обрабатывать пустые строки в данных', () => {
            const input = [
                "id,name",
                "1,Дмитрий",
                "",
                "2,Даниил",
                "   ",
                "3,Александр"
            ];
            
            const result = csvToJSON(input, ',');
            
            expect(result).toEqual([
                { id: 1, name: 'Дмитрий' },
                { id: 2, name: 'Даниил' },
                { id: 3, name: 'Александр' }
            ]);
        });

        it('должен обрезать пробелы вокруг значений', () => {
            const input = [
                "id ; name ; age",
                " 1 ; Дмитрий ; 25 ",
                " 2 ; Даниил ; 30 "
            ];
            
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { id: 1, name: 'Дмитрий', age: 25 },
                { id: 2, name: 'Даниил', age: 30 }
            ]);
        });

        it('должен работать с разными разделителями', () => {
            const input = [
                "id|name|city",
                "1|Дмитрий|Иркутск",
                "2|Даниил|Братск"
            ];
            
            const result = csvToJSON(input, '|');
            
            expect(result).toEqual([
                { id: 1, name: 'Дмитрий', city: 'Иркутск' },
                { id: 2, name: 'Даниил', city: 'Братск' }
            ]);
        });

        it('должен обрабатывать отрицательные числа', () => {
            const input = [
                "id,temperature",
                "1,-5",
                "2,-10.5"
            ];
            
            const result = csvToJSON(input, ',');
            
            expect(result).toEqual([
                { id: 1, temperature: -5 },
                { id: 2, temperature: -10.5 }
            ]);
        });
    });

    describe('Тесты на некорректных входных данных', () => {
        it('должен выбрасывать ошибку при пустом массиве', () => {
            expect(() => csvToJSON([], ';')).toThrow('CSV данные пусты');
        });

        it('должен выбрасывать ошибку при пустом разделителе', () => {
            const input = ["header", "data"];
            expect(() => csvToJSON(input, '')).toThrow('Разделитель не может быть пустым');
        });

        it('должен выбрасывать ошибку при отсутствии заголовков', () => {
            const input = [""];
            expect(() => csvToJSON(input, ';')).toThrow('CSV не содержит заголовков');
        });

        it('должен выбрасывать ошибку при заголовках из пустых строк', () => {
            const input = [";;;"];
            expect(() => csvToJSON(input, ';')).toThrow('CSV не содержит заголовков');
        });

        it('должен выбрасывать ошибку при несовпадении количества полей', () => {
            const input = [
                "id;name;age",
                "1;Дмитрий",
                "2;Даниил;30;extra"
            ];
            
            expect(() => csvToJSON(input, ';')).toThrow(
                'Строка 2 содержит 2 полей, но заголовок содержит 3 полей'
            );
        });

        it('должен выбрасывать ошибку при несовпадении в середине файла', () => {
            const input = [
                "id;name;age",
                "1;Дмитрий;25",
                "2;Даниил",
                "3;Александр;30"
            ];
            
            expect(() => csvToJSON(input, ';')).toThrow(
                'Строка 3 содержит 2 полей, но заголовок содержит 3 полей'
            );
        });
    });
});