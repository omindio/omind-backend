import axios from 'axios';
import { config } from '@config';
import fs from 'fs';
import crypto from 'crypto';

import { ImageNotFoundError } from '@components/project/Error';

export default class Backblaze {
  constructor(accountId, applicationKey) {
    this.accountId = accountId || config.backblaze.keyId;
    this.applicationKey = applicationKey || config.backblaze.applicationKey;
    this.credentials = {};
  }

  async authorize() {
    try {
      const encodedBase64 = Buffer.from(this.accountId + ':' + this.applicationKey).toString(
        'base64',
      );

      const { data } = await axios.post(
        `https://api.backblazeb2.com/b2api/v1/b2_authorize_account`,
        {},
        {
          headers: { Authorization: 'Basic ' + encodedBase64 },
        },
      );

      this.credentials = {
        accountId: this.accountId,
        applicationKey: this.applicationKey,
        apiUrl: data.apiUrl,
        authorizationToken: data.authorizationToken,
        downloadUrl: data.downloadUrl,
        recommendedPartSize: data.recommendedPartSize,
      };
    } catch (err) {
      throw err;
    }
  }

  async uploadFile(filePath, fileName, bucketTargetPath = 'uploads/images') {
    try {
      const bucketId = config.backblaze.bucketId;

      const { data } = await axios.post(
        this.credentials.apiUrl + '/b2api/v1/b2_get_upload_url',
        {
          bucketId: bucketId,
        },
        { headers: { Authorization: this.credentials.authorizationToken } },
      );

      const uploadUrl = data.uploadUrl;
      const uploadAuthorizationToken = data.authorizationToken;

      const source = fs.readFileSync(filePath);

      var sha1 = crypto
        .createHash('sha1')
        .update(source)
        .digest('hex');

      //TODO: podemos eliminarla del tmp al subirse.
      const response = await axios.post(uploadUrl, source, {
        headers: {
          Authorization: uploadAuthorizationToken,
          'X-Bz-File-Name': `${bucketTargetPath}/${fileName}`,
          'Content-Type': 'b2/x-auto',
          // 'Content-Length': fileSize,
          'X-Bz-Content-Sha1': sha1,
          'X-Bz-Info-Author': 'unknown',
        },
      });

      return response;
    } catch (err) {
      throw err;
    }
  }

  async removeFile(fileName, bucketTargetPath = 'uploads/images') {
    try {
      const bucketId = config.backblaze.bucketId;

      //check if file exists
      const { data } = await axios.post(
        this.credentials.apiUrl + '/b2api/v1/b2_list_file_names',
        {
          bucketId: bucketId,
        },
        { headers: { Authorization: this.credentials.authorizationToken } },
      );

      const files = data.files;
      const file = files.find(element => {
        return element.fileName === `${bucketTargetPath}/${fileName}`;
      });

      //TODO: Create new Exception ERROR class
      if (!file) throw new ImageNotFoundError('File does not exists in bucket.');

      await axios.post(
        this.credentials.apiUrl + '/b2api/v1/b2_delete_file_version',
        {
          fileName: `${bucketTargetPath}/${fileName}`,
          fileId: file.fileId,
        },
        { headers: { Authorization: this.credentials.authorizationToken } },
      );
    } catch (err) {
      throw err;
    }
  }
}
