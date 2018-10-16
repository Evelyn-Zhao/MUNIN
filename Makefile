
dev-front:
	cd front && npm run watch

build-front:
	cd front && npm run build

run-server:
	python3 ./server/manage.py runserver

dev:
	(make run-server; [ "$?" -lt 2 ] && kill "$$") & (make dev-front; [ "$?" -lt 2 ] && kill "$$") & wait

rsync:
	rsync -av --force . u5631546@hcc-workshop.anu.edu.au:~/DMT

deploy: build-front rsync
	@echo "😂  Done"

migrate:
	python3 ./server/manage.py makemigrations
	python3 ./server/manage.py migrate
	@echo "Message: migration is done"
	
