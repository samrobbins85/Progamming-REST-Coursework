# Documentation

## Using the site
This website has a simple to use user interface, it has two buttons. The show me a random doggo button will select a random image, and the associated comments from the already loaded images. The gimme more doggos button fetches new images using the Reddit api.

Below the image you can find the comments that have already been posted on the image, and below that is a text box in which you can insert new comments. Clicking the submit button will update the comments with your new comment.
## Using the API
The API has three functions
* list
* add
* add_comment

### list
This is a GET request which will give you the JSON which can be parsed into a JavaScript object where image links are connected to lists corresponding to the comments on that image.

An example of how to use this with the server hosted at 127.0.01:8090, when it is inside an async function:
```javascript
let response = await fetch('http://127.0.01:8090/list');
let body = await response.text();
let database = JSON.parse(body);
```
This will give you the object database, which can then be looked through for any reqired information.
### add
This is a POST request which can be used to add new images to the JavaScript object. It should be given a string url and it will create a new image in the object.

Here is an example of how to do this
```javascript
let response =fetch('http://127.0.01:8090/add',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "potato_type=" + value
            });
```

### add_comment
This is a POST request which takes an object as the input. It takes the names **comment** and **link1**.

Comment should be a string which is the comment that the user wants to submit, and link1 should be the existing link corresponding to the image that the user wants to comment on.
An example of how to do this, when it is inside an async function:
```javascript
let response = await fetch('http://127.0.01:8090/add_comment',
                               {
                                 method: "POST",
                                 headers: {
                                   "Content-Type": "application/x-www-form-urlencoded"
                                 },
                                 body: "link1="+link1+"&comment=" + comment
                               });
```
## Remote deployment
You can find the remote deployment at https://slatemydoggo.herokuapp.com/