import type { NextConfig } from "next";

//Launch
//npm run dev   or npm run build    npm start

const nextConfig: NextConfig = {
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
  },
  env: {
    ENVIRONMENT: process.env.ENVIRONMENT || "dev",
    SERVER_PORT: process.env.SERVER_PORT || "4000",
    APPLICATION_PORT: process.env.APPLICATION_PORT || "3000",
  },
};
console.log(
  `\n📱 Frontend will start on http://localhost:${process.env.APPLICATION_PORT}\n` +
    `Auth worker  http://localhost:${process.env.APPLICATION_PORT}/w-auth/login  ` +
    `\nAuth login client   http://localhost:${process.env.APPLICATION_PORT}/c-auth/login  `,
  `\nAuth Registration client   http://localhost:${process.env.APPLICATION_PORT}/c-auth/registration  `,
  `\n Reception main   http://localhost:${process.env.APPLICATION_PORT}/reception/main  `,
    `\n Admin main   http://localhost:${process.env.APPLICATION_PORT}/admins/main  `,
    `\n Doctor main   http://localhost:${process.env.APPLICATION_PORT}/doctor/main  `,
);

export default nextConfig;
