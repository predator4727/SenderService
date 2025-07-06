export const calculateTotal = (amounts: string): number => {
    const amountArray = amounts
        .split(/[\n,]+/)  // Handles both Unix and Windows line endings
        .map(item => item.trim())
        .filter(Boolean)  // Same as .filter(item => item !== '')
        .map(item => parseFloat(item))
        .filter(num => !isNaN(num)); // Ensure all are valid numbers

        return amountArray.reduce((sum, num) => sum + num, 0);
    };