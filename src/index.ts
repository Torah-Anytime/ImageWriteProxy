import express from "express";
import Jimp from "jimp";
import morgan from "morgan";
import axios, { AxiosError, AxiosResponse } from "axios";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("tiny"));

// I added a catch all on the route so we can add arbitrary information after and
// it'll still resolve properly.
// Reason: When downloading an image in the browser, the default name is the last
// directory of the path. The will allow us to use `/v1/661-r-meir-simcha-sperling_dose_podcast`
// for the url.
app.get("/v1*", async (req, res) => {
  const {
    url,
    text,
    textX = 0,
    textY = 0,
    // Font can be generated https://ttf2fnt.com/
    // The blue color is: r: 5 g: 95 b: 182
    textFont = "in901xl-32-black",
    textRotate = 0,
    textMaxWidth,
  } = req.query;

  if (!url) {
    return res.status(404).send();
  }

  let response: AxiosResponse<any>;

  try {
    response = await axios.get(url.toString(), {
      responseType: "arraybuffer",
    });
  } catch (e) {
    console.log("logging error");

    console.log({ e });

    if (axios.isAxiosError(e)) {
      if (e.response?.status) {
        res.status(e.response.status);
      } else {
        res.status(400);
      }
      return res.send(e.code);
    } else {
      return res.status(500).send();
    }
  }

  const image = await Jimp.read(response.data);

  if (text) {
    const font = await Jimp.loadFont(`font/${textFont}/${textFont}.fnt`);

    if (textRotate && Number.parseFloat(textRotate.toString()) !== 0) {
      console.log("rotating");

      const fontCanvas = await Jimp.create(1000, 1000);

      fontCanvas.print(font, 0, 0, text);

      // See this issue why we need to scale it first
      // https://github.com/oliver-moran/jimp/issues/388
      fontCanvas
        .scale(4)
        .rotate(Number.parseFloat(textRotate.toString()))
        .scale(0.25);

      image.blit(
        fontCanvas,
        Number.parseFloat(textX.toString()),
        Number.parseFloat(textY.toString())
      );
    } else {
      image.print(
        font,
        Number.parseFloat(textX.toString()),
        Number.parseFloat(textY.toString()),
        {
          text,
          alignmentX: textMaxWidth ? Jimp.HORIZONTAL_ALIGN_CENTER : undefined,
        },
        textMaxWidth ? Number.parseFloat(textMaxWidth.toString()) : undefined
      );
    }
  }

  const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
  res.set("Content-Type", Jimp.MIME_PNG).send(buffer);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
