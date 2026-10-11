import type { Metadata } from 'next';
import './globals.css';
import './refinements.css';
import './polish.css';

export const metadata: Metadata = {
  title: 'OnTrackYVR — A New Era for Student Transit Advocacy',
  description: 'Moving ideas. Moving people. OnTrackYVR is a student-led transit advocacy group at Burnaby North Secondary. Find your path in media, policy, research, and outreach.',
  metadataBase: new URL('https://ontrackyvr-north.fakeshxp3.chatgpt.site'),
  icons: { icon: { url: '/images/ontrackyvr-logo.jpg', type: 'image/jpeg' }, apple: '/images/ontrackyvr-logo.jpg' },
  openGraph: { title: 'OnTrackYVR — Moving ideas. Moving people.', description: 'Student-led. Transit-focused. Future-bound. A new era at Burnaby North Secondary.', type: 'website', locale: 'en_CA' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-CA"><body>{children}</body></html>;
}
