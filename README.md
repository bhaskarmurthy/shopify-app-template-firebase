# Shopify + Firebase app

Example Shopify app on Firebase.

## Installation

Install `asdf` (https://github.com/asdf-vm/asdf) to manage runtime versions.
This project uses `yarn` for monrepo, and `turborepo` for build pipelines.

```sh
asdf install
yarn install
```

## Usage

```sh
# build web app and api project
yarn build

# run project locally using Firebase emulator
yarn start

# deploy project to Firebase
yarn deploy
```