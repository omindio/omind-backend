import uuidv4 from 'uuid/v4';
import path from 'path';
import sharp from 'sharp';
import tempDir from 'temp-dir';

export default class ImageResize {
  constructor(folder, width, height) {
    this.folder = folder || tempDir;
    this.width = width || 960;
    this.height = height || 748;
  }

  async resize(buffer) {
    const fileName = ImageResize.filename();
    const filePath = this.filepath(fileName);

    await sharp(buffer)
      .resize(this.width, this.height, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filePath);

    return { fileName, filePath };
  }

  static filename() {
    return `${uuidv4()}.png`;
  }

  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`);
  }
}
