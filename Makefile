CURRENT_DIR = $(shell pwd)

IMAGE_REPO := quay.io/redhat-scholars

.DEFAULT_GOAL := all

.PHONY:
build:
	@docker build --rm --no-cache -t $(IMAGE_REPO)/course-site-builder  $(CURRENT_DIR)

push: build
	@docker push $(IMAGE_REPO)/course-site-builder

all:  build push