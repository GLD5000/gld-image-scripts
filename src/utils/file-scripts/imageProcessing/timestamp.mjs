export function createTimestamp() {
    return new Date().toISOString().replace(/[:.\s-]/g, '_'); // Replace colons, dots, spaces, and dashes with underscores for a clean filename
}
