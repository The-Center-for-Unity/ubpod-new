import { Metadata } from 'next';
import { getHistoryEpisodes } from '../../data/episodes';
import EpisodeClient from './EpisodeClient';

type Props = {
  params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const episode = getHistoryEpisodes().find(ep => ep.id === parseInt(params.id));
  
  return {
    title: episode ? `${episode.title} - History of the Urantia Papers` : 'Episode Not Found',
    description: episode?.description || 'Learn about the fascinating history behind the Urantia Papers',
  };
}

export default function HistoryEpisodePage({ params }: Props) {
  return <EpisodeClient params={params} />;
} 