import { Episode, SeriesType } from '../types/index';
import { 
  getSeriesInfo, 
  getEpisodeTitle, 
  getEpisodeAudioPath
} from './seriesUtils';
import { getAudioUrl, getPdfUrl } from '../config/audio';
import { discoverJesusSummaries } from '../data/discoverJesusSummaries';

// Episode titles from the Series Organization markdown file
const seriesEpisodeTitles: Record<string, string[]> = {
  // Jesus-focused series (Series 1-14)
  'jesus-1': [
    "The Personality of God",
    "Loving God Instead of Fearing God",
    "Growth of the God Concept",
    "Divine Forgiveness",
    "Faith and Righteousness"
  ],
  'jesus-2': [
    "Sojourn in Alexandria",
    "Jesus' Tour of the Mediterranean World",
    "Jesus' Combined Nature",
    "Star of Bethlehem",
    "Jesus Harp"
  ],
  'jesus-3': [
    "Indwelling Spirit of God",
    "Spirit of Truth – The Comforter",
    "Jesus Personalized Indwelling Spirit",
    "Personal Religion of Jesus",
    "Sonship with God"
  ],
  'jesus-4': [
    "What Happens When We Die",
    "What Is the Soul",
    "Jesus' Resurrection Experience",
    "Jesus' Resurrected Morontia Body",
    "The Resurrection of Jesus"
  ],
  'jesus-5': [
    "Jesus Establishes the Women's Corps",
    "Women's Evangelistic Corps",
    "Mary Magdalene",
    "How Did Jesus Treat Women",
    "Mary - mother of Jesus"
  ],
  'jesus-6': [
    "Good and Evil",
    "Why Are We Confronted With Unfair Life Situations",
    "Why Do We Suffer from Affliction",
    "Accidents and Divine Intervention",
    "Anger – The Lack of Understanding"
  ],
  'jesus-7': [
    "Worship and Prayer",
    "Divine Forgiveness",
    "Jesus' Discourse on True Religion",
    "Personal Religion of Jesus",
    "Acme of Religious Living"
  ],
  'jesus-8': [
    "Angels – the Daughters of God",
    "Jesus - Celestial Visitations",
    "Gabriel",
    "Satan",
    "Machiventa Melchizedek"
  ],
  'jesus-9': [
    "The Kingdom of Heaven",
    "Overview of Jesus Teachings",
    "Jesus Personal Ministry as He Passed By",
    "Training the Kingdom's Messengers",
    "Profound Quotes to Live By"
  ],
  'jesus-10': [
    "Baptism of Jesus in the Jordan",
    "Jesus Feeds the Five Thousand",
    "The Transfiguration",
    "The Resurrection of Lazarus",
    "The Last Supper"
  ],
  'jesus-11': [
    "Art of Living",
    "Marriage, Divorce, and Children",
    "Balance and Lures of Maturity",
    "True Values",
    "Why Are Some People Happier than Others"
  ],
  'jesus-12': [
    "Betrayal and Arrest of Jesus",
    "Pilate's Last Appeal and Surrender",
    "Meaning of Jesus Death on the Cross",
    "The Two Thieves on the Cross",
    "Jesus' Post-Resurrection Appearances"
  ],
  'jesus-13': [
    "Evolution of the Atonement Doctrine",
    "Concepts of the Expected Messiah",
    "Mistakes of Jesus' Early Followers",
    "After Pentecost - Peter, Paul, and Christianity",
    "Was Jesus Really Born of a Virgin"
  ],
  'jesus-14': [
    "Hobbies and Interests Jesus Enjoyed",
    "Did Jesus Ever Feel Sad",
    "Did Jesus Marry Anyone",
    "Importance of the Early Home Life",
    "Jesus"
  ],
  
  // Parts I-III series (Series 15-28)
  'cosmic-1': [
    "The Universal Father",
    "The Universe of Universes",
    "The Sacred Spheres of Paradise",
    "The Seven Superuniverses",
    "Energy—Mind and Matter"
  ],
  'cosmic-2': [
    "The Eternal Son",
    "The Infinite Spirit",
    "The Paradise Trinity",
    "The Paradise Sons of God",
    "Ministering Spirits of Space"
  ],
  'cosmic-3': [
    "Origin and Nature of Thought Adjusters",
    "Mission and Ministry of Thought Adjusters",
    "Relation of Adjusters to Individual Mortals",
    "The Adjuster and the Soul",
    "Personality Survival"
  ],
  'cosmic-4': [
    "The Evolution of Local Universes",
    "Administration of the Local Universe",
    "The Local Universe Mother Spirit",
    "The Local Universe Sons of God",
    "Physical Aspects of the Local Universe"
  ],
  'cosmic-5': [
    "Ministering Spirits of the Local Universe",
    "The Seraphic Hosts",
    "Seraphic Guardians of Destiny",
    "Seraphic Planetary Government",
    "The Midway Creatures"
  ],
  'cosmic-6': [
    "The Ascending Sons of God",
    "The Seven Mansion Worlds",
    "The Morontia Life",
    "The Corps of the Finality",
    "Universal Unity"
  ],
  'cosmic-7': [
    "The Origin of Urantia",
    "Life Establishment on Urantia",
    "The Dawn Races of Early Man",
    "The Evolutionary Races of Color",
    "The Planetary Prince of Urantia"
  ],
  'cosmic-8': [
    "The Lucifer Rebellion",
    "Problems of the Lucifer Rebellion",
    "The Planetary Rebellion",
    "The Default of Adam and Eve",
    "The Caligastia Betrayal"
  ],
  'cosmic-9': [
    "The Garden of Eden",
    "Adam and Eve",
    "The Second Garden",
    "The Violet Race After the Days of Adam",
    "The Default of Adam and Eve"
  ],
  'cosmic-10': [
    "Machiventa Melchizedek",
    "The Melchizedek Teachings in the Orient",
    "The Melchizedek Teachings in the Levant",
    "Yahweh—God of the Hebrews",
    "The Melchizedek Teachings in the Occident"
  ],
  'cosmic-11': [
    "The Origins of Worship",
    "Early Evolution of Religion",
    "The Ghost Cults",
    "Sin, Sacrifice, and Atonement",
    "The Later Evolution of Religion"
  ],
  'cosmic-12': [
    "Religion in Human Experience",
    "The Real Nature of Religion",
    "The Foundations of Religious Faith",
    "The Reality of Religious Experience",
    "The Faith of Jesus"
  ],
  'cosmic-13': [
    "Deity and Reality",
    "Universe Levels of Reality",
    "The Supreme Being",
    "The Almighty Supreme",
    "God the Supreme"
  ],
  'cosmic-14': [
    "God's Relation to the Universe",
    "God's Relation to the Individual",
    "Relation of the Eternal Son to the Universe",
    "Relation of the Infinite Spirit to the Universe",
    "The Trinity Union of Deity"
  ]
};

