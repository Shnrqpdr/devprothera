import router from './router/index.js';
import express from 'express';
import path, {dirname} from 'path';

const app = express();

app.use(express.json());
app.use(express.static(path.join(dirname(''), "public")));
app.use(express.static(path.join(dirname(''), "views")));

app.use(router);

app.listen(3000, () => {
  console.log("server started on http://localhost:3000");
});