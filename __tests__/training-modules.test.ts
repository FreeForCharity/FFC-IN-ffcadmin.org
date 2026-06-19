import { TRAINING_MODULES, LEARNING_PATHS, getModule, getPath } from '../src/data/training-modules'
import { getSetupGuide } from '../src/data/setup-guides'
import { VOLUNTEER_ROLES } from '../src/data/volunteer-roles'

describe('Training modules data model', () => {
  it('has unique module ids', () => {
    const ids = TRAINING_MODULES.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every module defines at least one tier with directives', () => {
    for (const m of TRAINING_MODULES) {
      const tiers = Object.values(m.tiers)
      expect(tiers.length).toBeGreaterThan(0)
      for (const t of tiers) {
        expect(t?.objective?.length ?? 0).toBeGreaterThan(0)
        expect((t?.directives.length ?? 0) > 0).toBe(true)
      }
    }
  })

  it('every directive has a unique id across the catalog', () => {
    const ids = TRAINING_MODULES.flatMap((m) =>
      Object.values(m.tiers).flatMap((t) => t?.directives.map((d) => d.id) ?? [])
    )
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every learning-path entry references a module that defines that tier', () => {
    for (const path of LEARNING_PATHS) {
      for (const entry of path.entries) {
        const mod = getModule(entry.moduleId)
        expect(mod).toBeDefined()
        expect(mod?.tiers[entry.tier]).toBeDefined()
      }
    }
  })

  it('every prerequisiteGuides slug resolves to a real personal-track setup guide', () => {
    for (const path of LEARNING_PATHS) {
      for (const slug of path.prerequisiteGuides ?? []) {
        const guide = getSetupGuide(slug)
        expect(guide).toBeDefined()
        // Prerequisites are individual setup, so they must be personal-track.
        expect(guide?.track === 'organizational').toBe(false)
      }
    }
  })

  it('every volunteer-role pathId resolves to a learning path', () => {
    for (const role of VOLUNTEER_ROLES) {
      if (role.pathId) expect(getPath(role.pathId)).toBeDefined()
    }
  })

  it('exposes the Site Owner path composed of operator (T1) modules', () => {
    const owner = getPath('site-owner')
    expect(owner).toBeDefined()
    expect(owner!.entries.length).toBeGreaterThanOrEqual(8)
    expect(owner!.entries.every((e) => e.tier === 'T1')).toBe(true)
    // Must-not-miss fundamentals are present.
    const ids = owner!.entries.map((e) => e.moduleId)
    expect(ids).toContain('domains-dns')
    expect(ids).toContain('email-m365')
    expect(ids).toContain('security-trust')
  })
})
