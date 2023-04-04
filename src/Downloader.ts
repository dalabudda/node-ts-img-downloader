import * as fs from 'fs';
import http from 'http';
import https from 'https';
import Queue from './Queue';

class Downloader {
   queue: Queue;
   next_index: number = -1;
   busy: boolean = false;

   constructor(queue: Queue) {
      this.queue = queue;
      this.next();
   }

   next() {
      if (this.busy) return;

      this.next_index = this.queue.images.findIndex(image => image.date_downloaded === null && image.error === false);
      if (this.next_index !== -1) {
         this.downloadNextImage();
      }
   }

   downloadNextImage() {
      this.busy = true;
      const image = this.queue.images[this.next_index];
      try {
         if (image.source_url.indexOf("https") === 0) {
            https.get(image.source_url, this.processMessage.bind(this));
         } else {
            http.get(image.source_url, this.processMessage.bind(this));
         }
      } catch(err) {
         image.error = true;
         this.busy = false;
         this.next();
      }
   }

   processMessage(res: http.IncomingMessage) {
      const image = this.queue.images[this.next_index];
      if (res.headers['content-type']) {
         image.type = res.headers['content-type'].replace('image/', '');
         res.pipe(fs.createWriteStream(`public_html/images/${image.id}.${image.type}`))
            .on('error', this.downloadingOnError.bind(this))
            .once('close', this.downloadingOnClose.bind(this));
      } else {
         image.error = true;
         this.busy = false;
         this.next();
      }
   }

   downloadingOnError() {
      this.queue.images[this.next_index].error = true;
      this.busy = false;
      this.next();
   }

   downloadingOnClose() {
      const image = this.queue.images[this.next_index];
      image.date_downloaded = new Date();
      console.log(`Zakończono pobieranie obrazka ${image.id}.${image.type}`);
      this.busy = false;
      this.next();
   }
}

export default Downloader;