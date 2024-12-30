import fs from 'fs';
import csv from 'csv-parser';

export class FileService {
  static readCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const data: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => data.push(row))
        .on('end', () => resolve(data))
        .on('error', (error) => reject(error));
    });
  }

  static writeCSV(filePath: string, data: any[]): void {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(',')).join('\n');
    fs.writeFileSync(filePath, `${headers}\n${rows}`);
  }

  static readJSON(filePath: string): any {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  static writeJSON(filePath: string, data: any): void {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}
