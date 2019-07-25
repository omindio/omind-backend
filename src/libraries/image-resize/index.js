import uuidv4 from 'uuid/v4';
import path from 'path';
import sharp from 'sharp';

export default class ImageResize {
  constructor(folder, width, height) {
    this.folder = folder;
    this.width = width || 960;
    this.height = height || 748;
  }
  async save(buffer) {
    const filename = ImageResize.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(this.width, this.height, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath);

    return filename;
  }

  static filename() {
    return `${uuidv4()}.png`;
  }

  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`);
  }
}
