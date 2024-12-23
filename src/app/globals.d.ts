import type { DefaultUser } from "next-auth";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      TRACE_EXPORTER_URL: string | /* for local */ undefined;
    }
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    tenants?: {
      id: tu.tenant.id;
      name: tu.tenant.name;
      role: tu.role;
    }[];
  }

  interface Session {
    user: User;
  }
}
