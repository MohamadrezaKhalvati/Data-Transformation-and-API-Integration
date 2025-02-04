export function cleanObject(obj) {
    if (Array.isArray(obj)) {
        return obj
            .map(item => cleanObject(item))
            .filter(
                item =>
                    item !== undefined &&
                    item !== null &&
                    item !== '' &&
                    !Number.isNaN(item),
            )
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const cleanedValue = cleanObject(value)
            if (
                cleanedValue !== undefined &&
                cleanedValue !== null &&
                cleanedValue !== '' &&
                !Number.isNaN(cleanedValue)
            ) {
                acc[key] = cleanedValue
            }
            return acc
        }, {})
    }
    return obj
}
