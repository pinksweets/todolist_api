import * as express from "express";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as path from "path";
import * as mongoose from "mongoose";
import * as todoController from "./controllers/todoapi";

/**
 * Create Express server.
 */
export const app = express();

/**
 * Connect to MongoDB.
 */
const mongourl = "mongodb://localhost:27017/todolist";
mongoose.connect(mongourl, {useMongoClient: true});

mongoose
  .connection
  .on("error", () => {
    console.log("MongoDB connection error. Please make sure MongoDB is running.");
    process.exit();
  });

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * API routes.
 */
app.get("/:userid/todos/", todoController.rootApi);
app.get("/:userid/todos/:keyword", todoController.searchApi);
app.post("/:userid/todos/", todoController.addApi);
app.put("/:userid/todos/", todoController.updateApi);
app.delete("/:userid/todos/:id", todoController.destroyApi);

/**
 * Start Express server.
 */
export const server = app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});
