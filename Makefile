install:
	npm ci
build:
	rm -rf dist
	NODE_ENV=production npx webpack
test-watch:
	node --experimental-vm-modules 'node_modules/.bin/jest' --watch
test-coverage:
	NODE_OPTIONS=--experimental-vm-modules  npx jest --coverage
test:
	NODE_OPTIONS=--experimental-vm-modules  npx jest

lint:
	npx eslint .
lint-fix:
	npx eslint --fix webpack.config.js

.PHONY: test
