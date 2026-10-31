.PHONY: help install build serve audit clean

PORT ?= 4000

help: ## Show available development commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install Ruby dependencies locally into vendor/bundle
	bundle install --path vendor/bundle

build: ## Build production static site into _site/
	bundle exec jekyll build --trace

serve: ## Start local development server (default PORT=4000)
	bundle exec jekyll serve --host 127.0.0.1 --port $(PORT)

audit: build ## Build site and run automated SEO, link, schema & GEO audit
	python3 scripts/audit_site.py

clean: ## Remove generated _site/ and Jekyll caches
	rm -rf _site .sass-cache .jekyll-cache .jekyll-metadata
