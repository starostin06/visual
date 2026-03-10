import { readFile, writeFile } from 'fs/promises';

export function csvToJSON(lines: string[], delimiter: string): Record<string, string | number>[] {
    if (!lines || lines.length === 0) {
        throw new Error('CSV данные пусты');
    }

    if (!delimiter || delimiter.length === 0) {
        throw new Error('Разделитель не может быть пустым');
    }

    if (!lines[0] || lines[0].trim().length === 0) {
        throw new Error('CSV не содержит заголовков');
    }

    const headers = lines[0].split(delimiter).map(header => header.trim());
    
    if (headers.length === 0 || headers.every(h => h === '')) {
        throw new Error('CSV не содержит заголовков');
    }

    const result: Record<string, string | number>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.length === 0) {
            continue;
        }

        const values = line.split(delimiter).map(v => v.trim());

        if (values.length !== headers.length) {
            throw new Error(
                `Строка ${i + 1} содержит ${values.length} полей, но заголовок содержит ${headers.length} полей`
            );
        }

        const obj: Record<string, string | number> = {};

        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            const value = values[j];

            if (/^-?\d+$/.test(value)) {
                obj[header] = parseInt(value, 10);
            } 
            else if (/^-?\d+\.\d+$/.test(value)) {
                obj[header] = parseFloat(value);
            } 
            else {
                obj[header] = value;
            }
        }

        result.push(obj);
    }

    return result;
}

export async function formatCSVFileToJSONFile(
    input: string, 
    output: string, 
    delimiter: string
): Promise<void> {
    try {
        const fileContent = await readFile(input, 'utf-8');
        
        const lines = fileContent.split('\n').filter((line: string) => line.trim().length > 0);
        
        if (lines.length === 0) {
            throw new Error('Входной файл пуст');
        }

        const jsonData = csvToJSON(lines, delimiter);
        
        await writeFile(output, JSON.stringify(jsonData, null, 2), 'utf-8');
    } catch (error) {
        throw error;
    }
}