# API SPECIFICATION: VentureLens AI

All API endpoints are prefixed with `/api/v1` and return JSON payloads. Authentication is validated using Bearer JWT tokens in the `Authorization` header or secure cookies.

---

## 1. Authentication (`/auth`)

### `POST /auth/login`
- **Description**: Authenticate user and set cookies.
- **Request Body**:
  ```json
  {
    "email": "analyst@vc.com",
    "password": "password"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbG...",
    "token_type": "bearer",
    "role": "partner"
  }
  ```

### `POST /auth/logout`
- **Description**: Clear session cookies and invalidate token.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "detail": "Logged out successfully"
  }
  ```

### `GET /auth/me`
- **Description**: Retrieve active user context.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "user_id": "usr_123",
    "email": "analyst@vc.com",
    "role": "partner",
    "organization_id": "org_456"
  }
  ```

---

## 2. Startups & Companies (`/startups`)

### `GET /startups`
- **Description**: Fetch all tenant startups. Supports query filtering, sorting, and pagination.
- **Query Params**:
  - `search`: string (filters by name or domain)
  - `stage`: string (filters by deal stage)
  - `sort_by`: string (name, valuation, health_score)
  - `direction`: string (asc, desc)
  - `page`: integer (default 1)
  - `limit`: integer (default 20)
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "st_789",
      "name": "SynthoAI",
      "domain": "syntho.ai",
      "vc_firm_id": "firm_321"
    }
  ]
  ```

### `GET /startups/{id}/metrics`
- **Description**: Fetch financial metric history for portfolio charts (ARR, MRR, Burn Rate, etc.).
- **Response (200 OK)**:
  ```json
  [
    {
      "timestamp": "2026-06-01",
      "arr": 12400000.0,
      "mrr": 1000000.0,
      "growth_rate": 33.0,
      "burn_rate": 250000.0
    }
  ]
  ```

---

## 3. Due Diligence & Ingestion (`/due-diligence`)

### `POST /due-diligence/{id}/documents/upload`
- **Description**: Upload pitch deck/financial statement. Initiates background Celery parsing.
- **Request (Multipart Form)**:
  - `file`: Binary file (PDF, XLSX, DOCX, CSV)
- **Response (202 Accepted)**:
  ```json
  {
    "id": "doc_999",
    "file_name": "pitch_deck.pdf",
    "file_type": "application/pdf",
    "status": "Uploaded"
  }
  ```

### `GET /due-diligence/{id}/analysis`
- **Description**: Get active due diligence status, scores, and details.
- **Response (200 OK)**:
  ```json
  {
    "id": "dd_888",
    "deal_id": "deal_555",
    "status": "Active",
    "health_score": 84
  }
  ```

---

## 4. Valuation, Cap Tables & Simulations (`/valuation`)

### `POST /valuation/calculate`
- **Description**: Evaluate valuation metrics (DCF and VC Exit method).
- **Request Body**:
  ```json
  {
    "current_revenue": 1500000,
    "projected_revenue_year_5": 12000000,
    "industry_revenue_multiple": 8.0,
    "target_return_multiple": 10.0,
    "shares_outstanding": 1000000,
    "wacc": 0.12,
    "fcf_projections": [200000, 500000, 1000000, 2000000, 3500000],
    "terminal_growth_rate": 0.03
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "vc_method_valuation": 7680000,
    "vc_method_post_money": 9600000,
    "dcf_enterprise_value": 8450000,
    "dcf_equity_value": 8450000,
    "comparables_valuation": 12000000,
    "blended_base_valuation": 9130000,
    "bear_valuation": 6391000,
    "bull_valuation": 12782000
  }
  ```

### `POST /valuation/simulate-dilution`
- **Description**: Simulate preferred shares round dilution and option pool expansion.
- **Request Body**:
  ```json
  {
    "current_cap_table": [
      { "shareholder_name": "Founders", "share_class": "Common", "shares_owned": 800000 },
      { "shareholder_name": "Seed Investors", "share_class": "Preferred", "shares_owned": 200000 }
    ],
    "new_investment_amount": 2000000,
    "pre_money_valuation": 8000000,
    "option_pool_increase_percentage": 0.10
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "post_money_valuation": 10000000.0,
    "price_per_share": 8.0,
    "new_shares_issued": 250000,
    "option_pool_shares_added": 138888,
    "total_post_money_shares": 1388888,
    "simulated_cap_table": [
      { "shareholder_name": "Founders", "share_class": "Common", "shares_owned": 800000, "ownership_percentage": 57.6 },
      { "shareholder_name": "Seed Investors", "share_class": "Preferred", "shares_owned": 200000, "ownership_percentage": 14.4 },
      { "shareholder_name": "New Investors (Series X)", "share_class": "Preferred", "shares_owned": 250000, "ownership_percentage": 18.0 },
      { "shareholder_name": "New Option Pool Expansion", "share_class": "Common", "shares_owned": 138888, "ownership_percentage": 10.0 }
    ]
  }
  ```

### `POST /valuation/simulate-montecarlo`
- **Description**: Execute a NumPy-accelerated Monte Carlo cash flow simulation.
- **Request Body**:
  ```json
  {
    "base_arr": 5000000,
    "base_growth_rate": 0.5,
    "growth_volatility": 0.15,
    "base_churn_rate": 0.08,
    "churn_volatility": 0.02,
    "months": 36,
    "simulations": 1000
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "percentile_10": [5000000, 4800000, ...],
    "percentile_50": [5000000, 5150000, ...],
    "percentile_90": [5000000, 5600000, ...],
    "months": [1, 2, 3, ... 36],
    "bankruptcy_probability": 1.2
  }
  ```

---

## 5. Tasks & Alerts (`/tasks`, `/alerts`)

### `GET /tasks`
- **Response (200 OK)**: List of active user tasks.

### `PATCH /tasks/{id}`
- **Description**: Toggle task completed status.

### `GET /alerts`
- **Response (200 OK)**: Active financial and operations alerts calculated from latest metrics.

---

## 6. AI & Copilot Channels (`/chat`)

### `POST /chat/stream`
- **Description**: Post a prompt to the RAG pipeline. Returns a Server-Sent Events stream.
- **Request Body**:
  ```json
  {
    "message": "Verify the unit economics and burn multiple for SynthoAI."
  }
  ```
- **Response SSE Stream**:
  ```text
  data: SynthoAI
  data: exhibits
  data: a
  ...
  ```