// Episode loglines from the Episode Loglines markdown file
const seriesEpisodeLoglines: Record<string, string[]> = {
  // Jesus-focused series (Series 1-14)
  'jesus-1': [
    "God isn't an abstract force but a personality who seeks relationship—meet the Universal Father who knows you personally.",
    "Why divine justice is founded on love, not retribution—transforming your relationship with God from fear to family.",
    "From tribal deities to universal creator—how humanity's understanding of God evolved and what it reveals about spiritual growth.",
    "Forgiveness isn't earned through sacrifice but freely given by a Father who understands your imperfections better than you do.",
    "True righteousness comes not from rule-following but from faith connection—how genuine spirituality transcends religious compliance."
  ],
  'jesus-2': [
    "During his unrecorded youth, Jesus studied with the greatest minds in Alexandria—shaping a cosmic perspective no gospel ever mentioned.",
    "The untold two-year journey where Jesus traveled from Rome to the Caspian Sea, encountering diverse cultures and philosophies.",
    "How did divine wisdom and human experience coexist in one mind? Explore the mystery of Jesus' dual consciousness.",
    "The astronomical truth behind the legendary star—what really guided the wise men and why the conventional story misses the cosmic significance.",
    "His musicianship reveals the creative, artistic side of Jesus—the divine melody-maker whose harmony extended beyond the spiritual."
  ],
  'jesus-3': [
    "That inner voice guiding your highest thoughts isn't just conscience—it's an actual fragment of God living within your mind.",
    "What Jesus meant by the promised Comforter—a cosmic presence that guides you toward truth rather than religious conformity.",
    "Jesus demonstrated the ultimate connection with the divine within—revealing the potential relationship available to all.",
    "Beyond preaching to crowds, Jesus cultivated a profound personal connection with God—the intimate spiritual practice he rarely discussed.",
    "You aren't just a creation but a child of God—how this relationship transforms your cosmic identity and spiritual potential."
  ],
  'jesus-4': [
    "The first three minutes after death involve more cosmic administration than religious judgment—discover the actual transition process.",
    "Neither mystical vapor nor religious metaphor—the soul is a tangible reality with specific qualities bridging mind and spirit.",
    "What Jesus personally experienced from crucifixion through resurrection—the untold journey between death and reappearance.",
    "Neither fully material nor purely spiritual—Jesus demonstrated the transitional form we'll all experience after death.",
    "The cosmic mechanisms and universal significance behind a historical event religion has interpreted through ritual rather than reality."
  ],
  'jesus-5': [
    "While religious institutions marginalized women, Jesus created history's first organized women's spiritual service group.",
    "These revolutionary female ministers spread Jesus' message throughout Judea—the spiritual trailblazers written out of religious history.",
    "Not a reformed prostitute but a wealthy business owner and spiritual leader—meet the real woman behind centuries of religious misrepresentation.",
    "Jesus demonstrated radical gender equality 2,000 years before women's rights—challenging social norms religion later reinforced.",
    "Beyond the meek Madonna of religious iconography lies a strong, decisive woman whose spiritual insights shaped her remarkable son."
  ],
  'jesus-6': [
    "Evil isn't an equal opposing force to goodness but the absence of perfection—reframing the cosmic balance from conflict to evolution.",
    "Injustice isn't divine punishment or test—discover the cosmic perspective on life's apparent unfairness.",
    "Suffering isn't sent by God to teach lessons—explore the relationship between free will, physical reality, and spiritual growth.",
    "God doesn't micromanage physical events but works through spiritual channels—understanding divine action in a universe of law.",
    "Anger reflects limited perspective rather than righteous emotion—how expanded understanding transforms reactive emotions."
  ],
  'jesus-7': [
    "Prayer asks for divine help while worship expects nothing in return—the complementary practices for complete spiritual connection.",
    "Forgiveness doesn't require ritual or sacrifice—discover the simple yet profound process of aligning with divine mercy.",
    "Religion isn't about theological correctness but relationship with God—Jesus' radical redefinition of spiritual authenticity.",
    "Jesus' private spiritual practices reveal a direct connection with God unmediated by ritual—the model for genuine personal religion.",
    "Spiritual maturity transforms religion from obligation to joyful expression—the highest form of faith that transcends religious systems."
  ],
  'jesus-8': [
    "Angels aren't genderless messengers but feminine cosmic personalities with specific universe responsibilities and distinctive qualities.",
    "Throughout his life, Jesus received visits from celestial administrators—the cosmic connections behind pivotal moments in his ministry.",
    "Beyond announcing Jesus' birth, Gabriel serves as the chief executive of our local universe—the cosmic administrator behind divine interventions.",
    "Not a fallen angel but a rebellious system administrator—the true story of the personality behind religious concepts of the devil.",
    "Four thousand years ago, a divine being lived among humans as the \"priest of the most high God\"—the emergency mission that influenced Abraham."
  ],
  'jesus-9': [
    "Not a future paradise or church membership but a present spiritual reality—Jesus' actual teaching versus religious interpretations.",
    "Jesus emphasized experience over theology, relationship over ritual—the consistent spiritual priorities throughout his ministry.",
    "Beyond grand sermons, Jesus transformed individuals through personal connection—the intimate kingdom-building approach.",
    "Jesus didn't establish a religious hierarchy but trained spiritual ambassadors—the practical preparation for kingdom representation.",
    "The striking power of Jesus' most transformative statements—words that transcend religious dogma and speak directly to spiritual truth."
  ],
  'jesus-10': [
    "More than symbolic ritual—Jesus' baptism initiated a cosmic status change with universe-wide announcement of his mission.",
    "Beyond miracle to cosmic meaning—how this event demonstrated spiritual abundance principles rather than physical manipulation.",
    "Not just visible glory but a cosmic conference—the multidimensional meeting that prepared Jesus for his final Jerusalem mission.",
    "The strategic timing and cosmic implications behind Jesus' most dramatic public demonstration of divine authority.",
    "More than a meal or future ritual—Jesus established a living symbol of spiritual communion that transcended religious ceremony."
  ],
  'jesus-11': [
    "Jesus demonstrated spiritual living as practical artistry—balancing divine insight with human reality in everyday decisions.",
    "Jesus' surprisingly nuanced teachings on family life—compassionate wisdom that transcends rigid religious rules.",
    "Spiritual growth requires navigating life's complexities—recognizing and integrating the healthy aspects of human experience.",
    "Beyond material priorities lie values that enhance both temporal life and eternal growth—discerning what actually matters.",
    "Happiness stems from harmony between inner and outer life—Jesus' practical psychology for genuine contentment."
  ],
  'jesus-12': [
    "The cosmic strategy behind Jesus' apparent surrender—how divine purpose worked through even Judas' betrayal.",
    "The complex personality and political pressures behind Pilate's decision—a man caught between conscience and career.",
    "Not divine punishment but culmination of bestowal—how Jesus' death revealed God's nature rather than satisfying wrath.",
    "The actual exchange between Jesus and the criminals—what was really said and why it matters for understanding salvation.",
    "Forty days, nineteen appearances—the strategic pattern and purpose behind each post-resurrection encounter."
  ],
  'jesus-13': [
    "From human sacrifice to substitutionary theology—how the meaning of Jesus' death transformed through religious evolution.",
    "Jewish expectations versus Jesus' actual mission—how cultural concepts shaped and limited theological understanding.",
    "How sincere followers misinterpreted key teachings—the human errors that shaped Christianity's theological foundations.",
    "The divergent paths of early Christianity—how Peter's Jewish influence and Paul's Greek philosophy shaped a new religion.",
    "The biological reality and spiritual significance beyond religious doctrine—what the virgin birth actually represents."
  ],
  'jesus-14': [
    "From carpentry to music to astronomy—the leisure activities that reveal Jesus' personality and human development.",
    "Beyond the \"man of sorrows\" image—how Jesus experienced the full range of human emotions while maintaining spiritual stability.",
    "Addressing the speculation with revelatory insight—why Jesus remained single despite appreciating the value of marriage.",
    "How Jesus' family experiences shaped his character—the formative years that prepared him for cosmic mission.",
    "The integrated portrait of Jesus as both perfectly human and divinely aware—the complete personality beyond religious portrayals."
  ],
  
  // Parts I-III series (Series 15-28)
  'cosmic-1': [
    "Not just Earth's God but center of all reality—how the First Source and Center relates to every level of existence.",
    "Beyond our visible cosmos lies a structured creation of breathtaking proportions—the seven superuniverses and central creation.",
    "Twenty-one worlds surround the eternal Isle where divine administrators train ascending mortals—the celestial Harvard.",
    "Our cosmic neighborhood includes seven rotating creations, each with unique characteristics and evolutionary purposes.",
    "The cosmic physics behind reality—how energy transforms through levels from spiritual to material under divine direction."
  ],
  'cosmic-2': [
    "The original \"Son of God\" is co-eternal with the Father—the absolute spiritual expression and source of divine love.",
    "The cosmic mind exists as a divine person—the active, creative member completing the Paradise Trinity.",
    "Three distinct persons function as perfect unity—how divine diversity achieves perfect harmony without contradiction.",
    "Various orders of divine Sons carry out specific missions—from universe creation to planetary bestowal.",
    "Countless orders of angels and spirit helpers maintain the universe—the vast administration behind cosmic order."
  ],
  'cosmic-3': [
    "Direct fragments of God travel from Paradise to indwell human minds—the genesis of your inner divine presence.",
    "How these divine monitors work to transform your thinking and prepare your soul for eternal partnership.",
    "Your relationship with the indwelling presence depends on your choices—spiritual growth through cooperation.",
    "Your immortal soul emerges through partnership between your personality and the divine within—cosmic teamwork.",
    "Who you truly are transcends both body and mind—how your essential self continues beyond physical death."
  ],
  'cosmic-4': [
    "Universe creation combines divine planning with evolutionary potential—the living laboratory where we develop.",
    "Christ Michael (Jesus in his pre-bestowal identity) rules our local universe of ten million worlds.",
    "The divine feminine complements the Creator Son—providing mind, ministering spirits, and nurturing presence.",
    "Various orders of divine Sons handle specific roles—from system administration to emergency intervention.",
    "The astronomy behind our cosmic neighborhood—how suns, planets, and space energy function."
  ],
  'cosmic-5': [
    "Angels aren't imported from Paradise but created by our Local Universe Mother Spirit for specific missions.",
    "Angels are organized into specialized groups with distinct responsibilities—from planetary guidance to personal guardianship.",
    "Guardian angels work in pairs with specific techniques—the truth behind this religious concept is more fascinating than the myth.",
    "Angels participate in administering Earth alongside other celestial personalities—the invisible government behind human affairs.",
    "Neither angels nor humans, these unique beings bridge material and spiritual realms—our planet's permanent celestial citizens."
  ],
  'cosmic-6': [
    "Humans aren't the only ascending beings—various orders of creatures progress toward Paradise through different routes.",
    "Your first destinations after death are specialized training worlds—each offering specific growth experiences and challenges.",
    "Neither physical nor spiritual, the transitional morontia realm combines elements of both—the state you'll experience after resurrection.",
    "Your ultimate destiny involves service in a specialized group of Paradise-perfected beings with cosmic responsibilities.",
    "The universe demonstrates unity through diversity at every level—how seemingly different components serve harmonious purpose."
  ],
  'cosmic-7': [
    "Our solar system emerged from the Andronover nebula through processes both natural and designed—cosmic evolution with purpose.",
    "Life wasn't random chance but deliberately implanted by Life Carriers—divine scientists who specialize in biological design.",
    "Human evolution followed a purposeful pattern—the transitional beings who preceded modern humans over millions of years.",
    "Six colored races emerged simultaneously from a common ancestor—the divine plan for human genetic diversity.",
    "500,000 years ago, a divine administrator and staff of 100 materialized beings established Earth's first civilization."
  ],
  'cosmic-8': [
    "200,000 years ago, a brilliant administrator rejected God's authority—how intellectual pride led to cosmic betrayal.",
    "Why God allows rebellion to run its course—the divine wisdom in permitting free will despite devastating consequences.",
    "Caligastia, Earth's Planetary Prince, joined Lucifer's rebellion—plunging our world into spiritual isolation and developmental chaos.",
    "Earth's biological uplifters misstepped in their mission—a second tragedy that compounded our planet's already challenging path.",
    "The personality behind religious concepts of \"devil\" or \"Satan\"—understanding the being who betrayed our planet."
  ],
  'cosmic-9': [
    "An actual location with specific purpose—the headquarters prepared for Earth's biological uplifters 38,000 years ago.",
    "Not the first humans but superior biological beings with a mission to improve humanity's genetics and spiritual understanding.",
    "After leaving Eden, Adam and Eve established a new headquarters—continuing their mission despite altered circumstances.",
    "Adam and Eve's descendants gradually blended with evolutionary races—their genetic legacy still visible today.",
    "Not a \"fall\" through moral sin but an error in executing their mission—misguided impatience with lasting consequences."
  ],
  'cosmic-10': [
    "A divine being materialized on Earth 4,000 years ago—the emergency mission that preserved monotheism during a spiritual crisis.",
    "How Melchizedek's concepts influenced Eastern religions—the Salem truths that reached India, China, and beyond.",
    "Melchizedek's impact on Middle Eastern cultures—tracing his influence through Egyptian, Mesopotamian, and Persian beliefs.",
    "The evolution of Jewish monotheism from Melchizedek's teachings—how \"the God of Abraham, Isaac, and Jacob\" developed.",
    "Salem concepts that shaped Western philosophy—the Melchizedek influence on Greek thought and mystery cults."
  ],
  'cosmic-11': [
    "Primitive reverence for stones, animals, and natural forces—how early humans began reaching toward cosmic understanding.",
    "From chance and luck to personified spirits—the developmental steps that led from superstition toward spiritual insight.",
    "Fear of the dead and belief in spirits—how ancestor worship and ghost fear established religious practices that persist today.",
    "The concept of offending deity and making amends—how religious rituals developed to address spiritual anxiety.",
    "The progression from nature worship to ethical monotheism—religion's gradual refinement through revelation and insight."
  ],
  'cosmic-12': [
    "Faith functions as both evolutionary survival mechanism and personal spiritual connection—the dual nature of religious experience.",
    "Genuine religion transcends theology, philosophy, and ethics—operating as direct personal connection with cosmic reality.",
    "Faith stands on experiential grounds rather than logical proof—why spiritual certainty follows different rules than scientific certainty.",
    "Authentic spiritual experience leaves verifiable effects—the observable transformation that validates subjective connection.",
    "Jesus lived by actual faith—the spiritual trust that empowered his human life and serves as model for our own relationship with God."
  ],
  'cosmic-13': [
    "Beyond the eternal Paradise Trinity exists evolutionary Deity—emerging through time and dependent on creature experience.",
    "Seven dimensions of reality function simultaneously—how finite, absonite, and absolute levels interact across creation.",
    "God isn't just static and unchanging—a finite expression of Deity evolves through the collective experiences of all creatures.",
    "Supreme Deity emerges through both spirit values and power-personality unification—two complementary aspects of evolution.",
    "Your personal choices and experiences contribute to Supreme growth—how individual lives participate in Deity evolution."
  ],
  'cosmic-14': [
    "The Universal Father maintains specific relationships with different reality levels—personalized connection with every part of creation.",
    "Despite vast responsibilities, the Father relates to each person directly—the remarkable divine capacity for intimate connection.",
    "The Original Son maintains spiritual gravity and expresses divine love—the absolute anchor for all spirit reality.",
    "The Conjoint Actor provides mind, maintains circuits, and ministers to all beings—the active divine presence.",
    "Three distinct personalities function with perfect unity—how divine cooperation provides model for all relationships."
  ]
};

