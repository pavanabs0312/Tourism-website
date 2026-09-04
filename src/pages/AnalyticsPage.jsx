import React from 'react';
import { useAuthority } from '../context/AuthorityContext';
import { 
  BarChart, Activity, PieChart, TrendingUp, 
  Shield, AlertTriangle, PhoneCall, Clock 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export const AnalyticsPage = () => {
  const { kpiStats, tourists, dangerZones } = useAuthority();

  // 1. Safety Distribution Data (Doughnut)
  const safetyDistributionData = {
    labels: ['Safe (0-24)', 'Caution (25-49)', 'High Risk (50-74)', 'Critical (75-100)', 'Active SOS'],
    datasets: [
      {
        data: [
          kpiStats.safe,
          kpiStats.caution,
          kpiStats.highRisk,
          kpiStats.critical,
          kpiStats.activeSOS
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444', '#b91c1c'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  // 2. Hourly Tourist Activity / Risk Density (Line)
  const hourlyActivityData = {
    labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00'],
    datasets: [
      {
        label: 'Active Tourists Exploring',
        data: [4, 18, 42, 65, 58, 72, 85, 48, 22, 6],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.35,
        fill: true
      },
      {
        label: 'Calculated Hazard Indicators',
        data: [0, 1, 3, 4, 3, 5, 8, 14, 11, 4],
        borderColor: '#f97316',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.35
      }
    ]
  };

  // 3. Danger Zone Geo-Fence Incursions (Bar)
  const dangerIncursionsData = {
    labels: dangerZones.map(z => z.name.split(' ')[0] + ' ' + (z.name.split(' ')[1] || '')),
    datasets: [
      {
        label: 'Proximity Warnings Triggered (Last 7 Days)',
        data: [14, 28, 42, 9],
        backgroundColor: '#f59e0b',
        borderRadius: 6
      },
      {
        label: 'Immediate Route Divert Interventions',
        data: [11, 24, 38, 7],
        backgroundColor: '#10b981',
        borderRadius: 6
      }
    ]
  };

  // 4. Multi-Modal Transport Mode Choice (Doughnut)
  const transportShareData = {
    labels: ['🚆 Train / Express', '🚌 Public Bus', '🚕 Private Taxi', '🚇 City Metro', '🚶 Walking Trail'],
    datasets: [
      {
        data: [38, 24, 22, 11, 5],
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'],
        borderWidth: 2
      }
    ]
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '2rem 0 4rem', minHeight: 'calc(100vh - 68px)' }}>
      <div className="container-custom">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '0.4rem', borderRadius: '8px', color: '#2563eb' }}>
                <TrendingUp size={22} />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
                Predictive Risk & Mobility Analytics
              </h1>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Longitudinal risk indices, hazard proximity triggers, and multi-modal transport distribution metrics.
            </p>
          </div>

          <span className="badge badge-demo">
            Live Stream + SIH Baseline Analytics
          </span>
        </div>

        {/* 4 Analytics Chart Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* 1. Tourist Safety Distribution */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <PieChart size={18} color="#2563eb" />
              <span>Real-Time Tourist Safety Distribution</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
              Current census categorization across active tourists
            </p>
            <div style={{ maxHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Doughnut
                data={safetyDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
                }}
              />
            </div>
          </div>

          {/* 2. Hourly Tourist Flow & Risk Peaks */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={18} color="#f59e0b" />
              <span>Peak Tourist Density & Risk Correlation</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
              Hourly volume against elevated time-of-day risk multipliers
            </p>
            <div style={{ maxHeight: '280px', flex: 1 }}>
              <Line
                data={hourlyActivityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } } }
                }}
              />
            </div>
          </div>

          {/* 3. Danger Geo-Fence Incursions */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={18} color="#ea580c" />
              <span>Geo-Fence Proximity & Hazard Diverts</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
              Number of automated safer-route re-routings initiated by the safety engine
            </p>
            <div style={{ maxHeight: '280px', flex: 1 }}>
              <Bar
                data={dangerIncursionsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } } }
                }}
              />
            </div>
          </div>

          {/* 4. Multi-Modal Transport Split */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={18} color="#8b5cf6" />
              <span>Multi-Modal Modal Split (%)</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
              Choice distribution among analyzed multi-modal transit corridors
            </p>
            <div style={{ maxHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Doughnut
                data={transportShareData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
