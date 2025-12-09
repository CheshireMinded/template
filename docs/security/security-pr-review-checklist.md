# Security Checklist for Pull Requests

Reviewers should check:

---

## Code Quality

- [ ] No secrets / tokens in code  
- [ ] No unsafe eval, exec, Function()  
- [ ] Input validation present  

---

## API & Auth

- [ ] Authorization checks present  
- [ ] User input sanitized  
- [ ] Proper error handling  

---

## Dependencies

- [ ] No outdated or vulnerable libraries  
- [ ] No unnecessary dependencies added  

---

## Architecture

- [ ] CSP and headers preserved  
- [ ] Logging does not leak sensitive data  
- [ ] Request IDs included  

---

## Testing

- [ ] Tests updated or added  
- [ ] Coverage impact acceptable  

