
// export abstract class UseCase { 
//     abstract execute(): void|Promise<any>;
//   }


export interface UseCase {
   execute(...params: any[]): Promise<any> | void;
}