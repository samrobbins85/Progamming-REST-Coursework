const fetch=require("node-fetch");
async function getdata(){
	let data = await fetch("http://www.reddit.com/r/rarepuppers/random.json");
	let main = await data.json();
	return main;
}

exports.getdata = getdata;