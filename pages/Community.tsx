
import React from 'react';
import { Link } from 'react-router-dom';
import { BuildingStorefrontIcon, CalendarDaysIcon, GlobeAltIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const Community: React.FC = () => {
  const resources = [
    {
      title: "Gujarati Samaj Germany",
      description: "The central organization for the Gujarati community in Germany, organizing cultural events and providing support.",
      link: "#",
      icon: GlobeAltIcon,
    },
    {
      title: "Upcoming Navratri Garba in Berlin",
      description: "Join the biggest Navratri celebration in Berlin this October. Tickets available now!",
      link: "/ads/8", // Link to the existing event ad
      icon: CalendarDaysIcon,
    },
    {
      title: "Local Gujarati Businesses",
      description: "A directory of Gujarati-owned businesses in Germany, from restaurants to grocery stores.",
      link: "#",
      icon: BuildingStorefrontIcon,
    },
    {
      title: "Community Forums",
      description: "Connect with other community members, ask questions, and share information on our forums.",
      link: "#",
      icon: ChatBubbleLeftRightIcon,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Community Corner</h1>
        <p className="mt-4 text-lg text-gray-600">
          Your central hub for community news, events, and resources in Germany.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((resource, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <resource.icon className="h-10 w-10 text-brand-saffron mb-4" />
            <h2 className="text-xl font-bold mb-2">{resource.title}</h2>
            <p className="text-gray-600 mb-4 h-24">{resource.description}</p>
            <Link to={resource.link} className="font-semibold text-brand-saffron hover:text-orange-600 transition-colors">
              Learn More &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
