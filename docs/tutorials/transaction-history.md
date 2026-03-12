---
id: transaction-history
title: Transaction History
sidebar_label: Transaction History
sidebar_position: 3
description: Retrieve and paginate through the transaction history of an account using the Transactionify API.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Transaction History

Retrieve a paginated list of transactions for a given account, ordered from most recent to oldest.

---

## Endpoint

```
GET /api/v1/accounts/{account_id}/transactions
```

---

## Prerequisites

- A valid **API Key**.
- An existing **account ID** with at least one transaction — follow the [Make a Payment](/docs/guides/make-payment) guide if you haven't created one yet.

---

## Request

### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `account_id` | `string` (UUIDv7) | ✅ Yes | The unique identifier of the account to query. |

### Headers

| Header | Value | Required |
|---|---|---|
| `Authorization` | `APIKey <your-api-key>` | ✅ Yes |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `limit` | `integer` | ❌ No | `20` | Number of transactions to return. Min `1`, max `100`. |
| `cursor` | `string` | ❌ No | — | Pagination cursor from a previous response. Used to fetch the next page. |

:::tip No request body needed
This is a `GET` request — no body or `Content-Type` header is required.
:::

---

## Code Examples

Replace `ACCOUNT_ID` with your actual account ID before running the examples.

<Tabs>
  <TabItem value="curl" label="cURL">

```bash
# First page (default 20 results)
curl -X GET "https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/ACCOUNT_ID/transactions" \
  -H "Authorization: APIKey $TRANSACTIONIFY_API_KEY"

# With limit
curl -X GET "https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/ACCOUNT_ID/transactions?limit=5" \
  -H "Authorization: APIKey $TRANSACTIONIFY_API_KEY"

# Next page using a cursor
curl -X GET "https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/ACCOUNT_ID/transactions?cursor=NEXT_CURSOR" \
  -H "Authorization: APIKey $TRANSACTIONIFY_API_KEY"
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
import os

account_id = "019a4757-c049-7ea8-a110-2ea110c5a6f8"

url = f"https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/{account_id}/transactions"

headers = {
    "Authorization": f"APIKey {os.environ['TRANSACTIONIFY_API_KEY']}"
}

# Optional: add limit and cursor as query params
params = {
    "limit": 5,
    # "cursor": "NEXT_CURSOR"  # uncomment for next page
}

response = requests.get(url, headers=headers, params=params)
print(response.json())
```

**Fetching all pages automatically:**

```python
import requests
import os

def get_all_transactions(account_id: str) -> list:
    url = f"https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/{account_id}/transactions"
    headers = {"Authorization": f"APIKey {os.environ['TRANSACTIONIFY_API_KEY']}"}
    all_transactions = []
    cursor = None

    while True:
        params = {"limit": 100}
        if cursor:
            params["cursor"] = cursor

        response = requests.get(url, headers=headers, params=params)
        data = response.json()

        all_transactions.extend(data["transactions"])

        if not data["has_more"]:
            break

        cursor = data.get("next_cursor")

    return all_transactions
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const accountId = "019a4757-c049-7ea8-a110-2ea110c5a6f8";

// First page
const response = await fetch(
  `https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/${accountId}/transactions?limit=5`,
  {
    method: "GET",
    headers: {
      "Authorization": `APIKey ${process.env.TRANSACTIONIFY_API_KEY}`,
    },
  }
);

const data = await response.json();
console.log(data);

// Next page (if data.has_more is true)
if (data.has_more) {
  const nextResponse = await fetch(
    `https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/${accountId}/transactions?cursor=${data.next_cursor}`,
    {
      method: "GET",
      headers: {
        "Authorization": `APIKey ${process.env.TRANSACTIONIFY_API_KEY}`,
      },
    }
  );
  const nextPage = await nextResponse.json();
  console.log(nextPage);
}
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
interface Transaction {
  id: string;
  type: "payment";
  amount: {
    value: string;
    currency: string;
  };
  timestamp: string;
}

interface TransactionListResponse {
  transactions: Transaction[];
  has_more: boolean;
  next_cursor?: string;
}

const accountId = "019a4757-c049-7ea8-a110-2ea110c5a6f8";

const response = await fetch(
  `https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/${accountId}/transactions?limit=5`,
  {
    method: "GET",
    headers: {
      Authorization: `APIKey ${process.env.TRANSACTIONIFY_API_KEY}`,
    },
  }
);

const data: TransactionListResponse = await response.json();
console.log(data);
```

  </TabItem>
</Tabs>

---

## Response

A successful request returns HTTP `200` with a list of transactions:

```json
{
  "transactions": [
    {
      "id": "459b550d-0915-76bc-a86b-7af03abb8ae3",
      "type": "payment",
      "amount": {
        "value": "40.00",
        "currency": "USD"
      },
      "timestamp": "2026-03-09T18:49:58.506703Z"
    }
  ],
  "has_more": false
}
```

| Field | Type | Description |
|---|---|---|
| `transactions` | `array` | List of transaction objects for the account. Empty array `[]` if no transactions exist. |
| `transactions[].id` | `string` (UUIDv7) | Unique identifier for the transaction. |
| `transactions[].type` | `string` | Type of transaction. Currently always `"payment"`. |
| `transactions[].amount.value` | `string` | Transaction amount with exactly 2 decimal places. |
| `transactions[].amount.currency` | `string` | Currency of the transaction (`USD`, `EUR`, or `GBP`). |
| `transactions[].timestamp` | `string` (ISO 8601) | UTC timestamp of when the transaction was created. |
| `has_more` | `boolean` | `true` if there are more transactions beyond this page. |
| `next_cursor` | `string` | Cursor to pass in the next request to fetch the following page. Only present when `has_more` is `true`. |

---

## Pagination

This endpoint uses **cursor-based pagination**. When a response includes `"has_more": true`, use the `next_cursor` value to fetch the next page.

```
First request
  GET /transactions?limit=5
  → returns 5 transactions + next_cursor + has_more: true

Second request
  GET /transactions?limit=5&cursor=<next_cursor>
  → returns next 5 transactions

... repeat until has_more: false
```

:::info What is the cursor?
The `next_cursor` is an opaque base64-encoded string that points to the last item of the current page. You don't need to decode or modify it — just pass it as-is in the next request.
:::

---

## Error Reference

| Status | Message | Cause | Fix |
|---|---|---|---|
| `400` | `Invalid pagination cursor` | The `cursor` value is malformed or expired. | Remove the cursor and start from the first page. |
| `401` | `Unauthorized` | API Key is missing or invalid. | Verify the `Authorization` header format: `APIKey <your-key>`. |
| `404` | `Account not found` | The `account_id` in the path does not exist. | Double-check the account ID. |
| `500` | `An error occurred` | Unexpected server error. | Try again or contact support. |

---

## What's Next?

- [API Reference](/docs/api-reference/overview) — Full reference for all endpoints and schemas.