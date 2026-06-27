/**
 * Readiness scoring — public entry point.
 *
 * Single source of truth consumed by the methodology page
 * (`/roadmap/methodology`), the roadmap data generator
 * (`scripts/generate-roadmap-data.ts`), and the auto-comment logic.
 */
export * from './types'
export * from './config'
export * from './scoring'
export { emptyIntake } from './defaults'
