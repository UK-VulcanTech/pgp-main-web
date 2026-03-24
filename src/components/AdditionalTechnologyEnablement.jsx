import { FaMicrochip, FaNetworkWired } from 'react-icons/fa';
import { MdCalendarToday } from 'react-icons/md';

export default function AdditionalTechnologyEnablement() {
  const features = [
    {
      icon: FaMicrochip,
      title: 'Infrastructure IT modernization and data lifecycle planning',
    },
    {
      icon: MdCalendarToday,
      title: 'Platform and dashboard development for performance monitoring and accountability',
    },
    {
      icon: FaNetworkWired,
      title:
        'Systems integration into real-world operations (utilities, logistics, ports, agriculture, and more)',
    },
  ];

  return (
    <section className="bg-gray-100 px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <h2 className="mb-12 text-center text-3xl font-bold uppercase text-slate-900 sm:text-4xl md:mb-16 md:text-5xl">
          Additional Technology Enablement
        </h2>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-6 rounded-full border-2 border-slate-400 p-6 md:mb-8">
                  <Icon
                    size={32}
                    className="text-slate-700 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  />
                </div>

                {/* Title/Description */}
                <p className="text-base font-medium leading-relaxed text-slate-900 sm:text-sm md:text-base">
                  {feature.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}