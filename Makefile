!.PHONY: install dev add build up down logs clean shell

# Run bun install inside docker
install:
	docker compose run --rm dev bun install

# Start development server
dev:
	docker compose up dev

# Add a package (Usage: make add pkg=framer-motion)
add:
	docker compose run --rm dev bun add $(pkg)

# Get a shell inside the dev container
shell:
	docker compose run --rm dev sh

# --- Production Commands ---

# Build the standalone production Docker image
build:
	docker build -t rats-site-prod .

# Start the production container
up:
	docker run -d -p 3000:3000 --name rats-site-prod rats-site-prod

# Stop the production container
down:
	docker rm -f rats-site-prod
	docker compose down

# Follow logs of the production container
logs:
	docker logs -f rats-site-prod

# Clean up local generated files
clean:
	rm -rf node_modules .next bun.lockb
