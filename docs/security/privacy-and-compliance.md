# Privacy & Compliance (Template)

> **WARNING: Legal Disclaimer:**  
> This template is **not legal advice**. Nothing in this repository constitutes legal, compliance, or regulatory guidance.  
> 
> You are responsible for:
> - Consulting with legal/compliance teams for GDPR, CCPA, COPPA, HIPAA, PCI-DSS, and other regulations
> - Defining data subject rights workflows (Right to Erasure, Data Portability, etc.)
> - Implementing age gating, consent management, and privacy policies
> - Meeting jurisdiction-specific requirements for your actual use case

---

## Data Protection Laws

This template does **not** make you compliant with:

- **GDPR** (General Data Protection Regulation - EU)
- **CCPA** (California Consumer Privacy Act)
- **COPPA** (Children's Online Privacy Protection Act)
- **HIPAA** (Health Insurance Portability and Accountability Act)
- **PCI-DSS** (Payment Card Industry Data Security Standard)
- Any other country, state, or industry-specific regulation

---

## What This Template Provides

The template includes:

- **Technical documentation** (e.g., `data-classification.md`) to help you think about data sensitivity
- **Security controls** (e.g., encryption, access controls) as building blocks
- **Example policies** (e.g., SOC 2 starter controls) as reference material

These are **technical inputs** to a broader privacy and compliance program - not the whole thing.

---

## Your Responsibilities

To achieve actual compliance, you must:

1. **Legal & Compliance Review**
   - Engage legal counsel familiar with applicable regulations
   - Define data processing purposes and legal bases
   - Draft privacy policies and terms of service

2. **Data Subject Rights**
   - Implement workflows for:
     - Right to Access
     - Right to Erasure (Right to be Forgotten)
     - Right to Data Portability
     - Right to Rectification
     - Right to Object
   - Provide mechanisms for users to exercise these rights

3. **Consent Management**
   - Implement consent collection and tracking
   - Handle consent withdrawal
   - Age verification for COPPA compliance (if applicable)

4. **Data Protection Impact Assessments (DPIA)**
   - Conduct DPIAs for high-risk processing
   - Document legitimate interest assessments
   - Maintain records of processing activities

5. **Organizational Controls**
   - Appoint Data Protection Officer (DPO) if required
   - Establish data breach notification procedures
   - Train staff on privacy and data protection

6. **Technical Controls**
   - Encrypt data at rest and in transit
   - Implement access controls and audit logging
   - Data minimization (collect only what you need)
   - Retention policies and secure deletion

---

## Data Classification

See [Data Classification](data-classification.md) for technical guidance on categorizing data by sensitivity. This is a **technical input** to privacy and compliance, not a substitute for legal review.

---

## Related Documents

- [Data Classification](data-classification.md)
- [SOC 2 Starter Controls](soc2-starter-controls.md)
- [Security Risk Register](security-risk-register.md)
- [Cookie & Session Security](cookie-session-security.md)

---

## Final Note

**This template provides security engineering practices, not legal compliance.**  
Use these materials as a starting point, but always consult with legal and compliance professionals for your specific jurisdiction and use case.

