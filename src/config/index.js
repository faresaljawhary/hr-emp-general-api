import dotenv from "dotenv";
dotenv.config();
const config = {
  app: {
    name: "hr-employment-api",
    port: process.env.PORT,
    env: process.env.NODE_ENV || "development",
  },
  activeDirectory: {
    url: process.env.ACTIVE_DIRECTORY_URL,
    baseDN: process.env.ACTIVE_DIRECTORY_BASE_DN,
  },
  auth: {
    securityCode: process.env.AUTH_SECURITY_CODE,
  },
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
      encrypt: true, // Use SSL encryption
      trustServerCertificate: true, // Trust self-signed certificates
    },
  },
  encrypt: {
    algorithm: process.env.AlGORITHM_ENCRYPT,
    key: process.env.KEY_ENCRYPT,
  },
};

export default config;
