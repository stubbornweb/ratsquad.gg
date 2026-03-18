# agents:search

> Search for agents in the VoltAgent catalog.

**Usage:**
- `/agents:search <query>` — search by keyword
- `/agents:search <query> --category <cat>` — search within a category

**Categories:**
`01-core-development` · `02-language-specialists` · `03-infrastructure` · `04-quality-security` · `05-data-ai` · `06-developer-experience` · `07-specialized-domains` · `08-business-product` · `09-meta-orchestration` · `10-research-analysis`

**Examples:**
```
/agents:search php
/agents:search typescript --category 02-language-specialists
/agents:search docker
/agents:search test
```

Invoke `agent-installer` in search mode:
> "Search for agents matching '$ARGUMENTS' in the awesome-claude-code-subagents catalog. Fetch README.md from https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main/README.md. Filter by query. IF --category: filter to that category. Show up to 20 results as a table: Agent | Category | Description."
