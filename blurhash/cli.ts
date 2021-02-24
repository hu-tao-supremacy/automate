import * as tkt from "tkt";
import sharp from "sharp";
import { encode } from "blurhash";
import axios from "axios";

tkt
  .cli({})
  .command(
    "hash",
    "Encodes pixels to a blurha.sh string",
    {
      url: {
        type: "string",
        desc: "Image URL",
        demand: true,
      },
      width: {
        type: "number",
        demand: true,
      },
      height: {
        type: "number",
        demand: true,
      },
    },
    async (args) => {
      const { url, width, height } = args;
      const input = (await axios({ url: url, responseType: "arraybuffer" }))
        .data as Buffer;
      const buffer = await sharp(input)
        .raw()
        .ensureAlpha()
        .resize(width, height, { fit: "inside" })
        .toBuffer();
      const hash = encode(new Uint8ClampedArray(buffer), width, height, 4, 4);
      console.log(url, hash);
    }
  )
  .parse();
