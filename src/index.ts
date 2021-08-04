import express from "express";
import Jimp from "jimp";
import morgan from "morgan";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("tiny"));

app.get("/v1", async (req, res) => {
  const {
    url,
    text,
    textX = 0,
    textY = 0,
    textFont = "in901xl-32-black",
    textRotate = 0,
    textMaxWidth,
  } = req.query;

  if (!url) {
    return res.status(404).send();
  }

  let image: Jimp;
  try {
    image = await Jimp.read(url.toString());
  } catch (e) {
    console.log({ e });

    return res.send();
  }

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
