const fs = require("fs");

// Convert number string from given base to decimal
function baseToDecimal(value, base) {
  return [...value].reduce((res, c) => {
    let digit;
    if (/[0-9]/.test(c)) digit = c.charCodeAt(0) - '0'.charCodeAt(0);
    else digit = c.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    return res * base + digit;
  }, 0);
}

// Multiply polynomial by (x - root)
function multiplyPoly(poly, root) {
  const newPoly = Array(poly.length + 1).fill(0);
  for (let i = 0; i < poly.length; i++) {
    newPoly[i] += poly[i];
    newPoly[i + 1] -= root * poly[i];
  }
  return newPoly;
}

// Construct polynomial from input
function constructPolynomial(data) {
  const n = data.keys.n;
  const k = data.keys.k;

  const roots = [];
  for (let i = 1; i <= n && roots.length < k; i++) {
    if (data[i]) {
      const base = parseInt(data[i].base);
      const value = data[i].value;
      const decimalValue = baseToDecimal(value, base);
      roots.push(decimalValue);
    }
  }

  let poly = [1];
  for (const r of roots) {
    poly = multiplyPoly(poly, r);
  }

  return poly;
}

// Read JSON file from command line
const filename = process.argv[2];
if (!filename) {
  console.error("Usage: node polynomial.js <input.json>");
  process.exit(1);
}

const rawData = fs.readFileSync(filename);
const data = JSON.parse(rawData);

const coeffs = constructPolynomial(data);
console.log("Polynomial Coefficients:", coeffs);
