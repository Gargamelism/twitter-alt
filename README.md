# twitter-alt
backend to retrieve tweets and tweet comments

### Retrieve tweets
* `GET /public-tweets/:tweet-id` - Returns tweet details of `tweet-id`.
* `GET /public-tweets/:tweet-id/comments` - Returns tweet comments of `tweet-id`.

### DB Configuration
This server uses PostgreSQL
#### .env file
Add connection details to `.env` file in project root:
```
DB_HOST=dbhost
DB_USER=dbuser
DB_PASSWORD=dbpassword
DB_NAME=dbname
DB_PORT=dbport
```
Filling the right side with the relevant information.

#### Table Schema
*table name **public_tweet***
```sql
id: int4 (sequence, UNIQUE),
updated_at: timestamptz,
created_at: timestamptz,
tweet_id: varchar (UNIQUE),
user_id: varchar,
tweet_created_at: varchar,
full_text: varchar,
retweet_count: int4,
favorite_count: int4,
reply_count: int4,
quote_count: int4,
user_name: varchar,
reply_to_tweet_id: varchar,
```

### Run server
After DB was configured as above:
* Run server - `npm start`
* Run dev server - `npm run dev`
