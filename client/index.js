document.getElementById("get").addEventListener("click", async function(event){
	event.preventDefault();
	let response = await fetch(window.location["href"]+"list");
	let body = await response.text();
	let doggos = JSON.parse(body);
	let randomKey=Object.keys(doggos)[Math.floor(Math.random()*Object.keys(doggos).length)];
	document.getElementById("content").innerHTML="<img src="+randomKey+ " style='height:"+Math.floor(window.innerHeight/1.2)+"px'>";
	let comments=doggos[randomKey];
	let content="<ul class=\"list-group\">";
	for(let i=0; i<comments.length;i++){
		content+="<li class=\"list-group-item\">"+comments[i]+"</li>";
	}
	content+="</ul>";
	document.getElementById("comments").innerHTML=content;
});


//This is the same as the above function, but is callable, this allows for the initial image to be loaded when the page loads
async function loadimage() {
	let response = await fetch(window.location["href"]+"list");
	let body = await response.text();
	let doggos = JSON.parse(body);
	let randomKey = Object.keys(doggos)[Math.floor(Math.random() * Object.keys(doggos).length)];
	document.getElementById("content").innerHTML = "<img src=" + randomKey + " style='height:"+Math.floor(window.innerHeight/1.2)+"px'>";
	let comments = doggos[randomKey];
	let content = "<ul class=\"list-group\">";
	for (let i = 0; i < comments.length; i++) {
		content += "<li class=\"list-group-item\">" + comments[i] + "</li>";
	}
	content += "</ul>";
	document.getElementById("comments").innerHTML = content;
}


//These 3 functions below all work together to get a fresh doggo jpg
async function getRedditData()
{
	let response = await fetch(window.location["href"]+"image");
	let body = await response.text();
	let main = JSON.parse(body);

	let url =main[0]["data"]["children"][0]["data"]["url"];
	if (url.substr(-3) !== "jpg") {
		getRedditData().then(function(value) {
			breakout(value);
		});
	} else {
		return url;
	}
}


document.getElementById("doggo").addEventListener("click", async function(event){
	event.preventDefault();
	let promise1=getRedditData();
	promise1.then(function(value) {
		breakout(value);
	});
});



async function breakout(value){
	if (value!== undefined) {
		document.getElementById("content").innerHTML="<img src="+value+ " style='height:"+Math.floor(window.innerHeight/1.2)+"px'>";
		try {
			let response=await fetch(window.location["href"] + "add",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: "image=" + value
				});
			// console.log(response);
			if (response.status===400){
				document.getElementById("comments").innerHTML = "";
			}else{
				let response = await fetch(window.location["href"]+"list");
				let body = await response.text();
				let doggos = JSON.parse(body);
				let comments = doggos[value];
				let content = "<ul class=\"list-group\">";
				for (let i = 0; i < comments.length; i++) {
					content += "<li class=\"list-group-item\">" + comments[i] + "</li>";
				}
				content += "</ul>";
				document.getElementById("comments").innerHTML = content;

			}



		}catch (error) {
			alert ("problem: " + error);
		}

	}
}




document.getElementById("add_comment").addEventListener("submit", async function(event){
	event.preventDefault();

	try{
		let comment = document.getElementById("comment").value;
		let response = await fetch(window.location["href"]+"add_comment",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: "link1="+document.images[0].src+"&comment=" + comment
			});
		if(!response.ok){
			throw new Error("problem adding image" + response.code);
		}
		if(response.ok){
			//This will update the comments once a new comment has been added
			let response = await fetch(window.location["href"]+"list");
			let body = await response.text();
			let doggos = JSON.parse(body);
			let comments=doggos[document.images[0].src];
			let content="<ul class=\"list-group\">";
			for(let i=0; i<comments.length;i++){
				content+="<li class=\"list-group-item\">"+comments[i]+"</li>";
			}
			content+="</ul>";
			document.getElementById("comments").innerHTML=content;
			document.getElementById("comment").value="";
		}
	} catch (error) {
		alert ("problem: " + error);
	}
});

loadimage();

function resizeimage(){
	document.getElementById("content").innerHTML="<img src="+document.images[0].src+ " style='height:"+Math.floor(window.innerHeight/1.2)+"px'>";
}

window.onresize = resizeimage;

