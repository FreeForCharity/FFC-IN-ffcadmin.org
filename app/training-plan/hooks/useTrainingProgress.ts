'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ffc_training_progress'

export function useTrainingProgress(totalItems: number) {
    // Use a Set for O(1) lookups
    const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                setCompletedItems(new Set(JSON.parse(stored)))
            }
        } catch (error) {
            console.error('Failed to load training progress:', error)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(Array.from(completedItems))
                )
            } catch (error) {
                console.error('Failed to save training progress:', error)
            }
        }
    }, [completedItems, isLoaded])

    const toggleItem = (id: string) => {
        setCompletedItems((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const resetProgress = () => {
        if (confirm('Are you sure you want to reset all progress?')) {
            setCompletedItems(new Set())
        }
    }

    const progressPercentage =
        totalItems > 0 ? Math.round((completedItems.size / totalItems) * 100) : 0

    return {
        completedItems,
        toggleItem,
        resetProgress,
        progressPercentage,
        isLoaded,
    }
}
