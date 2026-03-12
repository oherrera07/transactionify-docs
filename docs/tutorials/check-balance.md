---
id: check-balance
title: Check Balance
sidebar_label: Check Balance
sidebar_position: 2
description: Retrieve the current balance of an account using the Transactionify API.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Check Balance

Retrieve the current balance of an account along with the date and time the request was made.

---

## Endpoint

```
GET /api/v1/accounts/{account_id}/balance
```

---

## Prerequisites

- A valid **API Key**.
- An existing **account ID** — if you don't have one, follow the [Quickstart](/docs/getting-started/quickstart) guide first.

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

:::tip No request body needed
This is a `GET` request — no body or `Content-Type` header is required.
:::

---

## Code Examples

Replace `ACCOUNT_ID` with your actual account ID before running the examples.

<Tabs>
  <TabItem value="curl" label="cURL">

```bash
curl -X GET https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/ACCOUNT_ID/balance \
  -H "Authorization: APIKey $TRANSACTIONIFY_API_KEY"
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
import os

account_id = "019a4757-c049-7ea8-a110-2ea110c5a6f8"

url = f"https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/{account_id}/balance"

headers = {
    "Authorization": f"APIKey {os.environ['TRANSACTIONIFY_API_KEY']}"
}

response = requests.get(url, headers=headers)
print(response.json())
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const accountId = "019a4757-c049-7ea8-a110-2ea110c5a6f8";

const response = await fetch(
  `https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/${accountId}/balance`,
  {
    method: "GET",
    headers: {
      "Authorization": `APIKey ${process.env.TRANSACTIONIFY_API_KEY}`,
    },
  }
);

const data = await response.json();
console.log(data);
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
interface BalanceResponse {
  balance: {
    value: string;
    currency: string;
  };
  date: string;
}

const accountId = "019a4757-c049-7ea8-a110-2ea110c5a6f8";

const response = await fetch(
  `https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/${accountId}/balance`,
  {
    method: "GET",
    headers: {
      Authorization: `APIKey ${process.env.TRANSACTIONIFY_API_KEY}`,
    },
  }
);

const data: BalanceResponse = await response.json();
console.log(data);
```

  </TabItem>
</Tabs>

---

## Response

A successful request returns HTTP `200` with the account balance and current timestamp:

```json
{
  "balance": {
    "value": "0.00",
    "currency": "USD"
  },
  "date": "2026-03-09T20:37:38.344349Z"
}
```

| Field | Type | Description |
|---|---|---|
| `balance.value` | `string` | Current account balance with exactly 2 decimal places. |
| `balance.currency` | `string` | Currency of the account (`USD`, `EUR`, or `GBP`). |
| `date` | `string` (ISO 8601) | UTC timestamp of when the balance was retrieved. |

---

## Error Reference

| Status | Message | Cause | Fix |
|---|---|---|---|
| `401` | `Unauthorized` | API Key is missing or invalid. | Verify the `Authorization` header format: `APIKey <your-key>`. |
| `404` | `Account not found` | The `account_id` in the path does not exist. | Double-check the account ID. |
| `500` | `An error occurred` | Unexpected server error. | Try again or contact support. |

---

## What's Next?

- [View transaction history](/docs/guides/transaction-history) — See all transactions that affected this balance.
- [API Reference](/docs/api-reference/overview) — Full reference for all endpoints and schemas.