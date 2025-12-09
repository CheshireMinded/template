# CORS Policy Template

Define how cross-origin resource sharing is handled.

---

## Allowlist Model

Use:

```
https://yourapp.com
https://staging.yourapp.com
```

Do not use `*` unless the resource is truly public.

---

## Allowed Methods

- GET, POST, PUT, DELETE, OPTIONS

---

## Allowed Headers

- Content-Type, Authorization

---

## Preflight Cache TTL

- `Access-Control-Max-Age: 600`

---

## Risks of Incorrect CORS Config

- Token leakage
- Unauthorized cross-site access
- Credential exploitation

