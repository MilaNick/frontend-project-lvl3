install:
	npm ci
build:
	rm -rf dist
	NODE_ENV=production npx webpack

make lint:
	npx eslint .

.PHONY: test
