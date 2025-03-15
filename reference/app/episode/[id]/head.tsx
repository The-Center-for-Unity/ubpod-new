import { episodes } from '../../data/episodes';

export default function Head({ params }: { params: { id: string } }) {
  const episode = episodes.find(ep => ep.id === parseInt(params.id));
  const title = episode ? `${episode.title} | Urantia Book Podcast` : 'Urantia Book Podcast';
  const description = episode ? `Listen to an AI-generated summary of ${episode.title} from the Urantia Book` : 'Listen to AI-generated summaries of the Urantia Book papers';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {/* ... other meta tags ... */}
    </>
  )
}
