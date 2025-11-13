```markdown
# Codex of Interoperable Safety

This codex is a living scroll that defines the safety rituals and interoperability oaths
for the Interlink Protocol. Its purpose: to keep worlds tethered, assets honest, and rituals auditable.

Principles
- Do no harm: modules must fail closed; critical checks emit InteropCheck logs.
- Versioned rituals: every transformation step records a protocolVersion.
- Minimize trust: prefer deterministic on-chain checks; external attestations must be logged.

Practical rules
- Any transformation that affects ownership or value must emit an event with a traceable id.
- Emergency pause can be activated by an appointed Moderator role. Pause is a temporary ritual, not a banishment.
- Migrations must include mapping documents and cryptographic proofs.

Rituals and checks
- InteropCheck event: include checkId (bytes32), passed(bool), and human note.
- Milestone triggers require explicit owner-set rules; default to conservative behavior.

This codex is a guide and a promise: the community may expand its clauses through governance.
```
