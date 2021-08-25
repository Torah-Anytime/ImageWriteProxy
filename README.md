# Image Proxy

We needed a way to dynamicly overlay text over images. This proxy allows you to provide a url for the source image, the text, font, and x/y position. It will return the rendered image.

## Example usage
```
/v1?url=https://git.bitbean.com/ta/image_proxy/uploads/182cc1e0e64de8fc63e2f23341ba5e87/r-ariel-mizrahi_dose_podcast_photo.jpeg&text=Dose%20%23356&textX=500&textY=8&textFont=in901xl-71-blue&textMaxWidth=100
```
Will use this template image:

<img src="https://user-images.githubusercontent.com/34072688/130798640-e93a4694-9a2c-4f97-8228-0d3987e8c9af.jpeg"  width="120">

And render it as:

<img src="https://user-images.githubusercontent.com/34072688/130798737-934af418-546d-4ccd-a5c5-e04a988da5ee.png"  width="120">

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

The font we use currently is [IN901XL](/uploads/97e4953010d55b4870d65fa296a504c0/IN901XK.ttf). To create more variants of this font:

1. Go to https://ttf2fnt.com/
1. Upload the font file
1. Set the size and color. (The "blue" color currently in use is `rgb(5, 95, 182)`)
1. Click "Convert"
1. Unzip the directory
1. Rename the directory in this format:
    ```
    <font name in lowercase>-<font size>-<color>
    ```
1. Open the directory and rename the `.fnt` file to match the folder name with the `.fnt` at the end:
    ```
    <font name in lowercase>-<font size>-<color>.fnt
    ```
1. Add it into the `/font` directory.
1. The font will now be available to the service

#### https://ttf2fnt.com/ notes
I have had an issue uploading a font file which has a space in the file name. See this [Tweet](https://twitter.com/Moshe_Grunwald/status/1425479706422521861?s=20).

#### .fnt file notes
.fnt fonts are a directory which includes a .fnt file. Inside the .fnt file there are lines which begin with `page id=`. These lines link the .png files which contain the font bitmaps. If any of the .png files are renamed, they must also be updated in this file.
