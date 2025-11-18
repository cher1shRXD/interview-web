import type { AnalysisResult } from "../types";

const DB_NAME = "interview-db";
const DB_VERSION = 1;
const RESULT_STORE = "results";
const FILE_STORE = "files";

class InterviewDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(RESULT_STORE)) {
          db.createObjectStore(RESULT_STORE);
        }

        if (!db.objectStoreNames.contains(FILE_STORE)) {
          db.createObjectStore(FILE_STORE);
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    return this.db;
  }

  async saveResult(result: AnalysisResult): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(RESULT_STORE, "readwrite");
      const store = transaction.objectStore(RESULT_STORE);
      const request = store.put(result, "current");

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getResult(): Promise<AnalysisResult | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(RESULT_STORE, "readonly");
      const store = transaction.objectStore(RESULT_STORE);
      const request = store.get("current");

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveFile(fileData: string, fileName: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FILE_STORE, "readwrite");
      const store = transaction.objectStore(FILE_STORE);
      const request = store.put({ fileData, fileName }, "current");

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFile(): Promise<{ fileData: string; fileName: string } | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(FILE_STORE, "readonly");
      const store = transaction.objectStore(FILE_STORE);
      const request = store.get("current");

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([RESULT_STORE, FILE_STORE], "readwrite");

      const resultStore = transaction.objectStore(RESULT_STORE);
      const fileStore = transaction.objectStore(FILE_STORE);

      resultStore.clear();
      fileStore.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const db = new InterviewDB();
