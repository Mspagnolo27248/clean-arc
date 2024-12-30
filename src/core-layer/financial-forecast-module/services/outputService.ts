import { FileService } from './fileService';

export class OutputService {
  /**
   * Saves generic data to a JSON file.
   * @param filePath - The path to the JSON file.
   * @param data - The data to save, of type T.
   */
  static saveOutput<T>(filePath: string, data: T): void {
    FileService.writeJSON(filePath, data);
  }

  /**
   * Loads data of type T from a JSON file.
   * @param filePath - The path to the JSON file.
   * @returns The loaded data of type T.
   */
  static loadOutput<T>(filePath: string): T {
    return FileService.readJSON(filePath);
  }
}
