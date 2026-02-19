import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import CollapsibleSection from '@/components/CollapsibleSection'

describe('CollapsibleSection', () => {
  it('renders the title', () => {
    render(
      <CollapsibleSection title="Test Section">
        <p>Content</p>
      </CollapsibleSection>
    )
    expect(screen.getByText('Test Section')).toBeInTheDocument()
  })

  it('shows content when defaultOpen is true', () => {
    render(
      <CollapsibleSection title="Open Section" defaultOpen={true}>
        <p>Visible content</p>
      </CollapsibleSection>
    )
    expect(screen.getByText('Visible content')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('toggles content visibility on button click', () => {
    render(
      <CollapsibleSection title="Toggle Section" defaultOpen={true}>
        <p>Toggle content</p>
      </CollapsibleSection>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('starts collapsed when defaultOpen is false', () => {
    render(
      <CollapsibleSection title="Closed Section" defaultOpen={false}>
        <p>Hidden content</p>
      </CollapsibleSection>
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('has type="button" on the toggle button', () => {
    render(
      <CollapsibleSection title="Button Type">
        <p>Content</p>
      </CollapsibleSection>
    )
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
