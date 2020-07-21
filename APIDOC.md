# posting API Documentation
The login API provide the information of previous posts in the client's account and information which conatins all names and passwords which successfully accessed by the previous clients.

## Log in with the valid information*
**Request Format:** {name: "..." , password: "..."}

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a name and password, it returns JSON of the log-in information. We call the info.json and post the new value of name and password
to the info.json if the given name does not exist in the JSON. Then update the JSON file.


**Example Request:** /login

**Example Response:**
```json
{
  "lee3665": {
  "password": "password",
  "posts": {
    "title": [],
    "post": []
    }
}}
```

**Error Handling:**
- Possible 400 (invalid request) errors
  - If missing the given parameters, an error is returned with  message: `You missed parameters`

## Update new post*
**Request Format:** {title: "hello", post: "my name", name: "lee3665"}

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given title and post value, we added the new post to the index.json which was called by readFile function. Then we put back the updated index.json.

**Example Request:** /posts/new

**Example Response:**
```json
{
  "title": "hello",
  "post": "my name is Junguk Lee"
  };
  ```

**Error Handling:**
- N/A

## Call all previous posts*
**Request Format:** {name: "lee3665"}

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Given the name value, we find all the previous posts from the index.json

**Example Request:** /posts

**Example Response:**
```json
{
  "title":["sdf","my name is"],
  "post":["sdf","hello"]
  }
  ```

**Error Handling:**
- N/A
