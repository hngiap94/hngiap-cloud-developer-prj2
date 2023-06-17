import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url } = req.query;
    console.log(`image_url: ${image_url}`)

    // 1. Validate image URL from query
    // 1.1. Validate image_url is empty
    if (!image_url) {
      return res.status(400).send("Image URL is required!") ;
    }
    // 1.2. Validate image_url is invalid
    if (!isValidURL(image_url as string)) {
      return res.status(400).send("Invalid image URL!") ;
    }

    try {
      const filtered_image = await filterImageFromURL(image_url as string);
  
      return res.status(200).sendFile(filtered_image, () => {
        deleteLocalFiles([filtered_image]);
      });
    } catch (error) {
      return res.status(400).send("Cannot process this image. Please try an other image!");
    }
  });

  // Validate if an url is valid or not
  function isValidURL(urlToValidate: string): boolean {
    try {
      const url = new URL(urlToValidate);
      console.log(url)
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
      return false;
    }
  }
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();