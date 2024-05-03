# NWO Newsletter

This POC API allows subscribing to a newsletter with specific "industry", "source", and "subcategory" of the news. You can subscribe to as many industries, sources and subcategories as desired.

## Installation

- Install [sqlite3](https://www.sqlite.org/download.html)
- Install [node v22.0.0](https://nodejs.org/en/download)
- Clone the repository
- Navigate to the project directory and run `npm install`
- Run `npm run db:migrate` to set up the database
- Run `npm start` to start the server on port 3000
  - To start the server in development mode, run `npm run dev`

## Testing

To run the E2E tests, run `npm test`

## API Endpoints

### POST /subscribe

Subscribes to the newsletter for the provided "industry", "source" and "subcategory".

#### Example request with curl

```bash
curl -X POST localhost:3000/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.org", "industry": "tech", "source": "news", "subcategory": "new product releases"}'
```

#### Example response

```json
{
	"subscription": {
		"id": 1,
		"email": "john.doe@example.org",
		"industry": "tech",
		"source": "news",
		"subcategory": "new product releases"
	}
}
```

### POST /unsubscribe

Unsubscribes from the newsletter for the provided "industry", "source" and "subcategory".

#### Example request with curl

```bash
curl -X POST localhost:3000/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.org", "industry": "tech", "source": "news", "subcategory": "new product releases"}'
```

#### Example response

```json
{
	"subscription": {
		"id": 1,
		"email": "john.doe@example.org",
		"industry": "tech",
		"source": "news",
		"subcategory": "new product releases"
	}
}
```

### POST /unsubscribe_from_all

Unsubscribes from the newsletter for all industries, sources and subcategories.

#### Example request with curl

```bash
curl -X POST localhost:3000/unsubscribe_from_all \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.org"}'
```

#### Example response

```json
{
	"subscriptions": [
		{
			"id": 1,
			"email": "john.doe@example.org",
			"industry": "tech",
			"source": "news",
			"subcategory": "new product releases"
		},
		{
			"id": 2,
			"email": "john.doe@example.org",
			"industry": "beauty",
			"source": "news",
			"subcategory": "new product releases"
		}
	]
}
```
