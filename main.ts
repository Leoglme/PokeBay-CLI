import fs from 'fs';
import path from 'path';
import type { Card } from '#types/payload';
import EbayXmlBuilderService from './services/EbayXmlBuilderService';
import OsService from "#services/OsService";
import EbayService from "#services/EbayService";

// Read the JSON file containing the items
const itemsFilePath: string = path.join(OsService.getDirname(), '../', 'items.json')
const itemsJson: string = fs.readFileSync(itemsFilePath, 'utf8');
const cards: Card[] = JSON.parse(itemsJson);

// Browse each item to generate and save an XML file
for (const card of cards) {
    const xml: string = await EbayXmlBuilderService.buildAddItemXML(card);

    // Create a secure file name by replacing special characters
    const fileName: string = card.name.replace(/[^a-zA-Z0-9]/g, '_') + '.xml';
    const filePath: string = path.join(OsService.getDirname(), '../xml', fileName);

    // Save the XML to a file
    fs.writeFileSync(filePath, xml, 'utf8');
    console.log(`XML pour '${card.name}' sauvegardé sous '${fileName}'`);

    // Add item to the eBay store
    await EbayService.addItem(xml);
}
