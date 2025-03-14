// Similar to your existing episode page but for Sadler Workbooks

import { Metadata } from 'next';
import { getSadlerWorkbooks } from '../../data/episodes';
import EpisodeClient from './EpisodeClient';

type Props = {
  params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const episodeId = parseInt(params.id);
  const episode = getSadlerWorkbooks().find(ep => ep.id === episodeId);

  if (!episode) {
    return {
      title: 'Episode Not Found | Urantia Book Podcast',
      description: 'The requested episode could not be found.'
    };
  }

  return {
    title: `${episode.title} | Dr. Sadler's Workbooks | Urantia Book Podcast`,
    description: `Listen to Dr. Sadler's workbook study on ${episode.title}`,
  };
}

export default function EpisodePage({ params }: Props) {
  return <EpisodeClient params={params} />;
}
