import { Metadata } from 'next';
import { getDiscoverJesusEpisodes } from '../../data/episodes';
import EpisodeClient from './EpisodeClient';

type Props = {
  params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const episodeId = parseInt(params.id);
  const episode = getDiscoverJesusEpisodes().find(ep => ep.id === episodeId);

  if (!episode) {
    return {
      title: 'Episode Not Found | Urantia Book Podcast',
      description: 'The requested episode could not be found.'
    };
  }

  return {
    title: `${episode.title} | Discover Jesus | Urantia Book Podcast`,
    description: `Listen to this episode about ${episode.title}`,
  };
}

export default function EpisodePage({ params }: Props) {
  return <EpisodeClient params={params} />;
} 