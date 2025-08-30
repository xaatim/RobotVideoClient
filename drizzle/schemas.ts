import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
  uuid,
  integer,
  decimal,
  serial,
  pgEnum,
  pgSequence,
} from "drizzle-orm/pg-core";
export type robotType = typeof robotsTable.$inferSelect;
export type robotModels = typeof robotModelTable.$inferSelect;
export const userRole = pgEnum("role", ["ADMIN", "USER"]);
export type userRoleType = (typeof userRole.enumValues)[number];

export const robotSerialNoSeq = pgSequence("robots_serial_no_seq", {
  startWith: 1,
  increment: 1,
  
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: userRole("role").default("USER"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const robotModelTable = pgTable("robot_model", {
  id: serial("id").primaryKey(),
  model: text("model_name").notNull().unique(),
  modelType: text("model_type").unique().notNull(),
});

export const robotsTable = pgTable("robots", {
  id: serial("id").primaryKey(),
  modelId: serial("model_id")
    .notNull()
    .references(() => robotModelTable.id, { onDelete: "cascade" }),
  serialNo: text("serial_number").notNull().unique(),
  key: varchar("key", { length: 256 }).notNull().unique(),
  ownerId: text("owner_id").references(() => user.id),
  customName: text("custom_name").default(""),
  createdAt: timestamp("created_at").defaultNow(),
}); 

export const userRelation = relations(user, ({ many, one }) => ({
  robots: many(robotModelTable, {
    relationName: "owner",
  }),
}));
export const robotModelTableRelation = relations(
  robotModelTable,
  ({ many, one }) => ({
    robots: many(robotModelTable, {
      relationName: "modelRelation",
    }),
  })
);

export const robotTableRelation = relations(robotsTable, ({ one, many }) => ({
  owner: one(user, {
    fields: [robotsTable.ownerId],
    references: [user.id],
    relationName: "owner",
  }),
  modelRelation: one(robotModelTable, {
    fields: [robotsTable.modelId],
    references: [robotModelTable.id],
    relationName: "modelRelation",
  }),
}));
