import '@testing-library/jest-dom'

if (typeof global.structuredClone === 'undefined') {
    global.structuredClone = (obj) => {
        return deepClone(obj)
    }
}

function deepClone(value) {
    if (value === null || typeof value !== 'object') return value
    if (Array.isArray(value)) return value.map(deepClone)

    const result = {}
    for (const key in value) {
        if (typeof value[key] !== 'function') {
            result[key] = deepClone(value[key])
        }
    }

    return result
}

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

if (typeof window.IntersectionObserver === 'undefined') {
    class IntersectionObserver {
        constructor(callback) { }
        observe() { }
        unobserve() { }
        disconnect() { }
    }

    Object.defineProperty(window, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: IntersectionObserver
    })

    Object.defineProperty(global, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: IntersectionObserver
    })
}

