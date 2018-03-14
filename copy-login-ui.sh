#!/bin/sh
# Usage: copy-core [path-to-core-ui]
set -e
src=${1:-../edge-login-ui/packages/edge-login-ui-rn}

dest=node_modules/edge-login-ui-rn
mkdir -p $dest

cp    $src/package.json $dest/package.json
cp -r $src/src/ $dest/src/
