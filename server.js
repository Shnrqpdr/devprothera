const express = require("express");
const path = require("path");
const fs = require('fs');
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

async function getFileContent(folderName, fileName) {
    try {
        const content = await fs.promises.readFile(path.join(folderName, fileName), 'utf8');
        return content;
    }catch(err){
        console.log(err)
    }
}

app.get("/", async (req, res) => {
    res.render("index");
});

app.get("/icones", async (req, res) => {
    const folderName = 'C:/Users/Projedata-179/Documents/prothera/prothera/frontend/src/assets/icons';
    const icons = [];

    const files = await fs.promises.readdir(folderName);
    for(const file of files){
        icons.push({
            file: file.replace('.svg', ''),
            data: await getFileContent(folderName, file)
        })
    }
    res.render("icones", {icons});
}); 

app.listen(3000, () => {
  console.log("server started on port 3000");
});