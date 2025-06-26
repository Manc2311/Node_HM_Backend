const db = require("../utils/db");
const { calculateBenefits, validateInputs, calculateAge } = require('../utils/helpers');
const policies = [
  {
    id: 'p1',
    name: 'Basic Term Plan',
    type: 'Term',
    basePremium: 1000,
    minAge: 18,
    maxAge: 60,
    riders: [
      { id: 'r1', name: 'Accidental Rider', additionalPremium: 200 },
      { id: 'r2', name: 'Critical Illness', additionalPremium: 300 },
    ],
    premiumOptions: [
      { term: 10, frequency: 'Yearly', multiplier: 1 },
      { term: 20, frequency: 'Monthly', multiplier: 0.1 },
    ],
  },
];

exports.getAllData = async (req, res) => {

  return res.json({ result: policies, status: 1 });


}

exports.getDataById = async (req, res) => {

  const { id } = req.params;



}

exports.getTypes = async (req, res) => {

  const [rows] = await db.query('SELECT * FROM policy_types')
  res.json(rows);
}

exports.CalculatePolicyDetails = async (req, res) => {

  const { dob, premium, sumAssured, pt, ppt, frequency, policyType } = req.body;

  const { isValid, errors } = validateInputs({ dob, premium, sumAssured, pt, ppt, frequency });

  if (!isValid) return res.status(400).json({ errors });


  let totalPremium = 0;
  let maturityAmount = 0;
  let totalBonusAmount = 0;
  const rows = [];

  for (let year = 1; year <= pt; year++) {
    const pay = year <= ppt ? premium : 0;
    const bonusRate = 2.5 + (year % 3);
    const isMaturityYear = year === Number(pt);
    const bonusAmount = (Number(sumAssured) * Number(bonusRate)) / 100;
    const totalBenefit = Number(sumAssured) + Number(bonusAmount);
    const netCashflow = -pay;

    totalPremium += Number(pay);
    totalBonusAmount += bonusAmount;
   const row = {
      policyYear: year,
      premium: pay,
      sumAssured:isMaturityYear ? sumAssured : 0,
      bonusRate: `${bonusRate.toFixed(2)}%`,
      bonusAmount,
      totalBenefit:isMaturityYear ? Number(sumAssured) + totalBonusAmount : 0,
      netCashflow
    }

     if (isMaturityYear) {
      maturityAmount = row.totalBenefit
    };


    rows.push(row);

  }

  try {
    const [result] = await db.query(
      'INSERT INTO illustrations (dob, premium, sumAssured, pt, ppt, frequency, policyType, totalPremium, maturityAmount, illustrationData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        dob,
        premium,
        sumAssured,
        pt,
        ppt,
        frequency,
        policyType,
        totalPremium,
        maturityAmount,
        JSON.stringify(rows)
      ]
    );

    res.json({
      id: result.insertId,
      totalPremium,
      maturityAmount,
      rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ['Failed to save illustration.'] });
  }

}


exports.getAllIllustrations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM illustrations ORDER BY createdAt DESC');
    res.json(rows.map(r => ({
      ...r,
      illustrationData: JSON.parse(r.illustrationData)
    })));
  } catch (err) {
    res.status(500).json({ errors: ['Failed to fetch illustrations.'] });
  }
};

exports.getIllustrationById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM illustrations WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Illustration not found' });
    }

    const illustration = rows[0];
    illustration.illustrationData = JSON.parse(illustration.illustrationData); // parse stored JSON

    res.json(illustration);
  } catch (err) {
    console.error('Error fetching illustration:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
