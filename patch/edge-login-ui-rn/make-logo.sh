#!/usr/bin/env bash

# path where we will override images
PATH_OUTPUT="node_modules/edge-login-ui-rn/src/native/assets/edgeLogo/";

#our image
IMAGE="${BASH_SOURCE%/*}/image.png";


convert -resize 150x- $IMAGE $PATH_OUTPUT"Edge_logo_L.png";
convert -resize 300x- $IMAGE $PATH_OUTPUT"Edge_logo_L@2x.png";
convert -resize 450x- $IMAGE $PATH_OUTPUT"Edge_logo_L@3x.png";

convert -resize 130x- $IMAGE $PATH_OUTPUT"Edge_logo_S.png";
convert -resize 260x- $IMAGE $PATH_OUTPUT"Edge_logo_S@2x.png";
convert -resize 390x- $IMAGE $PATH_OUTPUT"Edge_logo_S@3x.png";

echo 'image resize finished';
