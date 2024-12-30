import { FileService } from './fileService';

export class InputService {
  /**
   * Loads multiple CSV files into arrays of generic type T.
   * @param filePaths - Array of file paths to CSV files.
   * @param transform - Function to transform raw data into type T.
   * @returns Array of arrays containing data of type T.
   */
  static async loadInputs<T>(
    filePaths: string[],
    transform: (row: any) => T
  ): Promise<T[][]> {
    const tables: T[][] = [];
    for (const filePath of filePaths) {
      const data = await FileService.readCSV(filePath);
      tables.push(data.map(transform));
    }
    return tables;
  }

  /**
   * Saves input tables to a JSON file.
   * @param filePath - The path to the JSON file.
   * @param tables - Array of arrays containing data of type T.
   */
  static saveInputsToJSON<T>(filePath: string, tables: T[][]): void {
    FileService.writeJSON(filePath, tables);
  }
}
