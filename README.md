#  PokeBay-CLI

Typescript cli tool to simplify and automate the listing of Pokémon items on eBay, such as cards, graded cards, boosters, displays and so on.
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

Create a `.env` file based on `.env.example` provided, and fill in your [eBay](https://developer.ebay.com/develop/apis) and [imgbb API](https://api.imgbb.com/) credentials:

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

# IMGBB (for image hosting)
IMGBB_API_KEY=YourImgbbAPIKey
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

Here is the type of item in the `items.json` file:

```typescript
type Card = {
  name: string;
  number: string;
  set: string;
  language: string;
  images: string[];
  isGraded: boolean;
  grade?: number;
  gradeCompany?: string;
  startPrice?: number;
  price?: number;
  condition?: EbayConditions;
  quantity?: number;
  minimumBestOfferAmount?: number;
}
```


## Usage

### Building items.json with ChatGPT

To facilitate creating the `items.json` file, use [this GPT prompt link](https://chat.openai.com/share/96b60da5-b13a-4c0c-88f7-5fc4c515f591). Provide details about your items, and ChatGPT will help structure your JSON file.

Pour ajouter une explication sur votre nouvelle commande `npm run generateJson` dans le README de votre projet PokeBay-CLI, vous pourriez insérer une nouvelle section sous **Usage**, détaillant la fonction de cette commande et comment l'utiliser. Voici une suggestion de formulation pour cette addition :

---

### Generating `items.json` Automatically

In addition to manually creating `items.json` or using ChatGPT to build it, PokeBay-CLI now supports automatic generation of this file using a new command:

```bash
npm run generateJson
```

This command simplifies the process of listing Pokémon items on eBay by automatically filling in the necessary item information based on a set of predefined keywords.

### How It Works

1. **Prepare a `baseInfos` Array**: First, define a `baseInfos` array in the `generateJson.ts` script. Each element of this array should include a `keyword` for searching eBay and an array of `images` for the item.

   Example:
    ```typescript
    const baseInfos: BaseInfo[] = [
        {
            keyword: '55/102',
            images: ['IMG_3018.jpg', 'IMG_3019.jpg']
        }
    ];
    ```

2. **Run the Command**: Execute the command in your terminal:
    ```bash
    npm run generateJson
    ```
   This will search eBay for items matching each keyword, fetch details, and generate an `items.json` file at the project root, filled with the structured data for your listings.

#### Requirements

Before running the command, ensure you have:

- Configured your `.env` file with the necessary eBay and imgbb API credentials.
- Placed the images for your items in the `images` directory as specified in your `baseInfos` array.

This feature aims to streamline the setup process, making it quicker and easier to start listing your Pokémon items on eBay.

### Running the Script

To start listing your Pokémon items on eBay, run:

```bash
npm run start
```

Ensure you have completed the `.env` setup and prepared `items.json` and images as described above.

---

### Developed with ❤️ by Léo Guillaume (Leoglme) 
License: MIT
[dibodev](https://dibodev.com)
