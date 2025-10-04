import multer from "multer";
export declare const router: import("express-serve-static-core").Router;
declare class FileMiddleware {
    filename: string;
    readonly diskLoader: multer.Multer;
}
export declare const fileUpload: FileMiddleware;
export {};
//# sourceMappingURL=upload.d.ts.map