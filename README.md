#  PokeBay-CLI

` PokeBay-CLI` is a TypeScript CLI application designed to streamline the process of listing various Pokémon items on eBay, including cards, graded cards, boosters, and displays. By leveraging a JSON configuration and supporting image uploads, it simplifies bulk listing operations.

## Contents
- [Installation](#installation)
- [Configuration](#configuration)
    - [.env Variables](#env-variables)
    - [Preparing Images](#preparing-images)
    - [Creating items.json](#creating-itemsjson)
- [Usage](#usage)
- [Building items.json with ChatGPT](#building-itemsjson-with-chatgpt)
- [Running the Script](#running-the-script)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Leoglme/PokeBay-CLI
cd  PokeBay-CLI
npm install
```

## Configuration

### .env Variables

Create a `.env` file based on `.env.example` provided, and fill in your eBay and Imgur API credentials:

```plaintext
# eBay Sandbox (for testing)
EBAY_APP_ID_SANDBOX=YourSandboxAppID
EBAY_DEV_ID_SANDBOX=YourSandboxDevID
EBAY_CERT_ID_SANDBOX=YourSandboxCertID
EBAY_AUTH_TOKEN_SANDBOX=YourSandboxAuthToken

# eBay Production (for live listings)
EBAY_APP_ID_PROD=YourProdAppID
EBAY_DEV_ID_PROD=YourProdDevID
EBAY_CERT_ID_PROD=YourProdCertID
EBAY_AUTH_TOKEN_PROD=YourProdAuthToken

# Imgur (for image hosting)
IMGUR_CLIENT_ID=YourImgurClientID
IMGUR_CLIENT_SECRET=YourImgurClientSecret
```

### Preparing Images

Place images of the items you wish to list in the `images` directory at the root of the project.

### Creating items.json

Create an `items.json` file at the project root with the details of the items you wish to list. Use the provided example as a template:

```json
[
  {
    "name": "Hisuian Samurott Vstar",
    "number": "230/172",
    "set": "s12a Vstar",
    "language": "Japonaise",
    "images": ["IMG_3417.jpg", "IMG_3418.jpg", "IMG_3419.jpg"],
    "isGraded": false,
    "condition": "Near Mint or Better",
    "price": 8
  }
]
```

## Usage

### Building items.json with ChatGPT

To facilitate creating the `items.json` file, use [this GPT prompt link](https://chat.openai.com/share/96b60da5-b13a-4c0c-88f7-5fc4c515f591). Provide details about your items, and ChatGPT will help structure your JSON file.

### Running the Script

To start listing your Pokémon items on eBay, run:

```bash
npm run start
```

Ensure you have completed the `.env` setup and prepared `items.json` and images as described above.

---

` PokeBay-CLI` offers a convenient way to manage eBay listings for Pokémon collectors and sellers, combining the power of automation with the flexibility of user-defined listings. Enjoy streamlining your eBay listings with ` PokeBay-CLI`!
