import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../../drizzle/db";
import { userRoleType } from "../../drizzle/schemas";

export const auth = betterAuth({
  trustedOrigins: ["wzx5svn0-3000.asse.devtunnels.ms", "localhost:3000"],
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER" as userRoleType,
        input: false, // don't allow user to set role
      },
    },
  },

  /** if no database is provided, the user data will be stored in memory.
   * Make sure to provide a database to persist user data **/
});
