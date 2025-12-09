# Accessibility Checklist (WCAG-Oriented)

Use this checklist during development and before major releases.

## 1. Structure and Semantics

- [ ] Pages use proper heading hierarchy (`h1`, `h2`, `h3`).
- [ ] Landmarks (e.g., `<header>`, `<nav>`, `<main>`, `<footer>`) are used appropriately.
- [ ] Lists use `<ul>`, `<ol>`, and `<li>` correctly.

## 2. Keyboard Navigation

- [ ] All interactive elements are reachable via `Tab` / `Shift+Tab`.
- [ ] Focus states are clearly visible.
- [ ] No keyboard traps (user can always move out of a component).
- [ ] Skip link to main content exists for long pages.

## 3. Forms

- [ ] Each input has an associated `<label>` or `aria-label`.
- [ ] Error messages are announced (or visible) when validation fails.
- [ ] Required fields are clearly indicated.

## 4. Color and Contrast

- [ ] Text contrast ratio meets WCAG AA (at least 4.5:1 for normal text).
- [ ] Color is not the only means of conveying information.
- [ ] Focus and hover states are distinguishable.

## 5. Images and Media

- [ ] Images have appropriate `alt` text.
- [ ] Decorative images use empty `alt=""`.
- [ ] Videos have captions and (where needed) transcripts.

## 6. ARIA Usage

- [ ] ARIA roles and attributes are used only when necessary.
- [ ] No invalid ARIA attributes.
- [ ] Custom components (e.g., modals, dropdowns) expose correct roles and state.

## 7. Testing

- [ ] Automated checks (e.g., axe) run on main pages.
- [ ] Manual screen reader check (NVDA, VoiceOver, or similar) for critical flows.

Document any deviations and mitigations in relevant PRs or design docs.
