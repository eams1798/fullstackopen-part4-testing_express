import dotenv from "dotenv";
dotenv.config();

let MONGODB_URI: string;

if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI || "";
} else {
  MONGODB_URI = process.env.MONGODB_URI || "";
}

const PORT = process.env.PORT || "";

export { MONGODB_URI, PORT };
