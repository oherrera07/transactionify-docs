---
id: make-payment
title: Make a Payment
sidebar_label: Make a Payment
sidebar_position: 1
description: Learn how to create a payment for an account using the Transactionify API.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Make a Payment

Debit an account by creating a payment. The payment currency must match the currency of the account.

---

## Endpoint

```
POST /api/v1/accounts/{account_id}/payments
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
| `account_id` | `string` (UUIDv7) | ✅ Yes | The unique identifier of the account to debit. |

### Headers

| Header | Value | Required |
|---|---|---|
| `Authorization` | `APIKey <your-api-key>` | ✅ Yes |
| `Content-Type` | `application/json` | ✅ Yes |

### Body

```json
{
  "type": "payment",
  "amount": {
    "value": "10.00",
    "currency": "USD"
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `string` | ✅ Yes | Must be `"payment"`. |
| `amount.value` | `string` | ✅ Yes | Monetary amount with exactly 2 decimal places (e.g. `"10.00"`). |
| `amount.currency` | `string` | ✅ Yes | Must match the account's currency. Accepted values: `USD`, `EUR`, `GBP`. |

:::warning Currency must match
The `currency` in the request body must match the currency the account was created with. Mismatched currencies will return a `400` error.
:::

---

## Code Examples

Replace `ACCOUNT_ID` with your actual account ID before running the examples.

<Tabs>
  <TabItem value="curl" label="cURL">

```bash
curl -X POST https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/ACCOUNT_ID/payments \
  -H "Authorization: APIKey $TRANSACTIONIFY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "amount": {
      "value": "10.00",
      "currency": "USD"
    }
  }'
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
import os

account_id = "019a4757-c049-7ea8-a110-2ea110c5a6f8"

url = f"https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/{account_id}/payments"

headers = {
    "Authorization": f"APIKey {os.environ['TRANSACTIONIFY_API_KEY']}",
    "Content-Type": "application/json"
}

payload = {
    "type": "payment",
    "amount": {
        "value": "10.00",
        "currency": "USD"
    }
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const accountId = "019a4757-c049-7ea8-a110-2ea110c5a6f8";

const response = await fetch(
  `https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/${accountId}/payments`,
  {
    method: "POST",
    headers: {
      "Authorization": `APIKey ${process.env.TRANSACTIONIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "payment",
      amount: {
        value: "10.00",
        currency: "USD",
      },
    }),
  }
);

const data = await response.json();
console.log(data);
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
interface Payment {
  id: string;
  type: "payment";
  amount: {
    value: string;
    currency: string;
  };
  status: "pending";
}

const accountId = "019a4757-c049-7ea8-a110-2ea110c5a6f8";

const response = await fetch(
  `https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts/${accountId}/payments`,
  {
    method: "POST",
    headers: {
      Authorization: `APIKey ${process.env.TRANSACTIONIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "payment",
      amount: {
        value: "10.00",
        currency: "USD",
      },
    }),
  }
);

const data: Payment = await response.json();
console.log(data);
```

  </TabItem>
</Tabs>

---

## Response

A successful request returns HTTP `200` with the payment details:

```json
{
  "id": "019a4757-c049-7ea8-a110-2ea110c5a6f9",
  "type": "payment",
  "amount": {
    "value": "10.00",
    "currency": "USD"
  },
  "status": "pending"
}
```

| Field | Description |
|---|---|
| `id` | Unique identifier for the payment (UUIDv7). Use this to look up the transaction later. |
| `type` | Always `"payment"` for this endpoint. |
| `amount.value` | The amount that was debited. |
| `amount.currency` | The currency of the payment. |
| `status` | Initial status of the payment. Always `"pending"` at creation time. |

---

## Error Reference

| Status | Message | Cause | Fix |
|---|---|---|---|
| `400` | `Currency does not match account currency` | The `currency` in the body differs from the account's currency. | Use the same currency the account was created with. |
| `400` | `Missing required field: amount` | The `amount` object is missing from the request body. | Include `amount.value` and `amount.currency` in the body. |
| `401` | `Unauthorized` | API Key is missing or invalid. | Verify the `Authorization` header format: `APIKey <your-key>`. |
| `403` | `Forbidden` | bad API key or missing permission | Verify API Key is correct and make sure it has the proper rights |
| `404` | `Account not found` | The `account_id` in the path does not exist. | Double-check the account ID. |
| `500` | `An error occurred` | Unexpected server error. | Try again or contact support. |

---

## What's Next?

- [Check your balance](/docs/tutorials/check-balance) — See how the payment affected your account balance.
- [View transaction history](/docs/tutorials/transaction-history) — Find the payment you just created in your transaction list.
