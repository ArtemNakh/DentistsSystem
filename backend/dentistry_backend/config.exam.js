"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// config.ts
exports.default = () => ({
    environment: process.env.ENVIRONMENT || 'dev',
    port: parseInt(process.env.PORT ?? '3000', 10),
    database: {
        host: process.env.MYSQL_HOST ?? 'localhost',
        user: process.env.MYSQL_USER ?? 'BaseRoot',
        db: process.env.MYSQL_DB ?? 'DentistClinic',
        password: process.env.MYSQL_PASSWORD ?? '',
        port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
    },
});
