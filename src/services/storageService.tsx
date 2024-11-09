import { Storage } from '@ionic/storage';

const storage = new Storage();
/* await storage.create();

export default storage; */
const initializeStorage = async () => {
    await storage.create();
    return storage;
};
export default {initializeStorage}