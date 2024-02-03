export async function randomDelay(
    minDelay: number = 100,
    maxDelay: number = 400
) {
    const ms = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    return new Promise((resolve) => setTimeout(resolve, ms));
}
