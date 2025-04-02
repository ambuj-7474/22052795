export class NumberStore {
  constructor(windowSize) {
    this.windowSize = windowSize;
    this.numbers = [];
  }

  // Add a number to the store if it's unique
  addNumber(number) {
    // Check if number already exists
    if (!this.numbers.includes(number)) {
      // If window is full, remove the oldest number
      if (this.numbers.length >= this.windowSize) {
        this.numbers.shift();
      }
      // Add the new number
      this.numbers.push(number);
    }
  }

  // Get all numbers in the store
  getNumbers() {
    return [...this.numbers];
  }

  // Clear the store
  clear() {
    this.numbers = [];
  }
}