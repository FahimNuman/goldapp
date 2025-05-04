/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from '../app/i18n';
import { RootState } from '../app/store';

// Conversion constants
const GRAMS_PER_VORI = 11.664;
const POINTS_PER_VORI = 960;
const ANA_PER_VORI = 16;
const ROTI_PER_VORI = 96;
const GRAMS_PER_POINT = GRAMS_PER_VORI / POINTS_PER_VORI; // 0.01215 grams
const POINTS_PER_ANA = POINTS_PER_VORI / ANA_PER_VORI; // 60 points
const POINTS_PER_ROTI = POINTS_PER_VORI / ROTI_PER_VORI; // 10 points
const MIN_WITHDRAWAL_POINTS = 60;
const VAT_RATE = 0.05; // 5%
const SERVICE_CHARGE_RATE = 0.01; // 1%

// Mock recent gold prices
const mockGoldPrices: { date: string; price: number }[] = [
  { date: "2025-05-05", price: 190 },
  { date: "2025-05-04", price: 188 },
  { date: "2025-05-03", price: 185 }
];

export default function GoldCalculator() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const translations = useSelector((state: RootState) => state.translations.resources);

  // State for inputs
  const [points, setPoints] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [withdrawalType, setWithdrawalType] = useState<'cash' | 'gold_bar'>('cash');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ date: string; price: number }[]>([]);
  const [language, setLanguage] = useState<string>('en');

  // Handle input changes
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(value >= "0" ? value : '');
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang); // Update i18n language directly
  };

  // Search gold prices
  useEffect(() => {
    if (searchQuery) {
      const results = mockGoldPrices.filter((item) =>
        item.date.includes(searchQuery)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Calculate conversions
  const totalPoints = Number(points);
  const grams = totalPoints * GRAMS_PER_POINT;
  const vori = totalPoints / POINTS_PER_VORI;
  const ana = totalPoints / POINTS_PER_ANA;
  const roti = totalPoints / POINTS_PER_ROTI;

  // Calculate purchase and withdrawal values
  const purchaseCost = totalPoints * Number(purchasePrice);
  const baseSellValue = totalPoints * Number(sellPrice);
  const cashSellValueAfterDeduction = baseSellValue * (1 - 0.18); // 18% deduction
  const cashSellValueAfterCharges = cashSellValueAfterDeduction * (1 - VAT_RATE - SERVICE_CHARGE_RATE);
  
  const goldBarValueAfterDeduction = baseSellValue * (1 - 0.02); // 2% deduction for gold bar
  const goldBarPoints = goldBarValueAfterDeduction / Number(sellPrice); // Points of gold bar
  const goldBarGrams = goldBarPoints * GRAMS_PER_POINT;

  // Withdrawal eligibility
  const canWithdraw = totalPoints >= MIN_WITHDRAWAL_POINTS;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-400 sm:p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl sm:max-w-full md:max-w-3xl p-6 sm:p-4">
        {/* Left Side: Input */}
        <div className="flex-1 bg-white rounded-lg shadow-xl p-6 sm:p-4">
          <h1 className="text-2xl font-bold mb-6 text-center text-orange-500 sm:text-lg md:text-xl">{t('title')}</h1>
          
          {/* Language Selector */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium sm:text-sm md:text-base">{t('language')}</label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full p-2 border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-gray-800 sm:p-1 sm:text-sm md:p-2 md:text-base"
            >
              <option value="en">{t('english')}</option>
              <option value="bn">{t('bangla')}</option>
              <option value="hi">{t('hindi')}</option>
              <option value="ur">{t('urdu')}</option>
              <option value="ta">{t('tamil')}</option>
              <option value="ja">{t('japanese')}</option>
              <option value="ko">{t('korean')}</option>
              <option value="ne">{t('nepali')}</option>
            </select>
          </div>

          {/* Purchase Inputs */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium sm:text-sm md:text-base">{t('points')}</label>
            <input
              type="number"
              value={points}
              onChange={handleInputChange(setPoints)}
              className={`w-full p-2 border-2 ${Number(points) < 0 ? 'border-red-500' : 'border-orange-500'} rounded focus:outline-none focus:ring-2 focus:ring-orange-600 bg-gray-50 text-gray-800 sm:p-1 sm:text-sm md:p-2 md:text-base`}
              placeholder={t('points_placeholder')}
              min="0"
            />
            {Number(points) < 0 && (
              <p className="text-red-500 text-sm mt-1 sm:text-xs md:text-sm">{t('negative_error')}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium sm:text-sm md:text-base">{t('purchase_price')}</label>
            <input
              type="number"
              value={purchasePrice}
              onChange={handleInputChange(setPurchasePrice)}
              className={`w-full p-2 border-2 ${Number(purchasePrice) < 0 ? 'border-red-500' : 'border-orange-500'} rounded focus:outline-none focus:ring-2 focus:ring-orange-600 bg-gray-50 text-gray-800 sm:p-1 sm:text-sm md:p-2 md:text-base`}
              placeholder={t('purchase_price_placeholder')}
              min="0"
            />
            {Number(purchasePrice) < 0 && (
              <p className="text-red-500 text-sm mt-1 sm:text-xs md:text-sm">{t('negative_error')}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium sm:text-sm md:text-base">{t('sell_price')}</label>
            <input
              type="number"
              value={sellPrice}
              onChange={handleInputChange(setSellPrice)}
              className={`w-full p-2 border-2 ${Number(sellPrice) < 0 ? 'border-red-500' : 'border-orange-500'} rounded focus:outline-none focus:ring-2 focus:ring-orange-600 bg-gray-50 text-gray-800 sm:p-1 sm:text-sm md:p-2 md:text-base`}
              placeholder={t('sell_price_placeholder')}
              min="0"
            />
            {Number(sellPrice) < 0 && (
              <p className="text-red-500 text-sm mt-1 sm:text-xs md:text-sm">{t('negative_error')}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium sm:text-sm md:text-base">{t('withdrawal_type')}</label>
            <select
              value={withdrawalType}
              onChange={(e) => setWithdrawalType(e.target.value as 'cash' | 'gold_bar')}
              className="w-full p-2 border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-600 bg-gray-50 text-gray-800 sm:p-1 sm:text-sm md:p-2 md:text-base"
            >
              <option value="cash">{t('cash')}</option>
              <option value="gold_bar">{t('gold_bar')}</option>
            </select>
          </div>
          <button
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-red-900 font-semibold py-2 rounded-lg hover:scale-105 transition-transform sm:py-1 sm:text-sm md:py-2 md:text-base"
            onClick={() => {}} // Trigger re-render
          >
            {t('calculate')}
          </button>
          {/* Search Gold Prices */}
          <div className="mt-4">
            <label className="block text-gray-700 mb-2 font-medium sm:text-sm md:text-base">{t('search_prices')}</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border-2 border-orange-500 rounded focus:outline-none focus:ring-2 focus:ring-orange-600 bg-gray-50 text-gray-800 sm:p-1 sm:text-sm md:p-2 md:text-base"
              placeholder={t('search_placeholder')}
            />
            {searchResults.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg sm:p-1">
                <h3 className="text-lg font-medium text-gray-700 sm:text-sm md:text-base">{t('search_results')}</h3>
                {searchResults.map((result, index) => (
                  <p key={index} className="text-gray-600 sm:text-xs md:text-sm">
                    {t('price_on_date', { date: result.date, price: result.price })}
                  </p>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <p className="text-red-500 text-sm mt-1 sm:text-xs md:text-sm">{t('no_results')}</p>
            )}
          </div>
          {/* Conversions Below Button */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg sm:p-2">
            <h3 className="text-lg font-medium text-gray-700 mb-2 sm:text-sm md:text-base">{t('conversions')}</h3>
            <p className="text-gray-600 sm:text-xs md:text-sm">{t('vori')}: {totalPoints ? vori.toFixed(4) : '0.0000'}</p>
            <p className="text-gray-600 sm:text-xs md:text-sm">{t('ana')}: {totalPoints ? ana.toFixed(4) : '0.0000'}</p>
            <p className="text-gray-600 sm:text-xs md:text-sm">{t('roti')}: {totalPoints ? roti.toFixed(4) : '0.0000'}</p>
            <p className="text-gray-600 sm:text-xs md:text-sm">{t('grams')}: {totalPoints ? grams.toFixed(4) : '0.0000'}</p>
            <p className="text-gray-600 sm:text-xs md:text-sm">{t('points_label')}: {totalPoints || '0'}</p>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="flex-1 bg-white rounded-lg shadow-xl p-6 sm:p-4">
          <h2 className="text-xl font-semibold mb-4 text-orange-500 sm:text-base md:text-lg">{t('transaction_summary')}</h2>
          <div className="space-y-6 sm:space-y-4">
            {/* Purchase Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 sm:text-sm md:text-base">{t('purchase_summary')}</h3>
              <p className="text-gray-600 sm:text-xs md:text-sm">{t('total_points')}: {totalPoints || '0'}</p>
              <p className="text-gray-600 sm:text-xs md:text-sm">{t('purchase_cost')}: {purchaseCost ? purchaseCost.toFixed(2) : '0.00'}</p>
            </div>

            {/* Withdrawal Eligibility */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 sm:text-sm md:text-base">{t('withdrawal_eligibility')}</h3>
              <p className="text-gray-600 flex items-center sm:text-xs md:text-sm">
                {canWithdraw ? (
                  <span className="ml-2 text-green-500">✓ {t('eligible')}</span>
                ) : (
                  <span className="ml-2 text-red-500">✗ {t('not_eligible', { count: MIN_WITHDRAWAL_POINTS - totalPoints })}</span>
                )}
              </p>
            </div>

            {/* Withdrawal Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 sm:text-sm md:text-base">{t('withdrawal_summary')}</h3>
              <p className="text-gray-600 sm:text-xs md:text-sm">{t('withdrawal_type_label')}: {withdrawalType === 'cash' ? t('cash') : t('gold_bar')}</p>
              {withdrawalType === 'cash' ? (
                <>
                  <p className="text-gray-600 sm:text-xs md:text-sm">{t('base_sell_value')}: {baseSellValue ? baseSellValue.toFixed(2) : '0.00'}</p>
                  <p className="text-gray-600 sm:text-xs md:text-sm">{t('after_18_deduction')}: {cashSellValueAfterDeduction ? cashSellValueAfterDeduction.toFixed(2) : '0.00'}</p>
                  <p className="text-gray-600 sm:text-xs md:text-sm">{t('after_charges')}: {cashSellValueAfterCharges ? cashSellValueAfterCharges.toFixed(2) : '0.00'}</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 sm:text-xs md:text-sm">{t('base_sell_value')}: {baseSellValue ? baseSellValue.toFixed(2) : '0.00'}</p>
                  <p className="text-gray-600 sm:text-xs md:text-sm">{t('after_2_deduction')}: {goldBarValueAfterDeduction ? goldBarValueAfterDeduction.toFixed(2) : '0.00'}</p>
                  <p className="text-gray-600 sm:text-xs md:text-sm">{t('gold_bar_points')}: {goldBarPoints ? goldBarPoints.toFixed(2) : '0.00'}</p>
                  <p className="text-gray-600 sm:text-xs md:text-sm">{t('gold_bar_grams')}: {goldBarGrams ? goldBarGrams.toFixed(4) : '0.0000'}</p>
                </>
              )}
            </div>

            {/* Conversions */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 sm:text-sm md:text-base">{t('conversions')}</h3>
              <p className="text-gray-600 sm:text-xs md:text-sm">{t('vori')}: {totalPoints ? vori.toFixed(4) : '0.0000'}</p>
              <p className="text-gray-600 sm:text-xs md:text-sm">{t('ana')}: {totalPoints ? ana.toFixed(4) : '0.0000'}</p>
              <p className="text-gray-600 sm:text-xs md:text-sm">{t('roti')}: {totalPoints ? roti.toFixed(4) : '0.0000'}</p>
              <p className="text-gray-600 sm:text-xs md:text-sm">{t('grams')}: {totalPoints ? grams.toFixed(4) : '0.0000'}</p>
              <p className="text-gray-600 sm:text-xs md:text-sm">{t('points_label')}: {totalPoints || '0'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}