import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  const router = express.Router();
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
 
  router.use(function (req:Request, res:Response, next:NextFunction) {
    res.on('finish', function(){
        console.log("DEBUG : In the middleware");
        const fs = require('fs')
        const dir:string = __dirname+'/util/tmp/';
        const files = fs.readdirSync(dir)
        console.log("DEBUG : Working directory is " + dir);
        console.log(files);
        for (const file of files) {
            console.log("DEBUG : Deleting local files: " + dir + file);
            const filePath:string = dir + file;
            deleteLocalFiles([filePath]);  
        }
        //deleteLocalFiles(localFilesPaths);
      });
    next()
  })
  
  
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
    router.get("/filteredimage", async (req: Request, res: Response) => {
      let image_url:string = req.query.image_url;
      let filteredImagePath:string;
      if (!image_url) {
         res.status(404).send("ERROR : Cannot find image !");
       }
       else {
        filteredImagePath = await filterImageFromURL(image_url);
        console.log("DEBUG : Sending the filtered image : " + filteredImagePath);
        res.sendFile(filteredImagePath);
       }        
    });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req:Request, res:Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.use(router);

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();