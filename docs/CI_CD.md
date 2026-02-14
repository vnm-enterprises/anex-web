# CI/CD Pipeline

Workflow: `.github/workflows/ci.yml`

## Stages
1. Install dependencies with pnpm.
2. Generate Prisma client.
3. Lint (`pnpm lint`).
4. Type check (`pnpm typecheck`).
5. Test + coverage (`pnpm test`, threshold 80%).
6. Production build (`pnpm build`).
7. Docker image build (`docker build`).

## Optional Push
A commented section is included in the workflow for registry login and image push.

## Gate Criteria
A PR is considered releasable only if all stages pass.

## Recommended Extensions
- Add SBOM/sca scan (e.g., Trivy, Snyk).
- Add migration smoke test against ephemeral DB.
- Add deployment job to DO/Lightsail on tagged releases.
