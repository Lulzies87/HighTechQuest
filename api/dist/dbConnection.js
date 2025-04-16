"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = connectToDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToDB() {
    if (!process.env.CONN_STRING) {
        console.warn("No connection string provided. Skipping database connection.");
        return;
    }
    await mongoose_1.default.connect(process.env.CONN_STRING);
}
