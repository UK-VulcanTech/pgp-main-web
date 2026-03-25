
import { FaPuzzlePiece, FaChartBar, FaBroadcastTower, FaDatabase, FaPlay } from 'react-icons/fa';

export default function CoreTechnologyDomains() {
  const domains = [
    {
      id: 1,
      title: 'Software Integration',
      description:
        'Structured project management frameworks and supporting digital infrastructure to enable coordinated solutions',
      icon: FaPuzzlePiece,
      span: 'md:col-span-2',
    },
    {
      id: 2,
      title: 'Data Analysis Tools',
      description: '',
      icon: FaChartBar,
      span: 'md:col-span-1',
    },
    {
      id: 3,
      title: 'Communication',
      description: '',
      icon: FaBroadcastTower,
      span: 'md:col-span-1',
    },
    {
      id: 4,
      title: 'Data Centers',
      description:
        'Planning and execution support for reliable, scalable data center initiatives',
      icon: FaDatabase,
      span: 'md:col-span-2',
    },
    {
      id: 5,
      title: 'Command Centers',
      description:
        'Integrated command centers that unify real-time data, communications, and decision-support tools to improve situational awareness, coordination, and operational response across multi-agency and critical infrastructure environments',
      icon: FaPlay,
      span: 'md:col-span-3',
    },
  ];

  return (
    <section className="bg-slate-900 px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          CORE TECHNOLOGY DOMAINS
        </h2>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {domains.map((domain) => {
            const Icon = domain.icon;

            return (
              <div
                key={domain.id}
                className={`relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800 bg-opacity-50 p-6 backdrop-blur sm:p-8 md:p-8 ${domain.span}`}
              >
                {/* Icon */}
                <div className="mb-4 inline-block rounded bg-slate-700 bg-opacity-30 p-3">
                  <Icon className="text-2xl text-white sm:text-3xl" />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold text-white sm:text-2xl">
                  {domain.title}
                </h3>

                {domain.description && (
                  <p className="text-sm text-slate-400 sm:text-base">
                    {domain.description}
                  </p>
                )}

                {/* Decorative accent elements */}
                <div className="absolute bottom-0 right-0 opacity-10">
                  <div className="h-20 w-20 rounded-lg border-2 border-yellow-500"></div>
                  <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-lg border-2 border-yellow-500"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}