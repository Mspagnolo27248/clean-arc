import * as fs from 'fs';


/**
 * Get a list of filenames from a folder.
 * @param folderPath - The path to the folder.
 * @returns An array of filenames in the folder.
 */
export function getFilenames(folderPath: string): string[] {
    try {
        // Ensure the folder path is valid
        if (!fs.existsSync(folderPath)) {
            throw new Error(`The folder path "${folderPath}" does not exist.`);
        }

        // Read the directory contents
        const files = fs.readdirSync(folderPath);

        // Return the filenames
        return files;
    } catch (error) {
        if(error instanceof Error){
            console.error(`Error reading folder: ${error.message}`);
           
        }     
        console.error(`Error reading folder: error accessing data`);
   
        return [];
    }
}