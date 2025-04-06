import React from 'react';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      name: "アン・フック",
      role: "FE",
      description: "フックはEigaのフロントエンド開発を担当し、ユーザーが映画を簡単に管理できるような直感的なインターフェースを提供しています。",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      id: 2,
      name: "ヒュー サン",
      role: "NOLE",
      description: "サンはEigaのバックエンド開発を担当し、映画データベースのパフォーマンスとセキュリティを確保しています。",
      imageUrl: "data:image/jpeg;base64,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"
    },
    {
      id: 3,
      name: "べんきょう",
      role: "BE",
      description: "べんきょうはEigaのデータベース管理を担当し、映画情報が正確かつ最新であることを保証しています。",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      id: 4,
      name: "Yuki Sato",
      role: "UX/UI Designer",
      description: "Yuki crafts beautiful, intuitive interfaces that make discovering and managing movies a delightful experience for all Eiga users.",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      id: 5,
      name: "Kenji Watanabe",
      role: "Marketing Director",
      description: "Kenji develops strategies to expand Eiga's global reach, connecting with film lovers across cultures while strengthening our industry partnerships.",
      imageUrl: "https://via.placeholder.com/300x200"
    },
    {
      id: 6,
      name: "Mika Kobayashi",
      role: "Customer Relations",
      description: "Mika ensures our users receive exceptional support and that their feedback directly influences how we evolve the Eiga platform.",
      imageUrl: "https://via.placeholder.com/300x200"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">About Eiga Cinema</h1>
        <p className="text-xl text-gray-600 mb-4">Your premier platform for movie management</p>
        <div className="h-1 w-20 bg-red-600 mx-auto"></div>
      </header>

      <section className="max-w-3xl mx-auto mb-12">
        <p className="text-gray-700 mb-4">
          Eiga Cinema was founded with a deep passion for the art of filmmaking and a commitment to
          creating the ultimate movie management platform. Our goal is to connect cinema enthusiasts
          with the content they love while providing powerful tools for organization and discovery.
        </p>
        <p className="text-gray-700">
          Our dedicated team combines film expertise with technological innovation to ensure
          Eiga delivers the most comprehensive and user-friendly experience in the industry.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:translate-y-[-5px]">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-48 objectFit-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <h4 className="text-red-600 mb-3">{member.role}</h4>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
