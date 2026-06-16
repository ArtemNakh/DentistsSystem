import type { NextConfig } from "next";

//Launch
//npm run dev   or npm run build    npm start

const nextConfig: NextConfig = {
  onDemandEntries: {
    maxInactiveAge: 400 * 60 * 1000,
  },
  env: {
    ENVIRONMENT: process.env.ENVIRONMENT || "dev",
    SERVER_PORT: process.env.SERVER_PORT || "4000",
    APPLICATION_PORT: process.env.APPLICATION_PORT || "3000",
  },
};
console.log(
  `\n📱 Frontend will start on http://localhost:${process.env.APPLICATION_PORT}\n`,
  `\n\nClient Pages`,
  `\n Auth login client   http://localhost:${process.env.APPLICATION_PORT}/c-auth/login  `,
  `\n Auth Registration client   http://localhost:${process.env.APPLICATION_PORT}/c-auth/registration  `,
  `\n main  http://localhost:${process.env.APPLICATION_PORT}/client/main`,
  `\n\nWorker Pages`,
  `\n Auth worker  http://localhost:${process.env.APPLICATION_PORT}/w-auth/login  `,
  `\n Reception main   http://localhost:${process.env.APPLICATION_PORT}/reception/main  `,
  `\n Admin main   http://localhost:${process.env.APPLICATION_PORT}/admins/main  `,
  `\n Doctor main   http://localhost:${process.env.APPLICATION_PORT}/doctor/main  `,
);

export default nextConfig;
