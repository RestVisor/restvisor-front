import React from 'react';

interface StatCardsProps {
    stats: {
        total: number;
        pending: number;
        inProgress: number;
        ready: number;
    };
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
    const items = [
        {
            title: 'Total Pedidos Activos',
            value: stats.total,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            ),
            color: 'from-purple-600 to-indigo-700',
        },
        {
            title: 'Pedidos Pendientes',
            value: stats.pending,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
            color: 'from-yellow-500 to-yellow-600',
        },
        {
            title: 'En Preparación',
            value: stats.inProgress,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Listos para Entregar',
            value: stats.ready,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`bg-gradient-to-r ${item.color} rounded-lg p-4 shadow-lg flex items-center justify-between`}
                >
                    <div>
                        <h3 className="text-white text-sm font-medium mb-1">{item.title}</h3>
                        <p className="text-white text-2xl font-bold">{item.value}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">{item.icon}</div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
