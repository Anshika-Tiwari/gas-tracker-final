'use client';

import { useEffect, useState } from 'react';
import { ethers, formatUnits } from 'ethers';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Home() {
  const [gasPrice, setGasPrice] = useState('Loading...');
  const [ethUsd, setEthUsd] = useState('Loading...');
  const [inputEth, setInputEth] = useState('');

  const pieData = [
    { name: 'Base Fee', value: 60 },
    { name: 'Priority Fee', value: 30 },
    { name: 'Max Fee', value: 10 },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

    const fetchGasPrice = async () => {
      try {
        const feeData = await provider.getFeeData();
        const gwei = formatUnits(feeData.gasPrice!, 'gwei');
        setGasPrice(parseFloat(gwei).toFixed(2));
      } catch (err) {
        console.error('Error fetching gas price:', err);
        setGasPrice('Error');
      }
    };

    const fetchEthUsd = async () => {
      try {
        const res = await fetch('/api/eth-price');
        if (!res.ok) throw new Error('Failed to fetch ETH price');
        const data = await res.json();
        setEthUsd(data.usd.toFixed(2));
      } catch (err) {
        console.error('Error fetching ETH/USD:', err);
        setEthUsd('Error');
      }
    };

    fetchGasPrice();
    fetchEthUsd();

    const interval = setInterval(() => {
      fetchGasPrice();
      fetchEthUsd();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-2xl p-6 space-y-6">
      <h1 className="text-4xl font-bold text-white">🚀 Ethereum Live Tracker</h1>

      {/* Gas Price Box */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 text-center space-y-4 w-full max-w-md">
        <h2 className="text-xl font-semibold text-green-400">⛽ Current Gas Price</h2>
        <p className="text-3xl">{gasPrice} GWEI</p>
      </div>

      {/* ETH to USD Box */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 text-center space-y-4 w-full max-w-md">
        <h2 className="text-xl font-semibold text-yellow-300">💰 ETH to USD</h2>
        <p className="text-3xl">1 ETH = ${ethUsd}</p>
      </div>

      {/* 🧪 Simulation Section */}
{/* 🧮 Simulation Section */}
<div className="bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 w-full max-w-md">
  <h2 className="text-xl font-semibold text-blue-400">🧪 Gas Cost Simulation</h2>
  <label className="block text-sm text-white mb-1">Enter ETH to Send</label>
  <input
    type="number"
    min="0"
    step="0.01"
    value={inputEth}
    onChange={(e) => setInputEth(e.target.value)}
    placeholder="e.g. 0.5"
    className="w-full p-2 rounded bg-white text-black"
  />

  {gasPrice !== 'Loading...' && ethUsd !== 'Loading...' && inputEth !== '' && (
    <div className="text-white mt-4 space-y-1 text-base">
      <p>
        Transaction Value: ${(
          parseFloat(inputEth) * parseFloat(ethUsd)
        ).toFixed(2)}
      </p>
      <p>
        Estimated Gas Fee: ${(
          (parseFloat(gasPrice) * 21000 * parseFloat(ethUsd)) /
          1e9
        ).toFixed(2)}
      </p>
      <p className="font-semibold text-green-400">
        Total Cost: ${(
          parseFloat(inputEth) * parseFloat(ethUsd) +
          (parseFloat(gasPrice) * 21000 * parseFloat(ethUsd)) / 1e9
        ).toFixed(2)}
      </p>
    </div>
  )}
</div>


      {/* Pie Chart Section */}
      <div className="w-full max-w-md h-80 mt-10 bg-white rounded-xl p-4">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-400 mt-10">Updates every 10 seconds</p>
    </main>
  );
}
