# Data Classification (Template)

This template helps teams categorize data and apply appropriate controls.

---

## Categories

### Public
- Non-sensitive documentation  
- Marketing materials  

### Internal
- Application logs  
- Non-public source code  

### Confidential
- User tokens  
- API keys  
- Internal dashboards  

### Restricted
- PII  
- Payment data  
- Credentials  

---

## Handling Requirements

| Classification | Encryption | Access | Logging |
|----------------|------------|--------|---------|
| Public | Optional | Open | Minimal |
| Internal | At rest | Staff | Yes |
| Confidential | At rest + in transit | Restricted roles | Detailed |
| Restricted | Strongest controls | Explicit approval | Extensive |

