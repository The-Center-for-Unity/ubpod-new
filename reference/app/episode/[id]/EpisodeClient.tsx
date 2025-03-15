'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { episodes } from '../../data/episodes';
import ContactForm from '../../components/ContactForm';
import { track } from '@vercel/analytics';

type Props = {
  params: { id: string }
};

// Define the DiscoverJesus links
const discoverJesusLinks: {
    [key: number]: { title: string; url: string }[]
  } = {
    120: [
      { title: "Jesus' Bestowal Mission", url: "https://discoverjesus.com/topic/jesus-bestowal-mission" },
      { title: "Jesus Christ – Our Creator Son", url: "https://discoverjesus.com/topic/jesus-christ-our-creator-son" },
      { title: "Did Jesus Marry Anyone?", url: "https://discoverjesus.com/topic/did-jesus-marry-anyone" }
    ],
    121: [
      { title: "The Western World in the First Century", url: "https://discoverjesus.com/topic/the-western-world-in-the-first-century" },
      { title: "Concepts of the Expected Messiah", url: "https://discoverjesus.com/topic/concepts-of-the-expected-messiah" }
    ],
    122: [
      { title: "Gabriel's Announcement to Mary", url: "https://discoverjesus.com/event/gabriels-announcement-to-mary" },
      { title: "Birth and Infancy of Jesus", url: "https://discoverjesus.com/event/birth-and-infancy-of-jesus" },
      { title: "Three Wise Men", url: "https://discoverjesus.com/group/three-wise-men" }
    ],
    123: [
      { title: "Jesus' Early Education", url: "https://discoverjesus.com/topic/jesus-early-education" },
      { title: "Jesus' Fourth Year", url: "https://discoverjesus.com/event/jesus-fourth-year" },
      { title: "Jesus' Life in Nazareth – Age 6", url: "https://discoverjesus.com/event/jesus-life-in-nazareth-age-6" }
    ],
    124: [
        { title: "Jesus' Tenth Year", url: "https://discoverjesus.com/event/jesus-tenth-year" },
        { title: "Jesus' Eleventh Year", url: "https://discoverjesus.com/event/jesus-eleventh-year" },
        { title: "Jesus' Twelfth Year", url: "https://discoverjesus.com/event/jesus-twelfth-year" }
      ],
    125: [
    { title: "Jesus' First Passover – Age 13", url: "https://discoverjesus.com/event/jesus-first-passover-age-13" },
    { title: "Joseph", url: "https://discoverjesus.com/person/joseph-father-of-jesus" },
    { title: "Mary", url: "https://discoverjesus.com/person/mary-mother-of-jesus" }
    ],
    126: [
      { title: "Jesus' Fourteenth Year", url: "https://discoverjesus.com/event/jesus-fourteenth-year" },
      { title: "Death of Joseph", url: "https://discoverjesus.com/event/death-of-joseph" },
      { title: "Jesus' Fifteenth Year", url: "https://discoverjesus.com/event/jesus-fifteenth-year" }
      ],
    127: [
      { title: "Jesus' Sixteenth Year", url: "https://discoverjesus.com/event/jesus-sixteenth-year" },
      { title: "Jesus' Seventeenth Year", url: "https://discoverjesus.com/event/jesus-seventeenth-year" },
      { title: "Jesus' Eighteenth Year", url: "https://discoverjesus.com/event/jesus-eighteenth-year" }
      ],
    128: [
      { title: "Jesus' Twenty-First Year", url: "https://discoverjesus.com/event/jesus-twenty-first-year" },
      { title: "Jesus' Twenty-Second Year", url: "https://discoverjesus.com/event/jesus-twenty-second-year-new-job-in-sepphoris" },
      { title: "Jesus’ Twenty-Fourth Year", url: "https://discoverjesus.com/event/jesus-twenty-fourth-year" }
      ],
    129: [
      { title: "Zebedee Hires Jesus in His Boatbuilding Shop", url: "https://discoverjesus.com/event/zebedee-hires-jesus-in-his-boatbuilding-shop" },
      { title: "Zebedee's Family", url: "https://discoverjesus.com/group/zebedees-family" },
      { title: "Jesus' Combined Nature – Human and Divine", url: "https://discoverjesus.com/topic/jesus-combined-nature-human-and-divine" }
      ],
    130: [
      { title: "Jesus' Tour of the Mediterranean World", url: "https://discoverjesus.com/topic/jesus-tour-of-the-mediterranean-world" },
      { title: "Good and Evil", url: "https://discoverjesus.com/topic/good-and-evil" },
      { title: "Jesus Delivers a Discourse on Reality", url: "https://discoverjesus.com/event/jesus-delivers-a-discourse-on-reality" }
      ],
    131: [
      { title: "Religion – Buddhism", url: "https://discoverjesus.com/topic/religion-buddhism" },
      { title: "Personal Religion of Jesus", url: "https://discoverjesus.com/topic/personal-religion-of-jesus" },
      { title: "Anger – The Lack of Understanding", url: "https://discoverjesus.com/topic/anger-the-lack-of-understanding" }
      ],
    132: [
      { title: "Jesus Counsels the Rich Man", url: "https://discoverjesus.com/event/jesus-counsels-the-rich-man" },
      { title: "Jesus' Sojourn at Rome", url: "https://discoverjesus.com/event/jesus-sojourn-at-rome" },
      { title: "True Values", url: "https://discoverjesus.com/topic/true-values" }
      ],
    133: [
      { title: "Jesus Delivers a Discourse on the Soul", url: "https://discoverjesus.com/event/jesus-delivers-a-discourse-on-the-soul" },
      { title: "How Did Jesus Treat Women?", url: "https://discoverjesus.com/topic/how-did-jesus-treat-women" },
      { title: "Loving God Instead of Fearing God", url: "https://discoverjesus.com/topic/loving-god-instead-of-fearing-god" }
      ],
    134: [
      { title: "Jesus Delivers the Urmia Lectures", url: "https://discoverjesus.com/event/jesus-delivers-the-urmia-lectures" },
      { title: "Jesus' Year of Solitary Wanderings", url: "https://discoverjesus.com/event/jesus-year-of-solitary-wanderings" },
      { title: "Jesus' Final Period of Waiting", url: "https://discoverjesus.com/event/jesus-final-period-of-waiting" }
      ],
    135: [
      { title: "Birth of John the Baptist", url: "https://discoverjesus.com/event/birth-of-john-the-baptist" },
      { title: "Baptism of Jesus in the Jordan", url: "https://discoverjesus.com/event/baptism-of-jesus-in-the-jordan" },
      { title: "Forty Days in the Wilderness", url: "https://discoverjesus.com/event/forty-days-in-the-wilderness" }
      ],
    136: [
      { title: "Concepts of the Expected Messiah", url: "https://discoverjesus.com/topic/concepts-of-the-expected-messiah" },
      { title: "Jesus Destroys all of his writings", url: "https://discoverjesus.com/event/jesus-destroys-all-of-his-writings" },
      { title: "Rebellion – Lucifer, Satan, and Caligastia", url: "https://discoverjesus.com/topic/rebellion-lucifer-satan-and-caligastia" }
      ],
    137: [
      { title: "Jesus Chooses Andrew and Simon as Apostles", url: "https://discoverjesus.com/event/jesus-chooses-andrew-and-simon-as-apostles" },
      { title: "Choosing Phillip and Nathaniel as Apostles", url: "https://discoverjesus.com/event/choosing-philip-and-nathaniel-as-apostles" },
      { title: "Jesus Attends a Wedding at Cana", url: "https://discoverjesus.com/event/jesus-attends-a-wedding-at-cana" }
      ],
    138: [
      { title: "The Final Six Apostles are Chosen", url: "https://discoverjesus.com/event/the-final-six-apostles-are-chosen" },
      { title: "Training the Kingdom's Messengers", url: "https://discoverjesus.com/topic/training-the-kingdoms-messengers" },
      { title: "Organization of the Twelve Apostles", url: "https://discoverjesus.com/event/organization-of-the-twelve-apostles" }
      ],
    139: [
      { title: "The Twelve Apostles", url: "https://discoverjesus.com/group/the-twelve-apostles" },
      { title: "Self-Mastery – Be You Perfect", url: "https://discoverjesus.com/topic/self-mastery-be-you-perfect" },
      { title: "Overview of Jesus' Teachings", url: "https://discoverjesus.com/topic/overview-of-jesus-teachings" }
      ],
    140: [
      { title: "Jesus Ordains His Twelve Apostles", url: "https://discoverjesus.com/event/jesus-ordains-his-twelve-apostles" },
      { title: "Analysis of the Ordination Sermon", url: "https://discoverjesus.com/event/analysis-of-the-ordination-sermon" },
      { title: "Fruits of the Spirit", url: "https://discoverjesus.com/topic/fruits-of-the-spirit" }
      ],
    141: [
      { title: "Beginning the Public Work", url: "https://discoverjesus.com/event/beginning-the-public-work" },
      { title: "Did Jesus Ever Feel Sad?", url: "https://discoverjesus.com/topic/did-jesus-ever-feel-sad" },
      { title: "Why Do We Suffer from Affliction?", url: "https://discoverjesus.com/topic/why-do-we-suffer-from-affliction" }
      ],
    142: [
      { title: "The Visit with Jacob about God's Wrath", url: "https://discoverjesus.com/event/the-visit-with-jacob-about-gods-wrath" },
      { title: "The Visit with Nicodemus", url: "https://discoverjesus.com/event/the-visit-with-nicodemus" }
      ],
    143: [
      { title: "Jesus' Discourse on Self-Mastery", url: "https://discoverjesus.com/event/jesus-discourse-on-self-mastery" },
      { title: "Jesus and the Apostles Take a 3-Day Vacation", url: "https://discoverjesus.com/event/jesus-and-the-apostles-take-a-3-day-vacation" },
      { title: "Jesus Meets Nalda - the Women at the Well", url: "https://discoverjesus.com/event/jesus-meets-nalda-the-woman-at-the-well" }
      ],
    144: [
      { title: "Jesus and the Twelve Retire for Two Months", url: "https://discoverjesus.com/event/jesus-and-the-twelve-retire-for-two-months" },
      { title: "Worship and Prayer", url: "https://discoverjesus.com/topic/worship-and-prayer" },
      { title: "Jesus Introduces the Lord's Prayer to the Apostles", url: "https://discoverjesus.com/event/jesus-introduces-the-lords-prayer-to-the-apostles" }
      ],
    145: [
      { title: "The Draught of Fishes", url: "https://discoverjesus.com/event/the-draught-of-fishes" },
      { title: "The Healing at Sundown", url: "https://discoverjesus.com/event/the-healing-at-sundown" },
      { title: "Why Do We Suffer from Affliction?", url: "https://discoverjesus.com/topic/why-do-we-suffer-from-affliction" }
      ],
    146: [
        { title: "First Preaching Tour of Galilee", url: "https://discoverjesus.com/event/first-preaching-tour-of-galilee" },
        { title: "Discourse About Spirits of the Dead", url: "https://discoverjesus.com/event/discourse-about-spirits-of-the-dead" },
        { title: "Healing the Son of Titus", url: "https://discoverjesus.com/event/healing-the-son-of-titus" }
        ],
    147: [
      { title: "Jesus' Discourse About the Rule of Living", url: "https://discoverjesus.com/event/jesus-discourse-about-the-rule-of-living" },
      { title: "Six Jerusalem Spies", url: "https://discoverjesus.com/group/six-jerusalem-spies" },
      { title: "Visiting Simon the Pharisee", url: "https://discoverjesus.com/event/visiting-simon-the-pharisee" }
      ],
    148: [
      { title: "Discourse on Job – Misunderstanding Suffering", url: "https://discoverjesus.com/event/discourse-on-job-misunderstanding-suffering" },
      { title: "Establishing The Kingdom's First Hospital", url: "https://discoverjesus.com/event/establishing-the-kingdoms-first-hospital" },
      { title: "Jesus Discusses the Purpose of Affliction", url: "https://discoverjesus.com/event/jesus-discusses-the-purpose-of-affliction" }
      ],
    149: [
      { title: "What Teaching Methods Did Jesus Use?", url: "https://discoverjesus.com/topic/what-teaching-methods-did-jesus-use" },
      { title: "The Second Preaching Tour", url: "https://discoverjesus.com/event/the-second-preaching-tour" },
      { title: "Why Are Some People Happier than Others?", url: "https://discoverjesus.com/topic/why-are-some-people-happier-than-others" }
      ],
    150: [
      { title: "The Third Preaching Tour", url: "https://discoverjesus.com/event/the-third-preaching-tour" },
      { title: "Women's Evangelistic Corps", url: "https://discoverjesus.com/group/womens-evangelistic-corps" },
      { title: "Jesus' Discourse about Magic and Superstition", url: "https://discoverjesus.com/event/jesus-discourse-about-magic-and-superstition" }
      ],
    151: [
      { title: "Jesus' Parables on the Kingdom of Heaven", url: "https://discoverjesus.com/event/jesus-parables-on-the-kingdom-of-heaven" },
      { title: "Jesus Discusses the Benefits of Using Parables", url: "https://discoverjesus.com/event/jesus-discusses-the-benefits-of-using-parables" },
      { title: "Jesus Teaches the Parable of the Sower", url: "https://discoverjesus.com/event/jesus-teaches-the-parable-of-the-sower" }
      ],
    152: [
      { title: "The King-Making Episode", url: "https://discoverjesus.com/event/the-king-making-episode" },
      { title: "Jesus Feeds the Five Thousand", url: "https://discoverjesus.com/event/jesus-feeds-the-five-thousand" },
      { title: "Jesus Awakens Girl in Coma", url: "https://discoverjesus.com/event/jesus-awakens-girl-in-coma" }
      ],
    153: [
      { title: "The Epochal Sermon", url: "https://discoverjesus.com/event/the-epochal-sermon" },
      { title: "Six Jerusalem Spies", url: "https://discoverjesus.com/group/six-jerusalem-spies" }
      ],
    154: [
      { title: "Synagogues of Palestine are Closed to Jesus", url: "https://discoverjesus.com/event/synagogues-of-palestine-are-closed-to-jesus" },
      { title: "Jesus Departs in Haste", url: "https://discoverjesus.com/event/jesus-departs-in-haste" }
      ],
    155: [
      { title: "Jesus' Discourse on True Religion", url: "https://discoverjesus.com/event/jesus-discourse-on-true-religion" },
      { title: "Fleeing Through Northern Galilee", url: "https://discoverjesus.com/event/fleeing-through-northern-galilee" },
      { title: "Jesus' Discourse on Religion of the Spirit", url: "https://discoverjesus.com/event/jesus-discourse-on-religion-of-the-spirit" }
      ],
    156: [
      { title: "Jesus' Teaching at Tyre", url: "https://discoverjesus.com/event/jesus-teaching-at-tyre" },
      { title: "Jesus and the Twenty-Four Teach in Sidon", url: "https://discoverjesus.com/event/jesus-and-the-twenty-four-teach-in-sidon" },
      { title: "Jesus Heals the Daughter of Norana", url: "https://discoverjesus.com/event/jesus-heals-the-daughter-of-norana" }
      ],
    157: [
      { title: "Peter's Confession", url: "https://discoverjesus.com/event/peters-confession" },
      { title: "Concepts of the Expected Messiah", url: "https://discoverjesus.com/topic/concepts-of-the-expected-messiah" }
      ],
    158: [
      { title: "The Transfiguration", url: "https://discoverjesus.com/event/the-transfiguration" },
      { title: "Healing the Boy with Double Affliction", url: "https://discoverjesus.com/event/healing-the-boy-with-double-affliction" }
      ],
    159: [
      { title: "Lessons from the Decapolis Tour", url: "https://discoverjesus.com/event/lessons-from-the-decapolis-tour" },
      { title: "What Teaching Methods Did Jesus Use?", url: "https://discoverjesus.com/topic/what-teaching-methods-did-jesus-use" }
      ],
    160: [
      { title: "Nathaniel and Thomas' Discussion with Rodan", url: "https://discoverjesus.com/event/nathaniel-and-thomas-discussion-with-rodan" },
      { title: "Philosophy – Rodan of Alexandria", url: "https://discoverjesus.com/topic/philosophy-rodan-of-alexandria" },
      { title: "Balance and Lures of Maturity", url: "https://discoverjesus.com/topic/balance-and-lures-of-maturity" }
      ],
    161: [
      { title: "Nathaniel and Thomas' Discussion with Rodan", url: "https://discoverjesus.com/event/nathaniel-and-thomas-discussion-with-rodan" },
      { title: "Philosophy – Rodan of Alexandria", url: "https://discoverjesus.com/topic/philosophy-rodan-of-alexandria" },
      { title: "Jesus' Combined Nature – Human and Divine", url: "https://discoverjesus.com/topic/jesus-combined-nature-human-and-divine" }
      ],
    162: [
      { title: "Jesus' Public Declaration of Divinity Brings Danger", url: "https://discoverjesus.com/event/jesus-public-declaration-of-divinity-brings-danger" },
      { title: "The Woman Taken in Adultery", url: "https://discoverjesus.com/event/the-woman-taken-in-adultery" },
      { title: "First Temple Talk", url: "https://discoverjesus.com/event/first-temple-talk" }
      ],
    163: [
      { title: "Ordination of the Seventy", url: "https://discoverjesus.com/event/ordination-of-the-seventy" },
      { title: "Jesus Counsels the Rich Man", url: "https://discoverjesus.com/event/jesus-counsels-the-rich-man" },
      { title: "What Did Jesus Say about Wealth?", url: "https://discoverjesus.com/topic/what-did-jesus-say-about-wealth" }
      ],
    164: [
      { title: "Jesus Tells the Story of the Good Samaritan", url: "https://discoverjesus.com/event/jesus-tells-the-story-of-the-good-samaritan" },
      { title: "Jesus Heals Josiah – the Blind Beggar", url: "https://discoverjesus.com/event/jesus-heals-josiah-the-blind-beggar" },
      { title: "Sanhedrin", url: "https://discoverjesus.com/group/sanhedrin" }
      ],
                                                                                                                                                                                                                                                                                                                  
  };
  
