export type Episode = {
  id: number;
  title: string;
  description?: string;
  audioUrl: string;
  pdfUrl?: string;
  series: 'urantia-papers' | 'sadler-workbooks' | 'discover-jesus' | 'history';
  sourceUrl?: string;
  imageUrl?: string;  // Add this for the thumbnail
};
