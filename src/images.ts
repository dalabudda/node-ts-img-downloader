import express, { Request, Response } from 'express';
import Queue from './Queue';
import Downloader from './Downloader';

const queue = new Queue();
const downloader = new Downloader(queue);

const router = express.Router();

router
   .get('/', (req: Request, res: Response) => {
      res.json(queue.getDownloadedImages());
   })
   .get('/:imageId', (req: Request, res: Response) => {
      try {
         const index = Number(req.params.imageId);
         if (index >= queue.images.length || index < 0) {
            res.status(404).send("Nie ma takiego obrazka");
         } else if (queue.images[index].error) {
            res.send("Wystąpił błąd podczas pobierania obrazka");
         } else if (queue.images[index].date_downloaded === null) {
            res.send("Obrazek oczekuje na pobranie");
         } else {
            res.redirect(`${index}.${queue.images[index].type}`);
         }
      } catch(err) {
         res.send("Nieprawidłowy adres");
      }
   })
   .post('/', (req: Request, res: Response) => {
      try {
         const id = queue.add(req.body.url);
         downloader.next();
         res.json({ url: "/images/" + id });
      } catch(err) {
         res.status(400).json({ error: "Nie udało się dodać obrazka do kolejki" });
      }
   });

export default router;