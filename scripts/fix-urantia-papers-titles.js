import fs from 'fs';
import path from 'path';

// Correct Spanish titles from urantiagaia.org
const correctTitles = {
  0: "Prólogo",
  1: "El Padre Universal",
  2: "La Naturaleza de Dios",
  3: "Los Atributos de Dios",
  4: "La Relación de Dios con el Universo",
  5: "La Relación de Dios con el Individuo",
  6: "El Hijo Eterno",
  7: "La Relación del Hijo Eterno con el Universo",
  8: "El Espíritu Infinito",
  9: "La Relación del Espíritu Infinito con el Universo",
  10: "La Trinidad del Paraíso",
  11: "La Isla Eterna del Paraíso",
  12: "El Universo de Universos",
  13: "Las Esferas Sagradas del Paraíso",
  14: "El Universo Central y Divino",
  15: "Los Siete Superuniversos",
  16: "Los Siete Espíritus Maestros",
  17: "Los Siete Grupos de Espíritus Supremos",
  18: "Las Personalidades Supremas de la Trinidad",
  19: "Los Seres Coordinados de Origen Trinitario",
  20: "Los Hijos Paradisiacos de Dios",
  21: "Los Hijos Creadores del Paraíso",
  22: "Los Hijos Trinitizados de Dios",
  23: "Los Mensajeros Solitarios",
  24: "Las Personalidades Superiores del Espíritu Infinito",
  25: "Las Huestes Mensajeras del Espacio",
  26: "Los Espíritus Ministrantes del Universo Central",
  27: "El Ministerio de los Supernafines Primarios",
  28: "Los Espíritus Ministrantes de los Superuniversos",
  29: "Los Directores del Poder del Universo",
  30: "Las Personalidades del Gran Universo",
  31: "El Cuerpo de la Finalidad",
  32: "La Evolución de los Universos Locales",
  33: "La Administración del Universo Local",
  34: "El Espíritu Materno del Universo Local",
  35: "Los Hijos de Dios de los Universos Locales",
  36: "Los Portadores de Vida",
  37: "Las Personalidades del Universo Local",
  38: "Los Espíritus Ministrantes del Universo Local",
  39: "Las Huestes Seráficas",
  40: "Los Hijos de Dios Ascendentes",
  41: "Los Aspectos Físicos del Universo Local",
  42: "La Energía — La Mente y la Materia",
  43: "Las Constelaciones",
  44: "Los Artesanos Celestiales",
  45: "La Administración del Sistema Local",
  46: "La Sede Central del Sistema Local",
  47: "Los Siete Mundos de Estancia",
  48: "La Vida Morontial",
  49: "Los Mundos Habitados",
  50: "Los Príncipes Planetarios",
  51: "Los Adanes Planetarios",
  52: "Las Épocas Planetarias de los Mortales",
  53: "La Rebelión de Lucifer",
  54: "Los Problemas de la Rebelión de Lucifer",
  55: "Las Esferas de Luz y Vida",
  56: "Unidad Universal",
  57: "El Origen de Urantia",
  58: "El Establecimiento de la Vida en Urantia",
  59: "La Era de la Vida Marina en Urantia",
  60: "Urantia Durante la Era Primitiva de la Vida Terrestre",
  61: "La Era de los Mamíferos en Urantia",
  62: "Las Razas Protohumanas del Hombre Primitivo",
  63: "La Primera Familia Humana",
  64: "Las Razas Evolucionarias de Color",
  65: "La Supervisión de la Evolución",
  66: "El Príncipe Planetario de Urantia",
  67: "La Rebelión Planetaria",
  68: "Los Albores de la Civilización",
  69: "Las Instituciones Humanas Primitivas",
  70: "La Evolución del Gobierno Humano",
  71: "El Desarrollo del Estado",
  72: "El Gobierno de un Planeta Vecino",
  73: "El Jardín del Edén",
  74: "Adán y Eva",
  75: "La Falta de Adán y Eva",
  76: "El Segundo Jardín",
  77: "Los Seres Intermedios",
  78: "La Raza Violeta Después de los Días de Adán",
  79: "La Expansión Andita en el Oriente",
  80: "La Expansión Andita en el Occidente",
  81: "El Desarrollo de la Civilización Moderna",
  82: "La Evolución del Matrimonio",
  83: "La Institución del Matrimonio",
  84: "Matrimonio y Vida Familiar",
  85: "Los Orígenes de la Adoración",
  86: "La Evolución Primitiva de la Religión",
  87: "Los Cultos a los Fantasmas",
  88: "Los Fetiches, los Amuletos y la Magia",
  89: "El Pecado, el Sacrificio y la Expiación",
  90: "El Shamanismo — Los Curanderos y los Sacerdotes",
  91: "La Evolución de la Oración",
  92: "La Evolución Ulterior de la Religión",
  93: "Maquiventa Melquisedek",
  94: "Las Enseñanzas de Melquisedek en el Oriente",
  95: "Las Enseñanzas de Melquisedek en el Levante",
  96: "Yahvé — El Dios de los Hebreos",
  97: "Evolución del Concepto de Dios Entre los Hebreos",
  98: "Las Enseñanzas de Melquisedek en el Occidente",
  99: "Los Problemas Sociales de la Religión",
  100: "La Religión en la Experiencia Humana",
  101: "La Verdadera Naturaleza de la Religión",
  102: "Los Cimientos de la Fe Religiosa",
  103: "La Realidad de la Experiencia Religiosa",
  104: "El Crecimiento del Concepto de la Trinidad",
  105: "La Deidad y la Realidad",
  106: "Los Niveles de la Realidad en el Universo",
  107: "El Origen y la Naturaleza de los Ajustadores del Pensamiento",
  108: "La Misión y el Ministerio de los Ajustadores del Pensamiento",
  109: "La Relación de los Ajustadores con las Criaturas del Universo",
  110: "La Relación de los Ajustadores con los Seres Mortales",
  111: "El Ajustador y el Alma",
  112: "La Sobrevivencia de la Personalidad",
  113: "Los Guardianes Seráficos del Destino",
  114: "El Gobierno Planetario Seráfico",
  115: "El Ser Supremo",
  116: "El Supremo Todopoderoso",
  117: "Dios el Supremo",
  118: "El Supremo y el Ultimo — El Tiempo y el Espacio",
  119: "Los Autootorgamientos de Cristo Micael",
  120: "El Autootorgamiento de Micael en Urantia",
  121: "Los Tiempos del Autootorgamiento de Micael",
  122: "El Nacimiento y la Infancia de Jesús",
  123: "La Infancia de Jesús",
  124: "La Niñez Posterior de Jesús",
  125: "Jesús en Jerusalén",
  126: "Los Dos Años Cruciales",
  127: "Los Años de la Adolescencia",
  128: "Los Primeros Años de la Vida Adulta de Jesús",
  129: "La Vida Adulta de Jesús",
  130: "En el Camino a Roma",
  131: "Las Religiones del Mundo",
  132: "La Estadía en Roma",
  133: "El Regreso de Roma",
  134: "Los Años de Transición",
  135: "Juan el Bautista",
  136: "El Bautismo y los Cuarenta Días",
  137: "El Tiempo de Espera en Galilea",
  138: "La Capacitación de los Mensajeros del Reino",
  139: "Los Doce Apóstoles",
  140: "La Ordenación de los Doce",
  141: "El Comienzo de la Obra Pública",
  142: "La Pascua en Jerusalén",
  143: "De Paso por Samaria",
  144: "En Gilboa y en la Decápolis",
  145: "Cuatro Días Memorables en Capernaum",
  146: "La Primera Gira de Predicación en Galilea",
  147: "El Interludio en Jerusalén",
  148: "La Capacitación de los Evangelistas en Betsaida",
  149: "La Segunda Gira de Predicación",
  150: "La Tercera Gira de Predicación",
  151: "La Estadía y la Enseñanza Junto al Mar",
  152: "Los Acontecimientos que Condujeron a la Crisis de Capernaum",
  153: "La Crisis en Capernaum",
  154: "Los Últimos Días en Capernaum",
  155: "La Huida por la Galilea del Norte",
  156: "La Estadía en Tiro y Sidón",
  157: "En Cesarea de Filipo",
  158: "El Monte de la Transfiguración",
  159: "La Gira por la Decápolis",
  160: "Rodán de Alejandría",
  161: "Las Conversaciones Ulteriores con Rodán",
  162: "En la Fiesta de los Tabernáculos",
  163: "La Ordenación de los Setenta en Magadán",
  164: "En la Fiesta de la Consagración del Templo",
  165: "Comienza la Misión de Perea",
  166: "La Última Visita al Norte de Perea",
  167: "La Visita a Filadelfia",
  168: "La Resurrección de Lázaro",
  169: "La Última Enseñanza en Pella",
  170: "El Reino del Cielo",
  171: "Camino a Jerusalén",
  172: "La Entrada a Jerusalén",
  173: "El Lunes en Jerusalén",
  174: "Martes por la Mañana en el Templo",
  175: "El Último Discurso en el Templo",
  176: "El Anochecer del Martes en el Monte de los Olivos",
  177: "El Miércoles, Día de Descanso",
  178: "El Último Día en el Campamento",
  179: "La Última Cena",
  180: "El Discurso de Despedida",
  181: "Las Advertencias y Admoniciones Finales",
  182: "En Getsemaní",
  183: "La Traición y el Arresto de Jesús",
  184: "Ante el Tribunal del Sanedrín",
  185: "El Juicio Ante Pilato",
  186: "Poco Antes de la Crucifixión",
  187: "La Crucifixión",
  188: "El Período en la Tumba",
  189: "La Resurrección",
  190: "Las Apariciones Morontiales de Jesús",
  191: "Las Apariciones a los Apóstoles y a Otros Líderes",
  192: "Las Apariciones en Galilea",
  193: "Las Apariciones Finales y la Ascensión",
  194: "El Advenimiento del Espíritu de la Verdad",
  195: "Después de Pentecostés",
  196: "La Fe de Jesús"
};

