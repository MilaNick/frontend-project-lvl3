install:
	npm ci
build:
	rm -rf dist
	NODE_ENV=production npx webpack
# test-watch:
# 	node --experimental-vm-modules 'node_modules/.bin/jest' --watch
# test-coverage:
# 	NODE_OPTIONS=--experimental-vm-modules  npx jest --coverage
# test:
# 	NODE_OPTIONS=--experimental-vm-modules  npx jest
make lint:
	npx eslint .
lint-fix:
	npx eslint --fix src/view.js

.PHONY: test