export default function EpisodeClient({ params }: Props) {
  const episodeId = parseInt(params.id);
  const episode = episodes.find(ep => ep.id === episodeId);
  const [audioExists, setAudioExists] = useState<boolean | null>(null);
  const [transcriptExists, setTranscriptExists] = useState<boolean | null>(null);
  const [sourceExists, setSourceExists] = useState<boolean | null>(null);
  const [analysisExists, setAnalysisExists] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playDuration, setPlayDuration] = useState(0);

  const getFileName = (id: number, type: 'transcript' | 'analysis') => {
    if (id === 0) return `foreword-${type}.pdf`;
    return `paper-${id}-${type}.pdf`;
  };

  useEffect(() => {
    if (episode) {
      // Check audio
      if (episode.audioUrl) {
        fetch(episode.audioUrl, { method: 'HEAD' })
          .then(response => setAudioExists(response.ok))
          .catch(() => setAudioExists(false));
      } else {
        setAudioExists(false);
      }

      // Check source material
      if (episode.pdfUrl) {
        fetch(episode.pdfUrl, { method: 'HEAD' })
          .then(response => setSourceExists(response.ok))
          .catch(() => setSourceExists(false));
      } else {
        setSourceExists(false);
      }

      // Check analysis if needed
      if (episode.id) {
        const analysisPath = `/analysis/${getFileName(episode.id, 'analysis')}`;
        fetch(analysisPath, { method: 'HEAD' })
          .then(response => setAnalysisExists(response.ok))
          .catch(() => setAnalysisExists(false));
      }

      // Check transcript
      const transcriptPath = `/transcripts/${getFileName(episode.id, 'transcript')}`;
      fetch(transcriptPath, { method: 'HEAD' })
        .then(response => setTranscriptExists(response.ok))
        .catch(() => setTranscriptExists(false));
    }
  }, [episode]);

  useEffect(() => {
    const audio = audioRef.current;
    console.log('Audio effect running', { audio, episode }); // Debug log

    if (audio && episode) {
      console.log('Setting up event listeners'); // Debug log

      const handlePlay = () => {
        console.log('Play event triggered'); // Debug log
        const eventData = { episodeId: episode.id, title: episode.title };
        track('Audio Play', eventData);
        console.log('Audio Play:', eventData);
        setPlayDuration(0);
      };

      const handlePause = () => {
        console.log('Pause event triggered'); // Debug log
        const eventData = { 
          episodeId: episode.id, 
          title: episode.title,
          duration: Math.round(playDuration)
        };
        track('Audio Pause', eventData);
        console.log('Audio Pause:', eventData);
      };

      const handleEnded = () => {
        console.log('End event triggered'); // Debug log
        const eventData = { 
          episodeId: episode.id, 
          title: episode.title,
          duration: Math.round(audio.duration)
        };
        track('Audio Ended', eventData);
        console.log('Audio Ended:', eventData);
      };

      // Try both ways of adding event listeners
      audio.addEventListener('play', handlePlay);
      audio.onplay = handlePlay;  // Alternative method

      audio.addEventListener('pause', handlePause);
      audio.onpause = handlePause;  // Alternative method

      audio.addEventListener('ended', handleEnded);
      audio.onended = handleEnded;  // Alternative method

      const updatePlayDuration = () => {
        setPlayDuration(prev => prev + 1);
      };

      const intervalId = setInterval(updatePlayDuration, 1000);

      // Debug log when cleanup runs
      return () => {
        console.log('Cleaning up event listeners');
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        clearInterval(intervalId);
      };
    }
  }, [episode, playDuration]);

  if (!episode) {
    return <div className="container mx-auto p-4 font-pt-serif">Episode not found</div>;
  }

  const prevEpisode = episodes.find(ep => ep.id === episodeId - 1);
  const nextEpisode = episodes.find(ep => ep.id === episodeId + 1);
  const showDiscoverJesusLinks = episodeId >= 120 && episodeId <= 196;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{episode.title}</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Controls and Downloads */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Player */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              {audioExists !== null && (
                audioExists ? (
                  <audio 
                    ref={audioRef}
                    controls 
                    className="w-full" 
                    src={episode.audioUrl}
                    onPlay={() => console.log('Direct onPlay event')}
                    onPause={() => console.log('Direct onPause event')}
                  ></audio>
                ) : (
                  <p className="text-gray-500 font-medium">Audio coming soon...</p>
                )
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              {prevEpisode && (
                <Link 
                  href={`/episode/${prevEpisode.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </Link>
              )}
              {nextEpisode && (
                <Link 
                  href={`/episode/${nextEpisode.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Downloads Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Downloads</h2>
              <div className="space-y-3">
                {transcriptExists !== null && (
                  transcriptExists ? (
                    <a 
                      href={`/transcripts/${getFileName(episode.id, 'transcript')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-sky-50 rounded-lg transition-colors group"
                    >
                      <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="flex-1 text-gray-700 group-hover:text-gray-900">Download Podcast Transcript</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-gray-500 font-medium">Transcript coming soon...</p>
                  )
                )}
                
                {sourceExists !== null && (
                  sourceExists ? (
                    <a 
                      href={episode.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-sky-50 rounded-lg transition-colors group"
                    >
                      <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="flex-1 text-gray-700 group-hover:text-gray-900">Download Source Material (Urantia Paper)</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-gray-500 font-medium">Source Material coming soon...</p>
                  )
                )}

                {analysisExists !== null && (
                  analysisExists ? (
                    <a 
                      href={`/analysis/${getFileName(episode.id, 'analysis')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-sky-50 rounded-lg transition-colors group"
                    >
                      <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="flex-1 text-gray-700 group-hover:text-gray-900">Download Episode Analysis</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-gray-500 font-medium">Episode Analysis coming soon...</p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column - PDF Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <span className="font-medium text-gray-700">The Urantia Book</span>
                <div className="flex items-center gap-3">
                  <a 
                    href={episode.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="aspect-[4/3] bg-gray-100">
                <object
                  data={episode.pdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                >
                  <p>Your browser doesn't support embedded PDFs. You can <a href={episode.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">download the PDF</a> to view it.</p>
                </object>
              </div>
            </div>
          </div>
        </div>

        {/* Learn More Section - Moved above Contact Form */}
        <div className="mt-12 mb-12">
          {discoverJesusLinks[episode.id] && (
            <>
              <h2 className="text-xl font-fira-sans font-bold text-primary mb-4">Learn More</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-fira-sans text-gray-700 mb-3">Related Content on Discover Jesus:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {discoverJesusLinks[episode.id].map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-gray-900">{link.title}</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Contact Form */}
        <div className="mt-12">
          <ContactForm />
        </div>
      </main>
    </div>
  );
}
