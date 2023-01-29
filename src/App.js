import { Client } from "boardgame.io/client";
import { NotStuckInTraffic } from "./Game";

class NotStuckInTrafficClient {
    constructor() {
        this.client = Client({game: NotStuckInTraffic});
        this.client.start();
    }
}

const app = new NotStuckInTrafficClient();