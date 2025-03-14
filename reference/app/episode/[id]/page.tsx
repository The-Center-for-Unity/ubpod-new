import { Metadata } from 'next';
import { episodes } from '../../data/episodes';
import EpisodeClient from './EpisodeClient';

type Props = {
  params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const episodeId = parseInt(params.id);
  const episode = episodes.find(ep => ep.id === episodeId);

  return {
    title: episode ? `${episode.title} | Urantia Book Podcast` : 'Episode Not Found | Urantia Book Podcast',
  };
}

export default function EpisodePage({ params }: Props) {
  return <EpisodeClient params={params} />;
}