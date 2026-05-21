/**
 * FarmSense — Market Intelligence Service
 * Handles financial calculations, revenue estimations, and loss quantification
 */

export function calculateFinancials(yieldPrediction, crop) {
  if (!crop.msp || !yieldPrediction) return null;

  const pricePerQuintal = crop.msp;
  
  // Total expected revenue if conditions were perfect (100% weather & soil scores)
  // Let's take the baseYield * area * optimal Multipliers (soil 1.0, weather 1.0, irr 1.0)
  // Or simply use the predicted yield compared to a hypothetical 100% yield.
  
  // Let's use the actual predicted yield vs the maximum potential yield
  const basePotentialPerAcre = yieldPrediction.baseYield * 1.15; // Assuming optimal conditions yield ~15% above base
  const maxPotentialTotal = basePotentialPerAcre * (yieldPrediction.total / (yieldPrediction.perAcre || 1)); 
  
  const expectedRevenue = yieldPrediction.total * pricePerQuintal;
  const maxRevenue = maxPotentialTotal * pricePerQuintal;
  
  const estimatedLoss = maxRevenue - expectedRevenue;

  return {
    pricePerQuintal,
    expectedRevenue: Math.round(expectedRevenue),
    maxRevenue: Math.round(maxRevenue),
    estimatedLoss: Math.round(Math.max(0, estimatedLoss)),
    currency: '₹'
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
