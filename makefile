REPORTER=dot
GREP=''

test:
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) --grep $(GREP)

test-watch:
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) --grep $(GREP) --growl --watch

.PHONY: test
