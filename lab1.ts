interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return { id, name, email, isActive };
}

interface Book {
    title: string;
    author: string;
    year?: number;
    genre: 'fiction' | 'non-fiction';
}

function createBook(book: Book): Book {
    return book;
}

function calculateArea(shape: 'circle', radius: number): number;
function calculateArea(shape: 'square', side: number): number;
function calculateArea(shape: 'circle' | 'square', param: number): number {
    if (shape === 'circle') return Math.PI * param * param;
    return param * param;
}

type Status = 'active' | 'inactive' | 'new';

function getStatusColor(status: Status): string {
    if (status === 'active') return 'green';
    if (status === 'inactive') return 'red';
    return 'blue';
}

type StringFormatter = (input: string, uppercase?: boolean) => string;

const capitalizeFirst: StringFormatter = (input, uppercase = false) => {
    if (input.length === 0) return input;
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

const trimAndTransform: StringFormatter = (input, uppercase = false) => {
    const trimmed = input.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

function getFirstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

interface HasId {
    id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return items[i];
        }
    }
    return undefined;
}

console.log('=== Задание 1 ===');
const user = createUser(1, 'Даниил Медведев');
console.log(user);

console.log('=== Задание 2 ===');
const book1 = createBook({ title: 'Евгений Онегин', author: 'Александр Пушкин', year: 1831, genre: 'fiction' });
const book2 = createBook({ title: 'Гарри Поттер', author: 'Джоан Роулинг', genre: 'fiction' });
console.log(book1, book2);

console.log('=== Задание 3 ===');
console.log('Площадь круга (радиус 5):', calculateArea('circle', 5));
console.log('Площадь квадрата (радиус 4):', calculateArea('square', 4));

console.log('=== Задание 4 ===');
console.log('active ->', getStatusColor('active'));
console.log('inactive ->', getStatusColor('inactive'));
console.log('new ->', getStatusColor('new'));

console.log('=== Задание 5 ===');
console.log(capitalizeFirst('hello world'));
console.log(trimAndTransform('  hello world  ', true));

console.log('=== Задание 6 ===');
console.log('Первый элемент [1,2,3]:', getFirstElement([1, 2, 3]));
console.log('Первый элемент ["a","b"]:', getFirstElement(['a', 'b']));
console.log('Первый элемент []:', getFirstElement([]));

console.log('=== Задание 7 ===');
const users = [
    { id: 1, name: 'Александр' },
    { id: 2, name: 'Андрей' },
    { id: 3, name: 'Даниил' }
];
console.log('Поиск id=3:', findById(users, 3));

export {
  createUser,
  createBook,
  calculateArea,
  getStatusColor,
  capitalizeFirst,
  trimAndTransform,
  getFirstElement,
  findById
};