import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  image: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: 'John Doe',
    title: 'CEO & Founder',
    bio: 'Visionary leader with a passion for robotics and AI. John drives the company\'s strategic direction and innovation.',
    image: '/team-images/jd.svg',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Jane Smith',
    title: 'Lead Engineer',
    bio: 'Expert in robotic systems and software development. Jane leads the engineering team in building robust and efficient solutions.',
    image: '/team-images/js.svg',
    socials: { linkedin: '#', github: '#' },
  },
  {
    name: 'Peter Jones',
    title: 'Product Manager',
    bio: 'Focused on delivering user-centric products. Peter bridges the gap between customer needs and technical capabilities.',
    image: '/team-images/pj.svg',
    socials: { linkedin: '#' },
  },
  {
    name: 'Alice Brown',
    title: 'UX/UI Designer',
    bio: 'Crafting intuitive and engaging user experiences. Alice ensures our products are not only functional but also delightful to use.',
    image: '/team-images/ab.svg',
    socials: { twitter: '#' },
  },
];

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <Card className="flex flex-col items-center text-center p-6 bg-gray-800 text-white rounded-lg shadow-lg">
    <Image
      src={member.image}
      alt={member.name}
      width={120}
      height={120}
      className="rounded-full mb-4 border-4 border-primary-foreground"
    />
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{member.name}</CardTitle>
      <CardDescription className="text-primary-foreground">{member.title}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-gray-300 mb-4">{member.bio}</p>
      <div className="flex justify-center space-x-4">
        {member.socials.linkedin && (
          <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
            LinkedIn
          </a>
        )}
        {member.socials.twitter && (
          <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-500">
            Twitter
          </a>
        )}
        {member.socials.github && (
          <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-600">
            GitHub
          </a>
        )}
      </div>
    </CardContent>
  </Card>
);

export const MeetTheTeamSection: React.FC = () => {
  return (
    <section id="team" className="py-20 px-6 bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-5xl font-extrabold text-center text-white mb-16 leading-tight">
          Meet Our <span className="text-primary">Exceptional Team</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};