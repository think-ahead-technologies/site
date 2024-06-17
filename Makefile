
dev:
	npm run dev

build:
	npm run build

format:
	npm run format

check:
	npm run format:check
	./scripts/check_translations.sh

clean:
	rm -rf dist src/pages/en src/pages/de/*.astro src/pages/de/*/
