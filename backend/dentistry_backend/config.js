"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    environment: process.env.ENVIRONMENT || 'dev',
    port: parseInt(process.env.PORT ?? '5000', 10),
});
//# sourceMappingURL=config.js.map