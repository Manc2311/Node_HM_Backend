const moment = require('moment')

function maskMobile(mobile) {
  return '*******' + mobile.slice(-3);
}

function calculateAge(dob) {
  const birthDate = moment(dob, 'YYYY-MM-DD');
  const today = moment();
  return today.diff(birthDate, 'years');
}
function validateInputs({ dob, premium, sumAssured, pt, ppt, frequency }) {
  const errors = [];
  const age = calculateAge(dob);
  console.log(pt, ppt, 'in validation');
  premium = Number(premium);
  sumAssured = Number(sumAssured);
  pt = Number(pt);
  ppt = Number(ppt);
  // 1. Ranges
  if (ppt < 5 || ppt > 10) errors.push('PPT must be between 5 and 10 years.');
  if (pt < 10 || pt > 20) errors.push('PT must be between 10 and 20 years.');
  if (premium < 10000 || premium > 50000) errors.push('Premium must be between 10,000 and 50,000.');

  // 2. PT > PPT
  if (pt <= ppt) errors.push('PT must be greater than PPT.');

  // 3. Valid Frequencies
  const allowedFrequencies = ['Yearly', 'Half-Yearly', 'Monthly'];
  if (!allowedFrequencies.includes(frequency)) {
    errors.push('Premium Frequency must be Yearly, Half-Yearly, or Monthly.');
  }

  // 4. Sum Assured
  const minSumAssured = Math.max(premium * 10, 5000000);
  if (sumAssured < minSumAssured) {
    errors.push(`Sum Assured must be at least ${minSumAssured.toLocaleString()}`);
  }

  // 5. Age
  if (age < 23 || age > 56) errors.push('Age must be between 23 and 56 years.');

  return { isValid: errors.length === 0, errors };
}


function calculateBenefits({ age, premium, term, policyType }) {
  const totalPremium = premium * term;
  const maturityAmount = totalPremium + (term * 500); // Sample formula
  return { totalPremium, maturityAmount };
}

module.exports = { maskMobile, validateInputs, calculateBenefits, calculateAge };
