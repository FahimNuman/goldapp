"use client";

import { useState, useEffect } from 'react';

// Conversion constants
const GRAMS_PER_VORI = 11.664;
const POINTS_PER_VORI = 960;
const ANA_PER_VORI = 16;
const ROTI_PER_VORI = 96;
const GRAMS_PER_POINT = GRAMS_PER_VORI / POINTS_PER_VORI; // 0.01215 grams
const POINTS_PER_ANA = POINTS_PER_VORI / ANA_PER_VORI; // 60 points
const POINTS_PER_ROTI = POINTS_PER_VORI / ROTI_PER_VORI; // 10 points
const TAKA_PER_POINT = 185;
const USD_TO_TAKA = 120; // Hardcoded exchange rate
const GRAMS_PER_TROY_OUNCE = 31.1035;
const MIN_WITHDRAWAL_POINTS = 60;

// Type definitions
interface GoldPriceResponse {
  data: {
    price: number;
  };
}

export default function Home() {
  const [points, setPoints] = useState<string>('');
  const [savingsPlan, setSavingsPlan] = useState<string>('6 months');
  const [goldPriceUSD, setGoldPriceUSD] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch gold price (mocked)
  useEffect(() => {
    const mockFetchGoldPrice = async () => {
      // Simulated API response: gold price in USD per troy ounce
      const response: GoldPriceResponse = { data: { price: 3000 } }; // Example: $3000/oz
      setGoldPriceUSD(response.data.price);
      setLoading(false);
    };

    mockFetchGoldPrice();
  }, []);

  // Handle input change
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPoints(Number(value) >= 0 ? value : '');
  };

  // Handle savings plan change
  const handleSavingsPlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSavingsPlan(e.target.value);
  };

  // Calculate conversions
  const grams = Number(points) * GRAMS_PER_POINT;
  const vori = Number(points) / POINTS_PER_VORI;
  const ana = Number(points) / POINTS_PER_ANA;
  const roti = Number(points) / POINTS_PER_ROTI;

  // Calculate values
  const fixedRateValue = Number(points) * TAKA_PER_POINT;
  const goldPricePerGramUSD = goldPriceUSD / GRAMS_PER_TROY_OUNCE;
  const goldPricePerGramTaka = goldPricePerGramUSD * USD_TO_TAKA;
  const internationalValue = grams * goldPricePerGramTaka;

  // Calculate point-wise prices
  const fixedRatePerPoint = TAKA_PER_POINT;
  const internationalPricePerPoint = goldPricePerGramTaka * GRAMS_PER_POINT;

  // Withdrawal eligibility
  const canWithdraw = Number(points) >= MIN_WITHDRAWAL_POINTS;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-500">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl p-6">
        {/* Left Side: Input */}
        <div className="flex-1 bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">Gold Savings Calculator</h1>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Gold in Points
              <span className="ml-2 text-sm text-gray-500" title="1 Vori = 960 Points, 1 Ana = 60 Points, 1 Roti = 10 Points">
                (?)
              </span>
            </label>
            <input
              type="number"
              value={points}
              onChange={handlePointsChange}
              className={`w-full p-2 border-2 ${Number(points) < 0 ? 'border-red-500' : 'border-yellow-500'} rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-gray-50 text-gray-800`}
              placeholder="Enter points (e.g., 60)"
              min="0"
            />
            {Number(points) < 0 && (
              <p className="text-red-500 text-sm mt-1">Points cannot be negative</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Savings Plan</label>
            <select
              value={savingsPlan}
              onChange={handleSavingsPlanChange}
              className="w-full p-2 border-2 border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-gray-50 text-gray-800"
            >
              <option value="6 months">6 Months</option>
              <option value="1 year">1 Year</option>
            </select>
          </div>
          <button
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-900 font-semibold py-2 rounded-lg hover:scale-105 transition-transform"
            onClick={() => setPoints(points)} // Trigger re-render
          >
            Calculate Savings
          </button>
          {/* Conversions Below Button */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Conversions</h3>
            <p className="text-gray-600">Vori: {points ? vori.toFixed(4) : '0.0000'}</p>
            <p className="text-gray-600">Ana: {points ? ana.toFixed(4) : '0.0000'}</p>
            <p className="text-gray-600">Roti: {points ? roti.toFixed(4) : '0.0000'}</p>
            <p className="text-gray-600">Grams: {points ? grams.toFixed(4) : '0.0000'}</p>
            <p className="text-gray-600">Points: {points || '0'}</p>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="flex-1 bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-500">Savings Summary</h2>
          {loading ? (
            <p className="text-gray-600">Loading gold price...</p>
          ) : (
            <div className="space-y-6">
              {/* Savings Plan */}
              <div>
                <h3 className="text-lg font-medium text-gray-700">Savings Plan</h3>
                <p className="text-gray-600">Duration: {savingsPlan}</p>
                <p className="text-gray-600 flex items-center">
                  Withdrawal Eligibility:{' '}
                  {canWithdraw ? (
                    <span className="ml-2 text-green-500">✓ Eligible (≥60 points)</span>
                  ) : (
                    <span className="ml-2 text-red-500">✗ Need {MIN_WITHDRAWAL_POINTS - Number(points)} more points</span>
                  )}
                </p>
              </div>

              {/* Conversions */}
              <div>
                <h3 className="text-lg font-medium text-gray-700">Conversions</h3>
                <p className="text-gray-600">Vori: {points ? vori.toFixed(4) : '0.0000'}</p>
                <p className="text-gray-600">Ana: {points ? ana.toFixed(4) : '0.0000'}</p>
                <p className="text-gray-600">Roti: {points ? roti.toFixed(4) : '0.0000'}</p>
                <p className="text-gray-600">Grams: {points ? grams.toFixed(4) : '0.0000'}</p>
                <p className="text-gray-600">Points: {points || '0'}</p>
              </div>

              {/* Fixed Rate */}
              <div>
                <h3 className="text-lg font-medium text-gray-700">Fixed Rate</h3>
                <p className="text-gray-600">Per Point: {fixedRatePerPoint.toFixed(2)} Taka</p>
                <p className="text-gray-600">
                  Projected Value ({savingsPlan}): {points ? fixedRateValue.toFixed(2) : '0.00'} Taka
                </p>
              </div>

              {/* International Price */}
              <div>
                <h3 className="text-lg font-medium text-gray-700">International Price</h3>
                <p className="text-gray-600">Gold Price: ${goldPriceUSD.toFixed(2)}/oz</p>
                <p className="text-gray-600">
                  Per Point: {points ? internationalPricePerPoint.toFixed(2) : '0.00'} Taka
                </p>
                <p className="text-gray-600">
                  Projected Value ({savingsPlan}): {points ? internationalValue.toFixed(2) : '0.00'} Taka
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}