// Read the urantia-papers.json file
const urantiaPapersPath = path.join(process.cwd(), 'src/locales/es/content/urantia-papers.json');
console.log('Reading urantia-papers.json...');
const urantiaPapers = JSON.parse(fs.readFileSync(urantiaPapersPath, 'utf8'));

// Update titles
let updatedCount = 0;
for (let i = 0; i <= 196; i++) {
  const paperKey = `paper_${i}`;
  const correctTitle = correctTitles[i];
  
  if (urantiaPapers[paperKey] && correctTitle) {
    const oldTitle = urantiaPapers[paperKey].title;
    if (oldTitle !== correctTitle) {
      urantiaPapers[paperKey].title = correctTitle;
      updatedCount++;
      console.log(`Updated ${paperKey}: "${oldTitle}" → "${correctTitle}"`);
    }
  } else if (!urantiaPapers[paperKey]) {
    console.warn(`Warning: No data found for ${paperKey}`);
  } else if (!correctTitle) {
    console.warn(`Warning: No correct title found for paper ${i}`);
  }
}

// Write the updated file
console.log(`\nWriting updated urantia-papers.json...`);
fs.writeFileSync(urantiaPapersPath, JSON.stringify(urantiaPapers, null, 2), 'utf8');

console.log(`\nSuccessfully updated ${updatedCount} titles in urantia-papers.json!`);

// Now also update the series-metadata.json file
console.log('\nUpdating series-metadata.json...');
const seriesMetadataPath = path.join(process.cwd(), 'src/locales/es/content/series-metadata.json');
const seriesMetadata = JSON.parse(fs.readFileSync(seriesMetadataPath, 'utf8'));

// Create episodes array with all 197 papers and correct titles
const episodes = [];
for (let i = 0; i <= 196; i++) {
  const correctTitle = correctTitles[i];
  if (correctTitle) {
    episodes.push({
      id: i + 1, // episode IDs start at 1
      title: correctTitle
    });
  }
}

// Update the urantia-papers entry in series-metadata.json
seriesMetadata['urantia-papers'] = {
  seriesTitle: "El Podcast de los Documentos de Urantia",
  seriesDescription: "Disfruta de un viaje narrativo a través del Libro de Urantia, un documento a la vez.",
  episodes: episodes
};

// Write the updated file
console.log(`Writing updated series-metadata.json with ${episodes.length} episodes...`);
fs.writeFileSync(seriesMetadataPath, JSON.stringify(seriesMetadata, null, 2), 'utf8');

console.log('Successfully updated both files!');
console.log(`Total: ${episodes.length} episodes with correct Spanish titles.`); 