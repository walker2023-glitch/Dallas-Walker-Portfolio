# Portfolio content guide

Add future jobs and projects in the existing typed arrays. These files are the source of truth used by the portfolio and its AI assistant; no database is needed.

## Add a job or leadership entry

1. Open `data/experience.ts` and add an `ExperienceEntry` to `experience`.
2. Keep dates at the precision you can verify (for example, `May 2026`); use `null` when an end date is unknown and `current: true` only for an ongoing role.
3. Write bullets from work actually performed. Add outcomes or numbers only when supported by records or your confirmation.
4. Keep `kind: "employment"` and `kind: "leadership"` distinct.

## Add a project

1. Open `data/projects.ts` and add a `Project`.
2. Use `status: "in-progress"` for unfinished work or `"complete"` when the described scope is complete. Omit it for older entries until their status is confirmed.
3. Add links under `evidence` only when the destination is public and supports the description. Use `repository`, `demo`, or `report` for `kind`.
4. Keep planned features clearly described as planned. A project description or tool list does not verify a person's skill.
5. Use `null` for unknown completion dates and private repository URLs.

## Employer view

The concise employer page at `/employer` selects its featured work in `app/employer/page.tsx` by project ID. It reads experience, resume links, email, and LinkedIn from the existing content/config files. Keep the full portfolio routes available when updating that selection.
