import { useEffect, useState } from 'react'
import { Pie, Line, Bar } from 'react-chartjs-2'
import api from '../api/axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const COLORS = [
  '#063B18', // deep green
  '#0B5D1E', // dark green
  '#2E8B2E', // main green
  '#6DBB2D', // light green
  '#D89A10', // gold
  '#2F3A2F', // body text green
]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          size: 12,
          family: 'Inter, Arial, sans-serif',
        },
        color: '#2F3A2F',
        padding: 15,
      },
    },
  },
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-80 text-center">
      <img
        src="/images/mushawedu-logo.png"
        alt="MushaWedu Logo"
        className="w-12 h-12 object-contain mb-3 opacity-80"
      />

      <p className="text-gray-400 text-sm">
        {message}
      </p>
    </div>
  )
}

export default function AnalyticsCharts() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/suppliers/analytics/')
      .then(({ data }) => {
        setAnalyticsData(data)
        setError(null)
      })
      .catch((err) => {
        console.error('Analytics fetch error:', err)
        setError('Failed to load MushaWedu analytics.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <img
          src="/images/mushawedu-logo.png"
          alt="MushaWedu Logo"
          className="w-12 h-12 object-contain mx-auto mb-3 animate-pulse"
        />

        <div className="inline-block w-8 h-8 border-4 border-bgray border-t-orange rounded-full animate-spin" />

        <p className="text-gray-500 mt-3 text-sm">
          Loading MushaWedu analytics…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">
          {error}
        </p>
      </div>
    )
  }

  const topMaterialsData = {
    labels: analyticsData?.top_materials?.labels || [],
    datasets: [
      {
        label: 'Units Available',
        data: analyticsData?.top_materials?.data || [],
        backgroundColor: COLORS,
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  }

  const marketTrendsData = {
    labels: analyticsData?.market_trends?.labels || [],
    datasets: [
      {
        label: 'Materials Available',
        data: analyticsData?.market_trends?.data || [],
        borderColor: '#D89A10',
        backgroundColor: 'rgba(216, 154, 16, 0.12)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#D89A10',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  }

  const categoryBreakdownData = {
    labels: analyticsData?.category_breakdown?.labels || [],
    datasets: [
      {
        label: 'Listings by Category',
        data: analyticsData?.category_breakdown?.data || [],
        backgroundColor: COLORS,
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <img
          src="/images/mushawedu-logo.png"
          alt="MushaWedu Logo"
          className="w-11 h-11 object-contain"
        />

        <div>
          <h2 className="text-2xl font-bold text-navy mb-1">
            MushaWedu Market Analytics
          </h2>

          <p className="text-gray-500 text-sm">
            Real-time materials demand and market trends in Zimbabwe.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card p-6 border-t-4 border-orange">
          <h3 className="font-semibold text-navy mb-4">
            Top Materials Purchased
          </h3>

          <div className="relative h-80">
            {topMaterialsData.labels.length > 0 ? (
              <Pie
                data={topMaterialsData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'right',
                      labels: {
                        font: {
                          size: 12,
                          family: 'Inter, Arial, sans-serif',
                        },
                        color: '#2F3A2F',
                        padding: 15,
                      },
                    },
                  },
                }}
              />
            ) : (
              <EmptyState message="No analytics data available yet." />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6 border-t-4 border-orange">
          <h3 className="font-semibold text-navy mb-4">
            6-Month Market Trends
          </h3>

          <div className="relative h-80">
            {marketTrendsData.labels.length > 0 ? (
              <Line
                data={marketTrendsData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: '#2F3A2F',
                        font: { size: 11 },
                      },
                      grid: {
                        color: '#E5E7EB',
                      },
                    },
                    x: {
                      ticks: {
                        color: '#2F3A2F',
                        font: { size: 11 },
                      },
                      grid: {
                        color: '#E5E7EB',
                      },
                    },
                  },
                }}
              />
            ) : (
              <EmptyState message="No market trend data available yet." />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6 border-t-4 border-orange">
        <h3 className="font-semibold text-navy mb-4">
          Sales by Category
        </h3>

        <div className="relative h-80">
          {categoryBreakdownData.labels.length > 0 ? (
            <Bar
              data={categoryBreakdownData}
              options={{
                ...chartOptions,
                indexAxis: 'y',
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      color: '#2F3A2F',
                      font: { size: 11 },
                    },
                    grid: {
                      color: '#E5E7EB',
                    },
                  },
                  y: {
                    ticks: {
                      color: '#2F3A2F',
                      font: { size: 11 },
                    },
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          ) : (
            <EmptyState message="No category breakdown data available yet." />
          )}
        </div>
      </div>
    </div>
  )
}