/**
 * Generate mock episodes for a series to use for testing
 * @param seriesId The series ID
 * @returns Array of mock episodes
 */
export function generateMockEpisodesForSeries(seriesId: string): Episode[] {
  const seriesInfo = getSeriesInfo(seriesId);
  if (!seriesInfo) return [];
  
  const episodes: Episode[] = [];
  const totalEpisodes = seriesInfo.totalEpisodes || 5;
  const titles = seriesEpisodeTitles[seriesId] || [];
  
  for (let i = 1; i <= totalEpisodes; i++) {
    const title = titles[i-1] || `Episode ${i}`;
    
    // Use audio URL function from config
    const audioUrl = getAudioUrl(seriesId, i);
    
    // Use PDF URL function from config
    const pdfUrl = getPdfUrl(seriesId, i);
    
    // Get the logline from the series info if available
    const logline = seriesInfo.logline || '';
    
    // Special case for jesus-1 series to use our summaries from JSON
    if (seriesId === 'jesus-1') {
      // Set source URLs based on episode number
      let sourceUrl = '';
      switch (i) {
        case 1:
          sourceUrl = 'https://discoverjesus.com/topic/the-personality-of-god';
          break;
        case 2:
          sourceUrl = 'https://discoverjesus.com/event/birth-and-infancy-of-jesus';
          break;
        case 3:
          sourceUrl = 'https://discoverjesus.com/event/sojourn-in-alexandria';
          break;
        case 4:
          sourceUrl = 'https://discoverjesus.com/event/jesus-first-passover-age-13';
          break;
        case 5:
          sourceUrl = 'https://discoverjesus.com/event/the-great-temptation';
          break;
        default:
          break;
      }
      
      // Get the summaries for this episode
      const summaries = sourceUrl ? getDiscoverJesusSummary(sourceUrl) : {};
      
      console.log('DEBUG generating jesus-1 episode:', {
        episodeId: i,
        title,
        sourceUrl, 
        hasSummaries: !!summaries,
        hasCardSummary: !!summaries.cardSummary,
        hasSummary: !!summaries.summary
      });
      
      episodes.push({
        id: i,
        title,
        audioUrl,
        pdfUrl,
        series: seriesId as SeriesType,
        sourceUrl,
        description: `${seriesInfo.title} - ${title}`,
        summary: summaries.summary || seriesInfo.description || '',
        cardSummary: summaries.cardSummary || logline || seriesInfo.description || '',
        imageUrl: `/images/${seriesId}/card-${i}.jpg`
      });
    } else {
      // Default behavior for other series
      episodes.push({
        id: i,
        title,
        audioUrl,
        pdfUrl,
        series: seriesId as SeriesType,
        description: `${seriesInfo.title} - ${title}`,
        summary: seriesInfo.description || '',
        cardSummary: logline || seriesInfo.description || '',
        imageUrl: `/images/${seriesId}/card-${i}.jpg`
      });
    }
  }
  
  return episodes;
}

