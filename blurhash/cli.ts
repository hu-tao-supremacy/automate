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
    },
    async (args) => {
      const { url } = args;
      const input = (await axios({ url: url, responseType: "arraybuffer" }))
        .data as Buffer;
      const s = sharp(input);
      const metadata = await s.metadata();
      let width = metadata.width!;
      let height = metadata.height!;
      const buffer = await s
        .raw()
        .ensureAlpha()
        .resize(width, height, { fit: "inside" })
        .toBuffer();
      const hash = encode(new Uint8ClampedArray(buffer), width, height, 4, 4);
      console.log(url, hash);
    }
  )
  .parse();
