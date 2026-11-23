# ATROPOLIES Information Security Policy — INTERNAL DRAFT

Owner: [company/legal entity]
Policy owner: [role]
Approved by: [authorized approver]
Effective date: [date]
Review cycle: at least annually and after a significant incident/change.

## Principles
- Least privilege and need-to-know access.
- MFA for privileged accounts.
- Unique credentials and secure secret storage.
- No production secrets in source control or browser code.
- Data minimization and purpose limitation.
- Secure development, review, testing and change management.
- Logging, backups, incident response and continuous improvement.

## Access management
Grant access only after approval. Use individual accounts, not shared logins.
Review administrator and vendor access regularly. Remove access promptly when
a person changes role or leaves. Elevated roles must never be self-assigned.

## Development and deployment
Use code review, dependency review and a staging environment. Protect the
production branch. Review diffs before deploy. Maintain rollback capability.
Do not use real customer data in development unless appropriately protected.

## Data handling
Classify public, internal, confidential and restricted data. Restrict exports.
Encrypt sensitive backups. Do not send customer data through personal email or
unapproved messaging. Dispose of data securely when retention ends.

## Vendors
Document each processor, purpose, data category, location, access, contract,
subprocessor and deletion/return process. Review security assurances and
international transfer safeguards.

## Incident reporting
All staff and contractors must report suspected compromise immediately to
[security contact]. Preserve evidence; do not conceal, alter or delete logs.

## Enforcement
Violations may result in access suspension and disciplinary/contractual action,
subject to applicable law and fair process.
