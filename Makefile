NS ?= newtonlabs
VERSION ?= latest
IMAGE_NAME ?= fargate-rules-engine
CONTAINER_INSTANCE ?= default
PORTS ?= -p 8080:8080
CLUSTER_NAME ?= POC-DEV-cluster
SERVICE_NAME ?= POC-DEV-rules

.PHONY: build build-arm push push-arm shell shell-arm run run-arm start start-arm stop stop-arm rm rm-arm release release-arm

build: Dockerfile
	docker build -t $(NS)/$(IMAGE_NAME):$(VERSION) .

push:
	docker push $(NS)/$(IMAGE_NAME):$(VERSION)

run:
	docker run --rm --name $(IMAGE_NAME)-$(CONTAINER_INSTANCE) $(PORTS) $(VOLUMES) $(ENV) $(NS)/$(IMAGE_NAME):$(VERSION)

release: build
	make push -e VERSION=$(VERSION)

deploy:
	aws ecs update-service --cluster $(CLUSTER_NAME) --service $(SERVICE_NAME) --force-new-deployment --region us-east-1

default: build
