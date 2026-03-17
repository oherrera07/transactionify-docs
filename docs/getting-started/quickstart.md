---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
description: Make your first Transactionify API call in under 5 minutes.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

Make your first API call to Transactionify in under 5 minutes. By the end of this guide, you will have created your first account and received a real response from the API.

---

## Before You Begin

You will need an API Key to authenticate your requests. If you don't have one yet, contact your Transactionify administrator to get provisioned.

Your API Key looks like this:

```
3ccff962-c5d8-7d13-84ea-768712380a09
```

:::danger Never expose your API Key
Do not commit your API Key to version control or share it publicly. Store it in an environment variable instead.
:::

---

## Base URL

All API requests are made to the following base URL:

```
https://gj7edrv1il.execute-api.us-east-1.amazonaws.com
```

---

## Step 1 — Set Your API Key

Store your API Key as an environment variable so you don't hardcode it in your requests.

<Tabs>
  <TabItem value="bash" label="macOS / Linux">

```bash
export TRANSACTIONIFY_API_KEY="your-api-key-here"
```

  </TabItem>
  <TabItem value="windows" label="Windows (PowerShell)">

```powershell
$env:TRANSACTIONIFY_API_KEY = "your-api-key-here"
```

  </TabItem>
</Tabs>

---

## Step 2 — Create Your First Account

Send a `POST` request to `/api/v1/accounts` to create a new account. You must specify a currency: `USD`, `EUR`, or `GBP`.

<Tabs>
  <TabItem value="curl" label="cURL">

```bash
curl -X POST https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts \
  -H "Authorization: APIKey $TRANSACTIONIFY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"currency": "USD"}'
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
import os

url = "https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts"

headers = {
    "Authorization": f"APIKey {os.environ['TRANSACTIONIFY_API_KEY']}",
    "Content-Type": "application/json"
}

payload = {"currency": "USD"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const response = await fetch(
  "https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts",
  {
    method: "POST",
    headers: {
      "Authorization": `APIKey ${process.env.TRANSACTIONIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currency: "USD" }),
  }
);

const data = await response.json();
console.log(data);
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const response = await fetch(
  "https://gj7edrv1il.execute-api.us-east-1.amazonaws.com/api/v1/accounts",
  {
    method: "POST",
    headers: {
      Authorization: `APIKey ${process.env.TRANSACTIONIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currency: "USD" }),
  }
);

const data: { id: string; balance: { value: string; currency: string } } =
  await response.json();

console.log(data);
```

  </TabItem>
</Tabs>

---

## Step 3 — Check the Response

A successful request returns HTTP `200` with the new account details:

```json
{
  "id": "019a4757-c049-7ea8-a110-2ea110c5a6f8",
  "balance": {
    "value": "0.00",
    "currency": "USD"
  }
}
```

| Field | Description |
|---|---|
| `id` | Unique account identifier (UUIDv7). Save this — you'll need it for all future requests. |
| `balance.value` | Starting balance, always `"0.00"` for new accounts. |
| `balance.currency` | The currency you selected. |

:::tip Save your account ID
The `id` field in the response is your `account_id`. You will use it to check your balance, make payments, and list transactions.
:::

---

## Error Reference

| Status | Message | Cause | Fix |
|---|---|---|---|
| `400` | `Invalid currency` | The `currency` in the body differs from the allowed currencies. | Use one of: `USD`, `EUR`, or `GBP`. |
| `400` | `Missing required field: currency` | The `currency` is missing from the request body. | Make sure your request body includes the `currency` field. |
| `401` | `Unauthorized` | Your API Key is missing or invalid. | Check the `Authorization` header format: `APIKey <your-key>`.|
| `403` | `Forbidden` | bad API key or missing permission | Verify API Key is correct and make sure it has the proper rights |
| `500` | `An error occurred` | Unexpected server error. | Try again or contact support. |

---

## What's Next?

Now that you have an account, explore what else you can do:

- [Make a payment](/docs/tutorials/make-payment) — Debit your account with a payment.
- [Check your balance](/docs/tutorials/check-balance) — Retrieve the current balance for your account.
- [View transaction history](/docs/tutorials/transaction-history) — List and paginate through your transactions.
