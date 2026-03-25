# wws:schema

> Generate database-schema.md if the project uses a database. Skip otherwise.

**Usage:**
- `/wws:schema` — generate if needed
- `/wws:schema --force` — regenerate even if it exists

**Input:** `docs/planning/discovery.md` (for data types), codebase analysis (for existing schema)
**Output:** `docs/planning/database-schema.md` (conditional)

## Steps

1. **Check if database is needed**
   - Read `docs/planning/discovery.md`
   - Look for: database, SQL, PostgreSQL, MySQL, SQLite, MongoDB, etc. in:
     - "What data do you work with"
     - "What systems need to connect"
     - "Technical constraints"
   - Analyze codebase for ORM models, migrations, database configs
   - If no database detected: exit with message:
     ```
     No database detected in this project.
     Skipping database-schema.md generation.

     If you need database documentation later, run:
     /wws:schema --force
     ```

2. **Check if schema already exists**
   - If `docs/planning/database-schema.md` exists and no `--force`: warn and exit
   - If `--force`: proceed to regenerate

3. **Analyze data requirements**

   From discovery:
   - "What data do you work with" → list entities
   - "Where is this data currently stored" → current state
   - "Do you have any data quality issues" → constraints

   From codebase:
   - Read existing models/migrations
   - Extract tables, columns, relationships
   - Note indexes, constraints

4. **Generate schema**

   For each entity:
   - Table name
   - Columns: name, type, constraints, description
   - Relationships: one-to-many, many-to-many, etc.
   - Indexes

5. **Write database-schema.md**

   ```markdown
   # Database Schema

   **Last Updated:** [date]
   **Database Type:** [PostgreSQL / MySQL / SQLite / etc.]

   ---

   ## Overview

   [Brief description of data model]

   ---

   ## Entities

   ### [Entity Name]

   | Column | Type | Constraints | Description |
   |--------|------|-------------|-------------|
   | id | UUID | PK | Primary key |
   | name | VARCHAR(255) | NOT NULL | ... |
   | email | VARCHAR(255) | UNIQUE, NOT NULL | ... |
   | created_at | TIMESTAMP | | ... |
   | updated_at | TIMESTAMP | | ... |

   **Relationships:**
   - Belongs to [OtherEntity] (FK: other_entity_id)
   - Has many [RelatedEntity]

   **Indexes:**
   - UNIQUE(email)
   - INDEX(name)

   ---

   ## Data Quality Rules

   - [Rule 1]
   - [Rule 2]

   ---

   ## Migrations

   | Version | Description |
   |---------|-------------|
   | 001 | Initial schema |
   | 002 | Add [entity] |
   ```

6. **Checkpoint**
   ```
   docs/planning/database-schema.md generated with [N] entities.

   Next: /wws:phases — generate implementation phases
   ```
