const fs = require('fs');
const path = require('path');

// File paths
const CONTENT_FILE = path.join(__dirname, '../src/locales/en/content/content.json');
const URANTIA_PAPERS_FILE = path.join(__dirname, '../src/locales/en/content/urantia-papers.json');

function createTimestampedBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Created backup: ${backupPath}`);
  return backupPath;
}

function createMovieStyleLoglines() {
  // Movie-style loglines for papers that don't have good ones
  return {
    "0": "Journey into the cosmic architecture where our world is just one small part of an infinite creation designed by an eternal God.",
    "1": "Not just Earth's God but center of all reality—how the First Source and Center relates to every level of existence.",
    "2": "Journey into the infinite nature of God through Jesus's life, ancient wisdom, and the profound question: how can limited beings understand an unlimited Creator?",
    "3": "Discover how an infinite God makes himself known throughout the universe through his Creator Sons, while remaining mysteriously present in every heart.",
    "4": "Discover how an infinite God's eternal purpose unfolds across the cosmos through divine providence and unstoppable progress.",
    "5": "Every human carries a fragment of the infinite God within them - a direct line to the divine that transcends all barriers.",
    "6": "The original 'Son of God' is co-eternal with the Father—the absolute spiritual expression and source of divine love.",
    "7": "The Eternal Son maintains spiritual gravity and expresses divine love—the absolute anchor for all spirit reality.",
    "8": "The cosmic mind exists as a divine person—the active, creative member completing the Paradise Trinity.",
    "9": "The Conjoint Actor provides mind, maintains circuits, and ministers to all beings—the active divine presence.",
    "10": "Three distinct persons function as perfect unity—how divine diversity achieves perfect harmony without contradiction.",
    "11": "Journey to the cosmic heart: Discover Paradise, the awe-inspiring eternal center where the Universal Father dwells at the core of all reality.",
    "12": "Beyond our visible cosmos lies a structured creation of breathtaking proportions—the seven superuniverses and central creation.",
    "13": "Twenty-one worlds surround the eternal Isle where divine administrators train ascending mortals—the celestial Harvard.",
    "14": "Journey to the heart of creation: discover Havona, a perfect universe of one billion worlds dancing in an eternal cosmic ballet around Paradise.",
    "15": "Our cosmic neighborhood includes seven rotating creations, each with unique characteristics and evolutionary purposes.",
    "16": "Imagine the universe being governed by seven supreme beings, each reflecting a unique blend of the Divine Trinity's characteristics.",
    "17": "Meet the cosmic executives: Seven Supreme Spirit groups who orchestrate the administration of the entire grand universe.",
    "18": "Meet the supreme administrators of Paradise: seven orders of perfect beings created by the Trinity to govern the grand universe.",
    "19": "Meet the mysterious Trinity Teacher Sons - cosmic bridge-builders who help connect the different orders of divine beings across the universe.",
    "20": "Various orders of divine Sons carry out specific missions—from universe creation to planetary bestowal.",
    "21": "Meet the cosmic architects: The Creator Sons who birth and rule entire universes as living embodiments of divine perfection.",
    "22": "Discover the cosmic hierarchy of Trinity-embraced beings who ascend from mortal life to serve as divine messengers and guardians of the universe.",
    "23": "Meet the cosmic solo travelers: extraordinary spirit beings who prefer to work alone while staying connected to all of creation's intelligence.",
    "24": "Meet the cosmic network engineers who maintain the spiritual circuits of the universe - the mysterious Higher Personalities of the Infinite Spirit.",
    "25": "Meet the cosmic postal service: the remarkable Messenger Hosts who keep the spiritual realms connected.",
    "26": "Meet the cosmic angels: A fascinating hierarchy of celestial beings who help guide mortals toward spiritual perfection.",
    "27": "Meet the celestial mentors who teach divine rest and spiritual perfection to souls reaching Paradise.",
    "28": "Meet the celestial administrators: powerful angelic beings who help manage entire regions of the cosmos while serving as divine liaisons between realms.",
    "29": "Meet the cosmic engineers who regulate the physical forces of the universe - beings so unique they exist between matter and spirit.",
    "30": "Journey into the cosmic org chart: discover the mind-bending hierarchy of celestial beings that manage our universe.",
    "31": "Meet the elite cosmic force where mortal souls, angels, and perfect beings unite for an epic destiny in the far reaches of space.",
    "32": "Universe creation combines divine planning with evolutionary potential—the living laboratory where we develop.",
    "33": "Christ Michael (Jesus in his pre-bestowal identity) rules our local universe of ten million worlds.",
    "34": "The divine feminine complements the Creator Son—providing mind, ministering spirits, and nurturing presence.",
    "35": "Various orders of divine Sons handle specific roles—from system administration to emergency intervention.",
    "36": "Meet the cosmic gardeners who seed life across the universe - the fascinating Life Carriers who design and nurture evolutionary worlds.",
    "37": "Meet the celestial executives of our local universe, including the legendary Gabriel, who serves as chief of staff to its divine creators.",
    "38": "Angels aren't imported from Paradise but created by our Local Universe Mother Spirit for specific missions.",
    "39": "Angels are organized into specialized groups with distinct responsibilities—from planetary guidance to personal guardianship.",
    "40": "Humans aren't the only ascending beings—various orders of creatures progress toward Paradise through different routes.",
    "41": "The astronomy behind our cosmic neighborhood—how suns, planets, and space energy function.",
    "42": "The cosmic physics behind reality—how energy transforms through levels from spiritual to material under divine direction.",
    "43": "Journey to Edentia: Discover a breathtaking architectural world where celestial beings walk above crystal lakes and eternal springtime reigns.",
    "44": "Discover the divine artists who create transcendent beauty across the spiritual realms, where art and culture reach heights beyond mortal imagination.",
    "45": "Journey through the celestial architecture of Jerusem - a magnificent system of 57 worlds where human souls begin their ascension to paradise.",
    "46": "Journey to Jerusem: Explore a breathtaking celestial capital where sunlight filters from all directions and time flows differently than on Earth.",
    "47": "Your first destinations after death are specialized training worlds—each offering specific growth experiences and challenges.",
    "48": "Neither physical nor spiritual, the transitional morontia realm combines elements of both—the state you'll experience after resurrection.",
    "49": "Journey through the cosmic nurseries where mortal civilizations are born, evolve, and reach for the stars.",
    "50": "Meet the divine governors of evolving worlds - celestial princes who walk the razor's edge between cosmic duty and the temptations of power.",
    "51": "Meet the celestial power couple: Adam and Eve as you've never imagined them - immortal biological engineers sent to elevate evolving worlds.",
    "52": "Journey through the seven epic ages that transform primitive worlds into enlightened civilizations across the universe.",
    "53": "200,000 years ago, a brilliant administrator rejected God's authority—how intellectual pride led to cosmic betrayal.",
    "54": "Why God allows rebellion to run its course—the divine wisdom in permitting free will despite devastating consequences.",
    "55": "Journey to the pinnacle of planetary evolution - where a magnificent morontia temple descends from the heavens to mark a world's entry into eternal light and life.",
    "56": "The universe demonstrates unity through diversity at every level—how seemingly different components serve harmonious purpose.",
    "57": "Our solar system emerged from the Andronover nebula through processes both natural and designed—cosmic evolution with purpose.",
    "58": "Life wasn't random chance but deliberately implanted by Life Carriers—divine scientists who specialize in biological design.",
    "59": "Journey back one billion years to witness Earth's dramatic transformation from lifeless rock to thriving marine wonderland.",
    "60": "Journey back 150 million years to witness Earth's dramatic transition from sea to land, as ancient reptiles take their first steps onto virgin continents.",
    "61": "Journey back 50 million years to an Earth teeming with strange new creatures, as the first mammals emerge to inherit the world from dinosaurs.",
    "62": "Human evolution followed a purposeful pattern—the transitional beings who preceded modern humans over millions of years.",
    "63": "One million years ago, our direct ancestors emerged through three dramatic mutations from small, lemur-like creatures, setting humanity's story in motion.",
    "64": "Six colored races emerged simultaneously from a common ancestor—the divine plan for human genetic diversity.",
    "65": "Discover how highly advanced Life Carriers orchestrate evolution across the universe, revealing that life's development is never random, but always purposeful.",
    "66": "500,000 years ago, a divine administrator and staff of 100 materialized beings established Earth's first civilization.",
    "67": "Caligastia, Earth's Planetary Prince, joined Lucifer's rebellion—plunging our world into spiritual isolation and developmental chaos.",
    "68": "The birth of civilization: how fear, necessity, and survival instincts transformed isolated humans into cooperative societies.",
    "69": "How humanity's earliest social experiments laid the groundwork for everything from marriage to money.",
    "70": "From tribal stone fights to organized governments: How humanity's violent past shaped our social order.",
    "71": "From tribal warfare to organized civilization: discover how humanity's endless power struggles gave birth to the modern state.",
    "72": "Discover a thriving civilization on a distant world that overcame rebellion and isolation to build an advanced society of 140 million people living to age 90.",
    "73": "An actual location with specific purpose—the headquarters prepared for Earth's biological uplifters 38,000 years ago.",
    "74": "Not the first humans but superior biological beings with a mission to improve humanity's genetics and spiritual understanding.",
    "75": "Not a 'fall' through moral sin but an error in executing their mission—misguided impatience with lasting consequences.",
    "76": "After leaving Eden, Adam and Eve established a new headquarters—continuing their mission despite altered circumstances.",
    "77": "Neither angels nor humans, these unique beings bridge material and spiritual realms—our planet's permanent celestial citizens.",
    "78": "Adam and Eve's descendants gradually blended with evolutionary races—their genetic legacy still visible today.",
    "79": "Ancient climate change triggers one of humanity's greatest migrations, forever reshaping the civilizations of Asia.",
    "80": "The epic love story of ancient Europe: how a legendary 'violet race' transformed human civilization through romance with the blue-skinned peoples of the west.",
    "81": "How a changing climate forced humanity's dramatic shift from hunting to farming, forever transforming the course of civilization.",
    "82": "The primal force that birthed civilization: how the simple act of mating evolved into the complex institution of marriage and family life.",
    "83": "From primitive mating to sacred union: The epic story of how marriage transformed human civilization.",
    "84": "The surprising truth about marriage: It wasn't founded on love or sex, but on humanity's most basic need - food.",
    "85": "From shooting stars to sacred stones: How humanity's earliest forms of worship arose from our primal fears and fascination with natural phenomena.",
    "86": "From chance and luck to personified spirits—the developmental steps that led from superstition toward spiritual insight.",
    "87": "Fear of the dead and belief in spirits—how ancestor worship and ghost fear established religious practices that persist today.",
    "88": "From sacred stones to lucky numbers: How ancient humans found magic and meaning in everyday objects.",
    "89": "The concept of offending deity and making amends—how religious rituals developed to address spiritual anxiety.",
    "90": "From fear-driven shamans to divine love: How humanity's spiritual middlemen shaped the evolution of religion.",
    "91": "From primitive luck-wishing to divine dialogue: How humanity learned to pray.",
    "92": "The progression from nature worship to ethical monotheism—religion's gradual refinement through revelation and insight.",
    "93": "A divine being materialized on Earth 4,000 years ago—the emergency mission that preserved monotheism during a spiritual crisis.",
    "94": "How Melchizedek's concepts influenced Eastern religions—the Salem truths that reached India, China, and beyond.",
    "95": "Melchizedek's impact on Middle Eastern cultures—tracing his influence through Egyptian, Mesopotamian, and Persian beliefs.",
    "96": "The evolution of Jewish monotheism from Melchizedek's teachings—how 'the God of Abraham, Isaac, and Jacob' developed.",
    "97": "How ancient Hebrew prophets transformed a tribal deity into the Universal Father - without losing the common person's connection to God.",
    "98": "Salem concepts that shaped Western philosophy—the Melchizedek influence on Greek thought and mystery cults.",
    "99": "As society races toward an uncertain future, religion must evolve from a preserver of tradition to a dynamic force for positive change.",
    "100": "Faith functions as both evolutionary survival mechanism and personal spiritual connection—the dual nature of religious experience.",
    "101": "Genuine religion transcends theology, philosophy, and ethics—operating as direct personal connection with cosmic reality.",
    "102": "Faith stands on experiential grounds rather than logical proof—why spiritual certainty follows different rules than scientific certainty.",
    "103": "Authentic spiritual experience leaves verifiable effects—the observable transformation that validates subjective connection.",
    "104": "From primitive finger-counting to divine truth: How humanity's fascination with the number three shaped our understanding of the Trinity.",
    "105": "Beyond the eternal Paradise Trinity exists evolutionary Deity—emerging through time and dependent on creature experience.",
    "106": "Seven dimensions of reality function simultaneously—how finite, absonite, and absolute levels interact across creation.",
    "107": "Direct fragments of God travel from Paradise to indwell human minds—the genesis of your inner divine presence.",
    "108": "How these divine monitors work to transform your thinking and prepare your soul for eternal partnership.",
    "109": "Inside the cosmic apprenticeship of the divine fragments that help humans grow toward God - while they grow through us.",
    "110": "Your relationship with the indwelling presence depends on your choices—spiritual growth through cooperation.",
    "111": "Your immortal soul emerges through partnership between your personality and the divine within—cosmic teamwork.",
    "112": "Who you truly are transcends both body and mind—how your essential self continues beyond physical death.",
    "113": "Guardian angels work in pairs with specific techniques—the truth behind this religious concept is more fascinating than the myth.",
    "114": "Angels participate in administering Earth alongside other celestial personalities—the invisible government behind human affairs.",
    "115": "God isn't just static and unchanging—a finite expression of Deity evolves through the collective experiences of all creatures.",
    "116": "Supreme Deity emerges through both spirit values and power-personality unification—two complementary aspects of evolution.",
    "117": "Your personal choices and experiences contribute to Supreme growth—how individual lives participate in Deity evolution.",
    "118": "Journey into the mind-bending nature of infinity, time, and our eternal potential through the lens of divine growth.",
    "119": "Before becoming our universe's sovereign ruler, Jesus lived seven different lives to truly understand his creations.",
    "120": "Before becoming Jesus, a divine Creator Son had to walk in the shoes of his creations six different times - and Earth would be his final test.",
    "121": "Discover why Jesus was born at history's perfect moment - when three great civilizations converged to create an unprecedented era of unity, travel, and cultural exchange.",
    "122": "The cosmic search for Jesus's perfect parents: How a divine commission selected Joseph and Mary from all families on Earth.",
    "123": "While in exile in Egypt, Mary struggles between protecting her extraordinary child and letting him experience a normal childhood.",
    "124": "A young Jesus challenges religious authorities over his forbidden artwork, sparking a dramatic confrontation about creativity and tradition.",
    "125": "Young Jesus challenges religious tradition during his transformative first visit to Jerusalem's great temple.",
    "126": "At age 14, Jesus faces his greatest test - navigating divine awareness while coming of age as a regular teenage boy.",
    "127": "At age 15, Jesus faces the ultimate coming-of-age story: supporting his family while grappling with the dawning awareness of his divine purpose.",
    "128": "Witness the extraordinary years when Jesus, fully aware of his divine nature, chose to live as a completely ordinary man.",
    "129": "Before becoming a spiritual teacher, Jesus revolutionized boat-building on the Sea of Galilee while wrestling with leaving his beloved family behind.",
    "130": "Jesus embarks on an epic two-year journey across the ancient world, forming profound connections and bridging cultures as both teacher and student.",
    "131": "A young seeker's journey to collect the world's wisdom about God reveals surprising common threads across ancient faiths.",
    "132": "While in ancient Rome, Jesus quietly transforms 30 influential religious leaders, laying the groundwork for Christianity's explosive growth across the Empire.",
    "133": "On a journey across ancient Italy, Jesus reveals profound truths about human equality while teaching a young man the delicate balance between mercy and justice.",
    "134": "After years of world travels, Jesus makes the fateful decision to begin his public ministry in his homeland of Palestine.",
    "135": "The extraordinary origin story of John the Baptist - from divine prophecy to wilderness prophet-in-training.",
    "136": "The dramatic contrast between two spiritual revolutionaries: John's urgent warnings versus Jesus' joyful message of a new kingdom.",
    "137": "The moment Jesus handpicks his first apostles, forever changing their lives and launching a spiritual revolution.",
    "138": "Jesus sends his first apostles on a daring mission - but breaks his family's hearts by excluding them from his inner circle.",
    "139": "Meet the remarkable band of ordinary men who left everything behind to follow Jesus, and learn how only one would ultimately betray him.",
    "140": "Jesus gathers his twelve apostles for a profound moment of transformation - from fishermen to spiritual ambassadors of a revolutionary kingdom.",
    "141": "As Jesus embarks on his public ministry, he weeps not from fear or doubt, but because his own family fails to bid him farewell.",
    "142": "Jesus confronts the stark contrast between the 'wrathful God' of old and his revolutionary message of a loving Universal Father.",
    "143": "When Jesus faces Roman skeptics who call his teachings 'weak', he reveals a profound truth about the universe-transforming power of love.",
    "144": "In a secluded mountain retreat, Jesus prepares his confused apostles for their final mission while wrestling with the fate of John the Baptist.",
    "145": "In four pivotal days, Jesus performs the famous 'miraculous' catch of fish and reveals his special bond with his unwavering sister Ruth.",
    "146": "Jesus unleashes his apostles to preach freely for the first time, launching a transformative tour that would blend ancient wisdom with revolutionary spiritual teachings.",
    "147": "Jesus's secret missions and a Roman centurion's extraordinary faith reveal how the spiritual kingdom transcended political and cultural boundaries.",
    "148": "Jesus establishes a groundbreaking spiritual training camp where diverse teachers share different interpretations of the same truth.",
    "149": "As Jesus and his growing band of evangelists sweep through Galilee, mysterious spontaneous healings follow in their wake - despite his attempts to keep them secret.",
    "150": "In a radical break with tradition, Jesus selects ten women to become authorized teachers of his message - the first Women's Evangelistic Corps in history.",
    "151": "Jesus turns to parables by the sea, using stories to shield sacred truths while teaching profound wisdom to those ready to hear.",
    "152": "A desperate father's race against time intersects with a woman's extraordinary healing through faith alone, revealing the true nature of miracles.",
    "153": "In a pivotal moment, Jesus boldly confronts his critics and challenges their vision of a material Messiah, marking a dramatic turning point in his public ministry.",
    "154": "As religious authorities plot against Jesus, Herod Antipas makes a surprising choice to protect him - driven by guilt, superstition, and unexpected allies at court.",
    "155": "Jesus challenges his followers to match the passionate conviction of 'heathens' while pursuing a higher path of love and mercy.",
    "156": "A desperate mother's unshakeable faith challenges Jesus's disciples when she refuses to be turned away, insisting her daughter can be healed.",
    "157": "When Jesus' enemies stake out his family home, a clever temple tax scheme and mysterious helpers reveal the delicate dance between divinity and earthly obligations.",
    "158": "On a lonely mountaintop, Jesus faces a pivotal choice between returning to his cosmic throne and continuing his challenging human journey.",
    "159": "Jesus reveals a radical vision of divine forgiveness - where God actively seeks out the lost before they even think to repent.",
    "160": "A Greek philosopher meets Jesus's apostles to explore life's deepest question: how to transform basic human drives into an enlightened art of living.",
    "161": "A Greek philosopher challenges two apostles in an epic debate about whether God can truly be a person.",
    "162": "When Jesus boldly enters Jerusalem despite death threats, his own disciples are torn between their earlier calls for him to preach there and their current fears for his safety.",
    "163": "Jesus handpicks and trains seventy spiritual ambassadors to spread his revolutionary message of peace across the land.",
    "164": "Jesus tells the timeless parable of the Good Samaritan, challenging a lawyer's attempt to define the limits of compassion.",
    "165": "Jesus launches his final teaching mission, drawing record crowds as he shares his message in the beautiful lands beyond the Jordan.",
    "166": "A tense breakfast confrontation reveals Jesus challenging the hollow rituals and hidden hypocrisy of religious leaders.",
    "167": "At a tense breakfast gathering of religious leaders, Jesus faces off with his critics while showing compassion to an uninvited sick man seeking healing.",
    "168": "Jesus confronts death itself as he responds to the desperate faith of two sisters grieving their brother Lazarus.",
    "169": "Jesus reveals a radical message: God seeks us even before we seek Him, turning traditional religious wisdom on its head.",
    "170": "Jesus reveals the profound truth behind his most misunderstood teaching: the kingdom of heaven isn't a place or future event - it's a transformative personal experience available right now.",
    "171": "In a pivotal moment, Jesus confronts his followers' persistent hopes for an earthly kingdom as he heads toward Jerusalem, challenging their deepest assumptions about power and glory.",
    "172": "On the eve of his fateful entry into Jerusalem, Jesus celebrates his last peaceful moments with friends while his enemies plot in the shadows.",
    "173": "Jesus confronts corruption at the Temple in Jerusalem, where sacred worship had been transformed into a profitable marketplace.",
    "174": "On the eve of destiny, Jesus gives intimate final advice to each apostle, revealing profound insights into their unique characters and challenges ahead.",
    "175": "In a dramatic final address at the temple, Jesus delivers both a message of boundless mercy and a stark warning to those who reject the light.",
    "176": "On a moonlit evening, Jesus delivers a chilling prophecy: Jerusalem's magnificent temple will be reduced to rubble.",
    "177": "On his final day of peace before his crucifixion, Jesus chooses to spend it with an earnest young man who simply wanted to carry his lunch basket.",
    "178": "On his final free day on Earth, Jesus reveals the delicate balance between heavenly and earthly citizenship in a profound farewell address.",
    "179": "At the Last Supper, pride and status-seeking disrupt what should have been a sacred final meal between Jesus and his apostles.",
    "180": "In his final hours, Jesus reveals a revolutionary command that transforms love from a duty into a divine adventure.",
    "181": "Before his departure, Jesus reveals how his physical absence will transform into a profound spiritual presence within all believers.",
    "182": "In a moonlit garden, Jesus gathers his closest followers for an intimate final prayer, even as betrayal looms in the shadows.",
    "183": "In a garden at night, Jesus faces his destiny alone while protecting his sleeping followers from the approaching betrayal.",
    "184": "In a tense late-night interrogation, Jesus faces off against Annas, the powerful former high priest who once showed interest in his potential but now sees him as a threat to the established order.",
    "185": "The moral coward who held Jesus' fate: How Pilate's fear of the Jews and political survival led to history's most infamous trial.",
    "186": "In his final moments of freedom, Jesus arranges to see his mother while Judas faces the crushing reality of his betrayal.",
    "187": "The final walk to Golgotha: Jesus chooses to lay down his life while Pilate's defiant inscription declares him 'King of the Jews'.",
    "188": "In a dramatic race against time and angry mobs, two secret followers of Jesus defy tradition to give him an honorable burial.",
    "189": "In a moment that defied natural law, Jesus emerges from death not as a resurrected physical body, but in an entirely new form of existence.",
    "190": "Jesus returns in a transformed body to demonstrate the reality of life after death, sparking both doubt and wonder among his followers.",
    "191": "While Jesus appears to others across Jerusalem, ten apostles huddle behind locked doors, wrestling with doubt and hope on the most pivotal day in their lives.",
    "192": "After his resurrection, Jesus appears mysteriously by a lake, recreating a familiar scene that transforms discouraged fishermen back into inspired apostles.",
    "193": "Jesus makes his most dramatic post-resurrection appearance yet, challenging his followers to truly understand his message rather than just hear his words.",
    "194": "The dramatic moment when 120 frightened believers were transformed into fearless preachers by a mysterious spiritual presence.",
    "195": "How a small Jewish movement transformed into a world-changing religion by adapting to Greco-Roman culture while preserving Jesus' revolutionary message.",
    "196": "Experience the revolutionary faith of Jesus - not a blind belief, but a living, personal relationship with God that transformed the universe.",
    "197": "La Fe de Jesús" // Spanish version placeholder
  };
}

function fixUrantiaLoglines() {
  console.log('🔧 Starting Urantia Papers loglines fix...\n');

  // Create backup
  createTimestampedBackup(CONTENT_FILE);

  // Load files
  const contentData = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  const urantiaData = JSON.parse(fs.readFileSync(URANTIA_PAPERS_FILE, 'utf8'));
  const movieLoglines = createMovieStyleLoglines();

  // Check if urantia-papers exists in content
  if (!contentData['urantia-papers']) {
    console.log('❌ No urantia-papers section found in content.json');
    return;
  }

  let updatedCount = 0;

  // Process each episode in urantia-papers
  Object.keys(contentData['urantia-papers'].episodes).forEach(episodeKey => {
    const episode = contentData['urantia-papers'].episodes[episodeKey];
    const paperKey = `paper_${episodeKey}`;
    
    // Priority 1: Use episodeCard from urantia-papers.json if available
    if (urantiaData[paperKey] && urantiaData[paperKey].episode_card) {
      episode.logline = urantiaData[paperKey].episode_card;
      updatedCount++;
      console.log(`✅ Updated Paper ${episodeKey} logline from urantia-papers.json`);
    }
    // Priority 2: Use our movie-style loglines if no episodeCard
    else if (movieLoglines[episodeKey]) {
      episode.logline = movieLoglines[episodeKey];
      updatedCount++;
      console.log(`✨ Added new movie-style logline for Paper ${episodeKey}`);
    }
    // Priority 3: Keep existing if it's good (not the generic "Explore Paper X" format)
    else if (episode.logline && !episode.logline.startsWith('Explore Paper')) {
      console.log(`➡️  Kept existing logline for Paper ${episodeKey}`);
    }
    // Last resort: Create a generic but better logline
    else {
      episode.logline = `Explore the profound mysteries of ${episode.title} and its cosmic significance.`;
      updatedCount++;
      console.log(`🔧 Created fallback logline for Paper ${episodeKey}`);
    }
  });

  // Write updated content
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(contentData, null, 2));

  console.log(`\n🎬 Urantia Papers loglines fix completed!`);
  console.log(`📊 Updated ${updatedCount} loglines with movie-style content`);
  console.log(`📁 Content file updated: ${CONTENT_FILE}`);
}

// Run the fix
fixUrantiaLoglines(); 