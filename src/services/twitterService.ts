import * as fs from 'fs';
import Jimp from 'jimp';
import { TwitterApi } from 'twitter-api-v2';

export class TwitterService {
  public async sendTweet(
    tweet: string,
    apiKey: string,
    apiKeySecret: string,
    acessToken: string,
    acessTokenSecret: string,
    type: 'dollar' | 'bitcoin',
    textImage: string
  ): Promise<void> {
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiKeySecret,
      accessToken: acessToken,
      accessSecret: acessTokenSecret
    });

    const pathImage = `${__dirname}/../../image/${type}.png`;

    // Open an image file
    const imageEdit = await Jimp.read(pathImage);

    // Font
    const font = await Jimp.loadFont(
      type === 'bitcoin' ? Jimp.FONT_SANS_64_WHITE : Jimp.FONT_SANS_64_BLACK
    );

    // edit image
    imageEdit
      .print(font, 10, 10, textImage)
      .write(`${__dirname}/../../image/image-edited/${type}.png`);

    setTimeout(async () => {
      // path new image
      const pathImageEdited = `${__dirname}/../../image/image-edited/${type}.png`;

      // upload image
      const image = await client.v1.uploadMedia(pathImageEdited, { target: 'tweet' });

      // add alt information in image
      await client.v1.createMediaMetadata(image, { alt_text: { text: type } });

      // post tweet with media
      await client.v2.tweet(tweet, { media: { media_ids: [image] } });

      // remove image edited
      fs.unlink(pathImageEdited, err => {
        if (err) {
          console.error(err);
        }
      });
    }, 1000);
  }
}
