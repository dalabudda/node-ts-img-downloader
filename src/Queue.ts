import * as fs from 'fs';
import Image from './Image';

class Queue {
   images: Array<Image> = new Array<Image>;

   constructor() {
      this.loadFromFile();
      const that = this;
      setInterval(() => {
         that.saveToFile();
      }, 60000);
   }

   add(url: string): number {
      const new_id = this.images.length;
      this.images.push({
         id: new_id,
         source_url: url,
         date_added: new Date(),
         date_downloaded: null,
         type: null,
         error: false
      });
      return new_id;
   }

   getDownloadedImages(): Array<Image> {
      return this.images.filter(image => image.date_downloaded);
   }

   loadFromFile() {
      try {
         const json = fs.readFileSync('queue.json').toString();
         const object: Queue = JSON.parse(json);
         if (Array.isArray(object.images) && object.images.length > 0) {
            this.images = object.images;
         }
      } catch(err) {
         console.error(err);
      }
   }

   saveToFile() {
      try {
         fs.writeFileSync('queue.json', JSON.stringify(this));
         console.log('Zapisano kolejkę do queue.json');
      } catch(err) {
         console.error(err);
      }
   }
}

export default Queue;