export const navigation = [
  ['Mission', 'mission'], ['Teams', 'teams'], ['Projects', 'projects'], ['Network', 'network'],
] as const;

export const teams = [
  {
    number: '01', name: 'Media Team', short: 'Media', leader: 'Nathaniel', color: 'lime',
    headline: 'Make people stop. And think.',
    description: 'Tell the transit story through content that gets students talking.',
    detail: 'Turn complex transit topics into clear, engaging stories. Bring your creativity to our social channels and help the community see what OnTrackYVR is working on.',
    tags: ['Create', 'Capture', 'Connect'],
    activities: ['Create Instagram and TikTok updates, reels, and interviews', 'Produce the OnTrackYVR club trailer', 'Explain route changes, SkyTrain updates, and infrastructure news', 'Capture student experiences and ideas'],
  },
  {
    number: '02', name: 'Policy & Research', short: 'Research', leader: 'Elijah', color: 'forest',
    headline: 'Ask better questions. Find better routes.',
    description: 'Turn everyday transit problems into research and real proposals.',
    detail: 'Explore urban planning, listen to student riders, and turn what you learn into practical recommendations for a more reliable and sustainable transit network.',
    tags: ['Question', 'Research', 'Advocate'],
    activities: ['Survey students about overcrowding and route concerns', 'Draft letters to TransLink and the City of Burnaby', 'Create clear, useful transit guides', 'Develop transit-improvement proposals and explore electrification'],
  },
  {
    number: '03', name: 'Leadership Outreach', short: 'Outreach', leader: '@Angle', color: 'stone',
    headline: 'A little guidance. A world of confidence.',
    description: 'Help the next generation of riders feel ready for their first trip.',
    detail: 'Make transit less intimidating for younger students preparing to enter secondary school. Build friendly, practical lessons that turn first-time riders into confident commuters.',
    tags: ['Teach', 'Inspire', 'Empower'],
    activities: ['Teach bus and SkyTrain basics, maps, and Compass Cards', 'Explain trip planning and transfers', 'Build lessons around transit etiquette and safety', 'Create slides, activities, and interactive transit quizzes'],
  },
] as const;

export const projects = [
  { number: '01', team: 'POLICY & RESEARCH', name: 'Student transit advocacy', description: 'We’re collecting student feedback about overcrowded buses and inefficient routes, creating practical transit guides, and preparing organized proposals for decision-makers.', tags: ['Student surveys', 'Urban planning', 'Transit guides'] },
  { number: '02', team: 'MEDIA TEAM', name: 'The OnTrackYVR trailer', description: 'A look behind the scenes at the people, ideas, and work driving our new era. The club trailer gives students a space to share their perspectives and introduces our mission to the school.', tags: ['Filmmaking', 'Student stories', 'Club trailer'] },
  { number: '03', team: 'LEADERSHIP OUTREACH', name: 'First trips. Big confidence.', description: 'Grade 7 transit lessons that make trip planning, transit maps, Compass Cards, transfers, and safe travel easier to understand before the move to secondary school.', tags: ['Grade 7 lessons', 'Transit safety', 'Trip planning'] },
  { number: '04', team: 'MEDIA TEAM', name: 'Transit, in the loop', description: 'Quick, clear transit update reels covering news, route changes, SkyTrain developments, and infrastructure so students can keep up with a changing region.', tags: ['Reels', 'Route updates', 'Infrastructure'] },
  { number: '05', team: 'POLICY & RESEARCH', name: 'A cleaner way forward', description: 'Exploring sustainable mobility and transit electrification, raising awareness, and connecting cleaner transportation with the everyday needs of our community.', tags: ['Electrification', 'Sustainability', 'Community'] },
  { number: '06', team: 'MEDIA TEAM', name: 'Your commute. Your voice.', description: 'Student interviews that put everyday transit experiences at the centre of the conversation. The missed connections, crowded buses, and good ideas all have a place here.', tags: ['Interviews', 'Experiences', 'Ideas'] },
] as const;

export const network = [
  { number: '01', name: 'Movement YVR', type: 'COMMUNITY PARTNERSHIP', status: 'Partnership secured', state: 'secured', description: 'Partnering with Vancouver-based transit advocates to give student voices a wider reach.' },
  { number: '02', name: 'TransLink', type: 'REGIONAL DIALOGUE', status: 'Connection in progress', state: 'progress', description: 'Working toward a more formal connection and exploring opportunities for future collaboration.' },
  { number: '03', name: 'NORTH NOW', type: 'SCHOOL COLLABORATION', status: 'Collaboration planned', state: 'planned', description: 'Preparing a collaborative Club Day reel with Burnaby North’s official media club.' },
] as const;

export const executives = [
  { name: 'Mario Miao', initials: 'MM', role: 'President', description: 'Metro Vancouver transit knowledge, routes, and sustainable transportation.', color: 'lime', photo: { src: '/photos/executives/mario-miao-cutout.webp' } },
  { name: 'Aaron Shan', initials: 'AS', role: 'Head President', description: 'Relationships, collaborations, communications, and our broader direction.', color: 'forest', photo: { src: '/photos/executives/aaron-shan-cutout.webp' } },
  { name: 'Cayden Pan', initials: 'CP', role: 'Vice President', description: 'Club leadership, community initiatives, and our continued growth.', color: 'stone', photo: { src: '/photos/executives/cayden-pan-cutout.webp' } },
  { name: 'Kevin Bae', initials: 'KB', role: 'Secretary', description: 'Club records, meeting notes, and keeping our work organized.', color: 'lime', photo: null },
  { name: 'Chloe Yuet', initials: 'CY', role: 'Social Media', description: 'Sharing club updates, student stories, and our progress online.', color: 'forest', photo: { src: '/photos/executives/chloe-yuet-cutout.webp' } },
] as const;

export const INSTAGRAM = 'https://www.instagram.com/ontrackyvr_';
export const DISCORD = 'https://discord.gg/v8nW53mk2T';
export const EMAIL = 'ontrackyvr@gmail.com';
export const TRANSIT_SOURCE = 'https://www.translink.ca/plans-and-projects/strategies-plans-and-guidelines/managing-the-transit-network';
