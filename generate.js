const { NETWORK } = require('./Network.js')

const fs = require("fs");
const fs_extra = require("fs-extra");

const network = NETWORK.eth;
const collection_size = 5
const hidden = false;
const CID = "your_cid";
const name = "Your collection name";
const symbol = "Your collection symbol";
const description = "Your collection description";
const fee_basis = 1000; // Define how much % you want from secondary market sales 1000 = 10%

/*
  --------------- ONLY VALID FOR SOLANA METADATA ----------------

  A collection can have multiple creators, the shares value indicates the % of the earnings an address will get from secondary market sales
  if you put more than 1 creator remember that the sum of all their fees must be 100
*/

const creators = [
  //Creator 1 Example
  {
    "address": "0x1Example",
    "share": 50
  },
  //Creator 2 Example
  {
    "address": "0x2Example",
    "share": 50
  },
]


fs_extra.emptyDirSync("./metadata")
hidden ? generateHidden() : generateMetadata();

function generateMetadata() {
  for(let i=0; i<collection_size; i++){
    let jstring = fs.readFileSync("./attributes.json", "utf-8");
    let traits = JSON.parse(jstring)
    let edition = network == "eth" ? i+1 : i;
    const metas = network == "eth" ?
    {
      "name":  `${name} #${edition}`,
      "description": description,
      "image": `ipfs://${CID}/${edition}.png`,
      "edition": edition,
      "attributes": traits
    }

    :

    {
      "name":  `${name} #${edition}`,
      "symbol": symbol,
      "description": description,
      "seller_fee_basis_points": fee_basis, // Define how much % you want from secondary market sales 1000 = 10%
      "image": `${edition}.png`,
      "edition": edition,
      "attributes": traits,
      "properties": {
        "files": [
          {
            "uri": `${edition}.png`,
            "type": "image/Replace with your image type"
          }
        ],
        "category": "image",
        "creators": creators
      }
    }
  
    fs.writeFileSync(
      `metadata/${edition+'.json'}`,
      JSON.stringify(metas, null, 2)
    );
  
    console.log(`${(edition)+'.json'} Created!`);
  }
}

function generateHidden() {
  const meta = {
    "name":  name,
    "description": description,
    "image": `ipfs://${CID}/replace with the name of your hidden image.png`
  };

  fs.writeFileSync(
    `metadata/hidden.json`,
    JSON.stringify(meta, null, 2)
  );

  console.log(`Hidden metadata created!`);
}