export default function Head() {
  return (
    <>
      <title>Urantia Book Podcast</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="Listen to AI-generated summaries of the Urantia Book papers while reading along" />
      <link rel="icon" href="/logo.png" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://urantiabookpod.com/" />
      <meta property="og:title" content="Urantia Book Podcast" />
      <meta property="og:description" content="AI-generated summaries of the Urantia Book papers, created by The Center for Unity" />
      <meta property="og:image" content="https://urantiabookpod.com/og-image.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://urantiabookpod.com/" />
      <meta property="twitter:title" content="Urantia Book Tutor" />
      <meta property="twitter:description" content="AI-generated summaries of the Urantia Book papers, created by The Center for Unity" />
      <meta property="twitter:image" content="https://urantiabookpod.com/og-image.png" />
    </>
  )
}