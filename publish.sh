#!/usr/bin/env bash

set -e

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

TARGET=$1

PACKAGE_JSON="package.json"
OUT_DIR="dist"
COMMIT=$(git rev-parse --short HEAD)

if [[ ! "$TARGET" =~ ^(release|beta|dev)$ ]]; then
  echo "Usage:" $0 "<path/to/package/root> release|beta|dev"
  exit 2;
fi

echo "Installing dependencies and build"
npm ci 
npm run build:prod

PACKAGE_NAME=$(node -p "require('./package.json').name")

echo "Releasing" $PACKAGE_NAME

echo "Bumping version"

pushCommitAndTags=true
git stash 

case $TARGET in
  release)
    npm version patch --no-commit-hooks --tag-version-prefix=$PACKAGE_NAME -m "Release $PACKAGE_NAME %s"
  ;;
  beta)
    npm version prerelease --preid=beta --no-commit-hooks --tag-version-prefix=$PACKAGE_NAME -m "Release $PACKAGE_NAME %s"
  ;;
  dev)
    pushCommitAndTags=false
    npm version prerelease --preid=dev.$COMMIT --no-commit-hooks --no-git-tag-version
  ;;
esac

git stash pop

VERSION=$(node -e "console.log(require('./package.json').version)")
echo "##teamcity[buildNumber '$VERSION']"
echo "Created ${VERSION}"

echo "Publishing to npmjs.com"
npm config set "//registry.npmjs.com/:_authToken" "$NPM_TOKEN"

case $TARGET in
  release)
    npm publish --access public
  ;;
  beta)
    npm publish --access public --tag beta
  ;;
  dev)
    npm publish --access public --tag dev
  ;;
esac

npm config delete "//registry.npmjs.com/:_authToken"

git add .

git commit -m "Build and publish package: $PACKAGE_NAME to $VERSION"

if [ "$pushCommitAndTags" = true ]; then
  git push origin HEAD && git push --tags
fi

echo "Done"