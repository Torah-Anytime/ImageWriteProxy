# Image Proxy

We needed a way to dynamicly overlay text over images. This proxy allows you to provide a url for the source image, the text, font, and x/y position. It will return the rendered image.

## Example usage
`/v1?url=<url to template image>&text=Dose%20%23356&textX=500&textY=8&textFont=in901xl-71-blue&textMaxWidth=100`
Will use this template image:
![template-photo](/uploads/182cc1e0e64de8fc63e2f23341ba5e87/r-ariel-mizrahi_dose_podcast_photo.jpeg)
And render it as:
![rendered-photo](/uploads/805c017b111176808091abeadf67f78a/948-podcast.png)

#### `/v1`
This is the base path

#### `url=`
The url to the template image.

#### `text=`
The url encoded text to overlay on the image. In this example, the text is `Dose #356`

#### `textX=` and `textY=`
The X and Y position of the text

#### `textFont=`
The font name to use. This font needs to be available in the container. See [font](#font)

#### `textMaxWidth=`
The maximum width of the text. If the text is wider, it will break to the next line.


## Font
We are using [JIMP](https://github.com/oliver-moran/jimp) to render the image. Jimp only accepts .fnt font files. We need to create .fnt files for each file size and color we plan on using.

https://ttf2fnt.com/ is an online converter which can convert from .ttf to .fnt.

Currently, all the .fnt files must be embedded in the container.
