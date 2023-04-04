import express from 'express';
import images from './src/images';

const port = 8080;

express()
	.use(express.json())
	.use(express.static('public_html'))
	.use('/images', images)
	.listen(port, () => {
		console.log('Serwer działa pod adresem localhost:' + port);
	});