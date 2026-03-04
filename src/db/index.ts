// CFS Terminal Operating System - Database Client

import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

export const db = createDatabase(schema);

// Export schema for use in queries
export { schema };
