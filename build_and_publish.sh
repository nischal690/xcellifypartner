#!/bin/bash
sh build.sh $1
az acr login --name xcellifyrepo --password CQlHj8OK3AJmB3NkRbzC6Q+w1VmsSjcowi2I68x36H+ACRDyp1L8 --username xcellifyrepo
docker buildx create --name multi-arch \
  --platform "linux/arm64,linux/amd64,linux/arm/v7" \
  --driver "docker-container"
docker buildx use multi-arch
docker buildx build  --platform linux/amd64,linux/arm64 -t xcellifyrepo.azurecr.io/xcellify/partner:$1 --push .
