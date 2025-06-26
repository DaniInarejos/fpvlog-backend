import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import configs from "./index";

const app = initializeApp(configs.firebase);
export const storage = getStorage(app);