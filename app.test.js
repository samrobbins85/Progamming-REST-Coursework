
"use strict";

const request = require("supertest");
const app = require("./app");
jest.mock("./reddit");
function checkimage(res)
{

	const jContent = res.body;
	if(typeof jContent !== "object"){
		throw new Error("not an object");
	}
	// console.log(jContent);
	if(jContent["https://i.redd.it/scl8yb0fdgs21.jpg"][0] !== "Too smol"){
		throw new Error("Comment should be Too smol");
	}
}

function checkimagesubmit(res)
{
	const jContent = res.body;
	if(typeof jContent !== "object"){
		throw new Error("not an object");
	}
	// console.log(jContent);
	if(!("https://i.imgur.com/I2ABokY.jpg" in jContent)){
		throw new Error("Image not correctly saved");
	}
}

function checkcommentsubmit(res)
{
	const jContent = res.body;
	if(typeof jContent !== "object"){
		throw new Error("not an object");
	}
	// console.log(jContent);
	if(!(jContent["https://i.redd.it/scl8yb0fdgs21.jpg"].includes("Test"))){
		throw new Error("Image not correctly saved");
	}
}

describe("Test the list service", () => {
	test("GET /list succeeds", () => {
		return request(app)
			.get("/list")
			.expect(200);
	});

	test("GET /list returns JSON", () => {
		return request(app)
			.get("/list")
			.expect("Content-type", /json/);
	});

	test("GET /list includes correct comment", () => {
		return request(app)
			.get("/list")
			.expect(checkimage);
	});
});

describe("Test the add image service", () => {
	test("POST /add works with a valid URL and the data can be retrieved", () => {
		return request(app)
			.post("/add")
			.send("image=https://i.imgur.com/I2ABokY.jpg")
			.expect(200)
			.then(function () {
				return request(app)
					.get("/list")
					.expect(checkimagesubmit);
			});
	});

	test("POST /add doesn't work with an invalid URL", () => {
		return request(app)
			.post("/add")
			.send("image")
			.expect(422);
	});
});
describe("Test the add comment service", () => {
	test("POST /add_comment works and the comment can be found in the database", () => {
		return request(app)
			.post("/add_comment")
			.send("link1=https://i.redd.it/scl8yb0fdgs21.jpg&comment=Test")
			.expect(200)
			.then(function () {
				return request(app)
					.get("/list")
					.expect(checkcommentsubmit);
			});
	});
	test("POST /add_comment doesn't work with a image not in the database", () => {
		return request(app)
			.post("/add_comment")
			.send("link1=https://i.redd.it/akoe0s951fv21.jpg&comment=Test")
			.expect(409);
	});
});

describe("Test Reddit retrieval works", () => {
	test("POST /add_comment works", () => {
		return request(app)
			.get("/image")
			.expect("Content-type", /json/);
	});

});

