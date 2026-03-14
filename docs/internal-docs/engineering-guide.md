---
id: engineering-guide
title: Engineering Guide
---

# Engineer guide

This guide covers local setup, testing, and deployment for the Transactionify API. It is intended for LoanPro internal platform engineers.

:::info Stack
AWS CDK v2 (TypeScript) · Python 3.9 Lambda · Amazon DynamoDB · API Gateway v2
:::

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | CDK and TypeScript compilation |
| Python | 3.9+ | Lambda runtime and local tests |
| AWS CDK CLI | 2.168.0 | Infrastructure deployment |
| AWS CLI | Any recent | Deploy credentials |

Install the CDK CLI globally:

```bash
npm install -g aws-cdk
```

---

## Local setup

### 1. Install Node.js dependencies

From the repository root:

```bash
npm install
```

### 2. Install Python dependencies

The Lambda source and test suite have separate dependency sets:

```bash
# Production Lambda dependencies
cd src/python
pip install -r requirements.txt

# Test dependencies
cd ../../test/unit/src/python
pip install -r requirements.txt
```

:::tip
Use a virtual environment to avoid polluting your system Python:

```bash
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows
```
:::

**Production dependencies** (pinned in `requirements.txt`):

| Package | Version | Purpose |
|---------|---------|---------|
| `boto3` | 1.40.64 | AWS SDK — DynamoDB reads/writes |
| `botocore` | 1.40.64 | Low-level AWS service client |
| `python-dateutil` | 2.9.0 | Date parsing utilities |
| `urllib3` | 2.5.0 | HTTP client (botocore dep) |

**Test dependencies** (pinned in `test/unit/src/python/requirements.txt`):

| Package | Version | Purpose |
|---------|---------|---------|
| `pytest` | ≥7.4.0 | Test runner |
| `pytest-cov` | ≥4.1.0 | Coverage reporting |
| `pytest-mock` | ≥3.11.1 | Mock fixtures |
| `moto[dynamodb]` | ≥4.2.0 | AWS service mocking |
| `black` | ≥23.7.0 | Code formatter |
| `flake8` | ≥6.1.0 | Linter |
| `mypy` | ≥1.5.0 | Type checker |
| `boto3-stubs[dynamodb]` | ≥1.28.0 | DynamoDB type hints |

---

## Running tests

All `pytest` commands must be run from the `test/unit/src/python/` directory where `pytest.ini` is located.

```bash
cd test/unit/src/python

# Run the full test suite
pytest

# Run with verbose output
pytest -v

# Run with coverage report
pytest --cov=src/python/transactionify --cov-report=html --cov-report=term

# Run a specific test file
pytest handlers/test_authorizer.py
pytest tools/validators/test_uuid.py

# Stop on first failure
pytest -x
```

To open the HTML coverage report:

```bash
open htmlcov/index.html
```

### Test structure

```
test/unit/src/python/
├── handlers/
│   └── test_authorizer.py    # Lambda authorizer tests
└── tools/
    └── validators/
        └── test_uuid.py      # UUID validation tests
```

### test_authorizer.py

Tests for `transactionify/handlers/authorizer/main.py`:

- **`TestAuthorizerHandler`** — integration tests for the handler function: authorization header validation, UUIDv7 format checks, API key lookup, context passing, and error handling.
- **`TestExtractApiKey`** — unit tests for API key extraction: header parsing (case-insensitive), whitespace handling, no Bearer prefix support.
- **`TestValidateApiKey`** — unit tests for DynamoDB lookup, TTL expiration checking, and error handling.

### test_uuid.py

Tests for `transactionify/tools/validators/uuid.py`:

- **`TestIsValidUuidv7`** — comprehensive UUID validation: valid UUIDv7 formats, invalid versions (v1, v4, etc.), invalid variants, format checks (hyphens, length, characters), case-insensitivity, and edge cases (empty, `None`, whitespace).

### Writing tests

Follow these conventions:

- Test files: `test_*.py`
- Test classes: `Test*`
- Test functions: `test_*`

```python
import pytest
from unittest.mock import patch

class TestMyFunction:
    """Test cases for my_function."""

    def test_success_case(self):
        """Test successful execution."""
        result = my_function('input')
        assert result == 'expected'

    @patch('module.dependency')
    def test_with_mock(self, mock_dep):
        """Test with mocked dependency."""
        mock_dep.return_value = 'mocked'
        result = my_function()
        assert result == 'expected'
```

### Mocking AWS services

Use `moto` for mocking DynamoDB in tests — never hit a real AWS table:

```python
import boto3
from moto import mock_dynamodb

@mock_dynamodb
def test_with_dynamodb():
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.create_table(
        TableName='test-table',
        KeySchema=[
            {'AttributeName': 'PK', 'KeyType': 'HASH'},
            {'AttributeName': 'SK', 'KeyType': 'RANGE'},
        ],
        AttributeDefinitions=[
            {'AttributeName': 'PK', 'AttributeType': 'S'},
            {'AttributeName': 'SK', 'AttributeType': 'S'},
        ],
        BillingMode='PAY_PER_REQUEST',
    )
    # run your test against the mock table
```

---

## Code quality

```bash
# Format Python source files
black src/python/

# Lint
flake8 src/python/

# Type check
mypy src/python/

# Compile TypeScript (CDK)
npm run build

# Watch mode
npm run watch
```

---

## Deployment

### Prerequisites

Configure AWS credentials before running any CDK command:

```bash
aws configure
# or export environment variables:
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=us-east-1
```

The CDK app reads `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION` at deploy time — these are resolved automatically from your active AWS profile.

### Deploy

```bash
# 1. Compile TypeScript
npm run build

# 2. Preview the CloudFormation template (no AWS calls)
npx cdk synth

# 3. Preview what will change
npx cdk diff

# 4. Deploy
npx cdk deploy
```

On success, the CDK outputs two values:

- **`ApiUrl`** — the HTTP API Gateway endpoint URL
- **`TableName`** — the DynamoDB table name (`transactionify-table`)

:::warning Data loss risk
The DynamoDB table is configured with `RemovalPolicy.DESTROY`. Running `cdk destroy` will permanently delete the table and all its data.
:::

### Tear down

```bash
npx cdk destroy
```

---

## Provisioning a new user

There is no HTTP endpoint for user registration. Invoke the provisioning Lambda directly:

```bash
aws lambda invoke \
  --function-name transactionify-provisioning \
  --payload '{"name": "engineer@loanpro.io"}' \
  response.json

cat response.json
# { "api_key": "3ccff962-c5d8-7d13-84ea-768712380a09" }
```

Use the returned `api_key` value in all subsequent API requests:

```http
Authorization: APIKey 3ccff962-c5d8-7d13-84ea-768712380a09
```

---

## Infrastructure reference

All AWS resources are defined in `lib/transactionify-stack.ts`. Every resource name is prefixed with `transactionify`.

| Resource | Name | Notes |
|----------|------|-------|
| DynamoDB | `transactionify-table` | PAY_PER_REQUEST, TTL enabled |
| API Gateway | `transactionify-api` | HTTP API v2, default stage |
| Lambda | `transactionify-authorizer` | Validates APIKey header |
| Lambda | `transactionify-provisioning` | Internal only — not exposed via API |
| Lambda | `transactionify-create-account` | `POST /api/v1/accounts` |
| Lambda | `transactionify-create-payment` | `POST /api/v1/accounts/{id}/payments` |
| Lambda | `transactionify-get-balance` | `GET /api/v1/accounts/{id}/balance` |
| Lambda | `transactionify-list-transactions` | `GET /api/v1/accounts/{id}/transactions` |

Each Lambda is granted only the IAM permissions it needs — read-only Lambdas get `grantReadData`, write Lambdas get `grantReadWriteData`.
