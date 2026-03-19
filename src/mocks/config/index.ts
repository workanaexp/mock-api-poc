import { userMockConfig, type UserEndpointId } from './user'
import { reportsMockConfig, type ReportsEndpointId } from './reports'

/**
 * This file is the SINGLE source of truth for
 * “which mocks are enabled in which environment”.
 *
 * - Each domain (user, reports, etc.) has its own config file.
 * - Here we:
 *   1. Merge all domain configs.
 *   2. Apply environment rules (dev / uat / prod).
 *   3. Flatten into a Set<string> of ids like "reports:list".
 *
 * Handlers only care about string ids and call `isMockIdEnabled(id)`.
 */

type DomainId = 'user' | 'reports'

// Map each domain to the union of endpoint ids defined in its config file.
type EndpointIdByDomain = {
  user: UserEndpointId
  reports: ReportsEndpointId
}

// Canonical shape of the “per-domain” config.
type DomainConfig = {
  [D in DomainId]: { [K in EndpointIdByDomain[D]]: boolean }
}

/**
 * Build the per-domain config according to the current environment.
 *
 * We use:
 * - import.meta.env.MODE (vite mode: development / production / custom)
 * - import.meta.env.VITE_ENV (optional high-level env: dev / uat / prod)
 *
 * Example:
 * - Local dev: MODE=development, no VITE_ENV → all mocks from base (userMockConfig, reportsMockConfig).
 * - UAT: VITE_ENV=uat → only some mocks enabled.
 * - Prod: VITE_ENV=prod or MODE=production → no mocks enabled.
 */
function resolveDomainConfig(): DomainConfig {
  const mode = import.meta.env.MODE
  // env is an optional high-level environment selector used to decide
  // which mocks are enabled (dev / uat / prod).
  // If it's not provided, we fall back to Vite mode (development / production / custom).
  const env = (import.meta.env.VITE_ENV as string | undefined) ?? mode

  // Base config: whatever each domain file declares.
  const base: DomainConfig = {
    user: userMockConfig,
    reports: reportsMockConfig,
  }

  // UAT example: only enable a subset of mocks.
  // e.g. VITE_ENV=uat
  if (env === 'uat') {
    return {
      user: {
        getUser: true,
      },
      reports: {
        list: true,
        detail: false,
        create: true,
      },
    }
  }

  // Production: turn everything off by default.
  // e.g. VITE_ENV=prod or Vite mode=production
  if (env === 'production' || env === 'prod') {
    return {
      user: {
        getUser: false,
      },
      reports: {
        list: false,
        detail: false,
        create: false,
      },
    }
  }

  // Default (development, test, etc.): full base config.
  return base
}

/**
 * Turn the per-domain boolean map into a flat Set of ids, e.g. "reports:list".
 * This is what handlers and MSW actually use.
 * Complexity: O(N) where N = total (domain, endpoint) pairs.
 *
 * Uses higher-order functions (flatMap, filter, map): they take a callback
 * function and apply it to each element — same family as Array.prototype.map/filter.
 */
function buildEnabledSet(cfg: DomainConfig): Set<string> {
  // [domain, endpoints][] e.g. [['user', { getUser: true }], ['reports', { list: true, ... }]]
  const domainEntries = Object.entries(cfg) as [
    DomainId,
    DomainConfig[DomainId],
  ][]

  // For each domain, collect enabled endpoint ids as "domain:endpoint", then flatten.
  const ids = domainEntries.flatMap(([domain, endpoints]) => {
    // [endpoint, enabled][] e.g. [['getUser', true], ['list', true], ['detail', false], ...]
    const endpointEntries = Object.entries(endpoints) as [
      EndpointIdByDomain[typeof domain],
      boolean,
    ][]
    // Keep only entries where enabled === true
    const enabled = endpointEntries.filter(([, enabled]) => enabled)
    // Turn each into "domain:endpoint"
    return enabled.map(([endpoint]) => `${domain}:${endpoint}`)
  })

  return new Set(ids)
}

const domainConfig = resolveDomainConfig()

export const enabledMocks = buildEnabledSet(domainConfig)

export function isMockIdEnabled(id: string): boolean {
  return enabledMocks.has(id)
}

