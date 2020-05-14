const express = require("express");
const isUrl=require("is-url");
const app = express();
// const fetch=require("node-fetch");
const reddit = require("./reddit");
app.use(express.static("client"));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
let doggos={
	"https://i.redd.it/scl8yb0fdgs21.jpg":["Too smol","Limited Chonk"],
	"https://i.redd.it/xxd59jnvxis21.jpg":["Not even a doggo","Wait this is snek"],
	"https://i.redd.it/ssb2fbyp5ks21.jpg":["Looking at me funny","Seems like an old boye"]
};


app.get("/list", function (req, resp){
	resp.send(doggos);
});


app.get("/image", async function (req, resp){
	let main=await reddit.getdata();
	resp.send(main);
});

app.post("/add", function (req, resp){
	const image = req.body.image;
	if (isUrl(image)){
		if (!(image in doggos)){
			doggos[image]=[];
			resp.send("Fine that worked");
		}else{
			resp.status(422);
			resp.send("Image already sent");
		}

	}else{
		resp.status(422);
		resp.send("Image should be a link");
	}

});

app.post("/add_comment", function (req, resp){
	const comment = req.body.comment;
	const link1=req.body.link1;
	if ((typeof comment === "string") && (isUrl(link1)) && link1 in doggos) {
		doggos[link1].push(comment);
		resp.send("Fine that worked");
	} else if (!(link1 in doggos)) {
		resp.status(409);
		resp.send("Data not in database");
	}else{
		resp.status(422);
		resp.send("Invalid datatype");
	}

});


module.exports = app;