/**
 * Get episodes for a specific series
 * @param seriesId The series ID to get episodes for
 * @returns Array of episodes for the specified series
 */
export function getEpisodesForSeries(seriesId: string): Episode[] {
  // Special case for 'urantia-papers' to support existing shared links
  if (seriesId === 'urantia-papers') {
    // Generate mock episodes for Urantia Papers (Papers 1-196)
    const episodes: Episode[] = [];
    
    // Get a reasonable count of episodes
    const totalEpisodes = 196;
    
    for (let i = 1; i <= totalEpisodes; i++) {
      // Paper titles would ideally come from a real data source
      const title = `Paper ${i}`;
      
      // Use audio URL function from config
      const audioUrl = getAudioUrl('urantia-papers', i);
      
      // Use PDF URL function from config
      const pdfUrl = getPdfUrl('urantia-papers', i);
      
      episodes.push({
        id: i,
        title: title,
        audioUrl,
        pdfUrl,
        series: seriesId as SeriesType,
        description: `Urantia Book, Paper ${i}`,
        summary: `Summary of Paper ${i}`,
        cardSummary: `Brief overview of Paper ${i}`,
        imageUrl: '/images/urantia-book-cover.jpg'
      });
    }
    
    return episodes;
  }
  
  // In production, this would fetch from an API or database
  // For now, we'll generate mock episodes
  return generateMockEpisodesForSeries(seriesId);
}

