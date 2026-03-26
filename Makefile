.PHONY: install dev add build up down logs clean shell

# Install dependencies
install:
	docker compose run --rm app bun install

# Start development server (hot reload)
dev:
	docker compose up

# Add a package (Usage: make add pkg=framer-motion)
add:
	docker compose run --rm app bun add $(pkg)

# Get a shell inside the dev container
shell:
	docker compose run --rm app sh

# --- Production Commands ---

# Build the standalone production Docker image
build:
	docker compose -f compose.yml -f compose.production.yml build app

# Start the production container
up:
	docker compose -f compose.yml -f compose.production.yml up -d

# Stop the production container
down:
	docker compose -f compose.yml -f compose.production.yml down

# Follow logs of the production container
logs:
	docker compose -f compose.yml -f compose.production.yml logs -f

# Clean up containers and volumes
clean:
	docker compose -f compose.yml -f compose.production.yml down -v
	rm -rf .next
