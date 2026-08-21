/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 16 auto-writes AGENTS.md / CLAUDE.md at repo root as AI-agent shims.
  // Opt out — this is a small portfolio repo, not a framework monorepo.
  agentRules: false,
};

export default nextConfig;
