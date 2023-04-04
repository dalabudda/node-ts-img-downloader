interface Image {
   id: number,
   source_url: string,
   date_added: Date,
   date_downloaded: Date | null,
   type: string | null,
   error: boolean
}

export default Image;