export function createTimestamp() {
  return new Date().toISOString().replace(/[:.\s-]/g, "_"); // Replace colons, dots, spaces, and dashes with underscores for a clean filename
}
export function createTimestampArrow() {
  for (let i = 0; i < 5; i += 1) {
    console.log("* * * *");
  }
  for (let i = 8; i > 0; i -= 1) {
    console.log(...Array(i).fill("*"));
  }
  return new Date().toISOString().replace(/[:.\s-]/g, "_"); // Replace colons, dots, spaces, and dashes with underscores for a clean filename
}