/**
 * Get a specific episode by series and episode ID
 * @param seriesId The series ID
 * @param episodeId The episode ID
 * @returns The episode or undefined if not found
 */
export function getEpisode(seriesId: string, episodeId: number): Episode | undefined {
  const episodes = getEpisodesForSeries(seriesId);
  return episodes.find(episode => episode.id === episodeId);
}

/**
 * Get recent episodes across all series
 * @param limit Maximum number of episodes to return
 * @returns Array of recent episodes
 */
export function getRecentEpisodes(limit = 6): Episode[] {
  // In production, this would be dynamic based on publication date
  // For now, just return some mock episodes
  const recentSeries = ['jesus-1', 'jesus-2', 'cosmic-1'];
  const episodes: Episode[] = [];
  
  recentSeries.forEach(seriesId => {
    const seriesEpisodes = generateMockEpisodesForSeries(seriesId).slice(0, 2);
    episodes.push(...seriesEpisodes);
  });
  
  return episodes.slice(0, limit);
}

/**
 * Generate a list of audio files that need to be uploaded to R2 for a series
 * This is helpful for identifying what files need to be created and uploaded
 * @param seriesId The series ID to generate the file list for
 * @returns An array of file paths that would be expected in R2
 */
export function generateAudioFileList(seriesId: string): string[] {
  const seriesInfo = getSeriesInfo(seriesId);
  if (!seriesInfo) return [];
  
  const fileList: string[] = [];
  const totalEpisodes = seriesInfo.totalEpisodes || 5;
  const titles = seriesEpisodeTitles[seriesId] || [];
  
  for (let i = 1; i <= totalEpisodes; i++) {
    const title = titles[i-1] || `Episode ${i}`;
    
    // For jesus-focused series
    if (seriesId.startsWith('jesus-')) {
      const seriesNum = seriesId.split('-')[1];
      
      // Add both possible naming formats
      fileList.push(`${title.replace(/ /g, '%20')}${i}.mp3`);
      fileList.push(`jesus-${seriesNum}-episode-${i}.mp3`);
    }
    // For other series types
    else {
      fileList.push(`${seriesId}/episode-${i}.mp3`);
    }
  }
  
  return fileList;
}

// Get the DiscoverJesus.com summary for an episode
export function getDiscoverJesusSummary(sourceUrl: string | undefined): { cardSummary?: string; summary?: string } {
  if (!sourceUrl) return {};
  
  // Extract the path part from the URL (everything after discoverjesus.com/)
  const urlPath = sourceUrl.split('discoverjesus.com/')[1];
  
  // Look up the summary in our map
  const summary = discoverJesusSummaries[urlPath];
  
  if (summary) {
    return {
      cardSummary: summary.shortSummary,
      summary: summary.fullSummary
    };
  }
  
  return {};
} 