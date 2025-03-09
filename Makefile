shell:
	docker-compose exec front sh 

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

psql:
	docker-compose exec front sh -c 'source .env.local && psql "$$POSTGRES_URL"'

psql-prd:
	docker-compose exec front sh -c 'source .env.production && psql "$$POSTGRES_URL"'

backup-prd:
	docker-compose exec front sh -c 'source .env.production && pg_dump -U "$$POSTGRES_USER" -h "$$POSTGRES_HOST" -p 5432 -d "postgres" -F c -b -v -f ./.backup/prd/backup.sql'

restore-local:
	docker-compose exec front sh -c 'source .env.local && pg_restore -U postgres -h db -f ./.backup/local/backup.sql'
