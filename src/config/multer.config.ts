import multer from "multer";
import path from "path";
import { Request, Response } from "express";
import fs from "fs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];
const FILE_COUNT = 1;

interface StorageOptions {
  destination: string;
  allowedFileType?: string[];
  maxFileSize?: number;
  fileCount?: number;
}

const storage = (options: StorageOptions) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const dir = path.join(process.cwd(), options.destination);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      } catch (error) {
        cb(error as Error, "");
      }
    },
    filename: (req, file, cb) => {
      try {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExt = path.extname(file.originalname);
        const sanitizedName =
          path
            .basename(file.originalname, fileExt)
            .replace(/[^a-z0-9]/gi, "") || "file";
        cb(null, `${sanitizedName}-${uniqueSuffix}${fileExt}`);
      } catch (error) {
        cb(error as Error, "");
      }
    },
  });

const fileFilter =
  (allowedTypes: string[]) =>
  (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
        )
      );
    }
  };

export const createUploadMiddleware = (options: StorageOptions) => {
  const upload = multer({
    storage: storage(options),
    limits: {
      fileSize: options.maxFileSize || MAX_FILE_SIZE,
      files: options.fileCount || FILE_COUNT,
    },
    fileFilter: fileFilter(options.allowedFileType || ALLOWED_FILE_TYPES),
  });

  return (fields: { name: string; maxCount: number }[]) =>
    (req: Request, res: Response, next: Function) => {
      upload.fields(fields)(req, res, (error: any) => {
        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              status: "error",
              message: `File size cannot exceed ${
                (options.maxFileSize || MAX_FILE_SIZE) / (1024 * 1024)
              }MB`,
              success: false,
            });
          }
          if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
              status: "error",
              message: `Too many files uploaded`,
              success: false,
            });
          }
          return res.status(400).json({
            status: "error",
            message: "File upload error occurred",
            error: error.message,
            success: false,
          });
        }
        if (error) {
          return res.status(400).json({
            status: "error",
            message: error.message,
            success: false,
          });
        }
        next();
      });
    };
};
