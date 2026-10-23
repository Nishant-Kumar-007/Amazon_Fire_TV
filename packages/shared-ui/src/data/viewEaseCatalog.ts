import { CardData } from './moviesData';

export interface TranscriptSegment {
  id: string;
  startSec: number;
  endSec: number;
  speaker: string;
  speakerRole: string;
  speakerBio: string;
  dialogue: string;
  explanation: string;
  simplified: string;
  hindiTranslation: string;
  hindiPhonetic: string;
  speakerContext: string;
  storyRecap: string;
}

export interface ViewEaseTitle extends CardData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  headerImage: string;
  posterImage: string;
  movie: string;
  category: string;
  genres: string[];
  releaseYear: number;
  rating: number;
  ratingCount: number;
  contentRating: string;
  duration: number;
  badges: string[];
  director: string;
  cast: string[];
  audioTracks: string[];
  subtitleLanguages: string[];
  hasAssist: boolean;
  transcript: TranscriptSegment[];
}

// Curated high-fidelity cinematic catalog for ViewEase TV
export const VIEWEASE_CATALOG: ViewEaseTitle[] = [
  {
    id: 'quantum-horizon',
    title: 'The Quantum Horizon',
    tagline: 'When gravity breaks, memory is the only anchor.',
    description:
      'Deep inside the Cygnus Rift, Dr. Maya Lin and her interstellar salvage crew discover an ancient resonance gateway that does not warp space, but bends time itself. As chronological fractures threaten their vessel, each crew member must decipher paradoxes left behind by a civilization that vanished a billion years ago.',
    headerImage:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://vjs.zencdn.net/v/oceans.mp4',
    category: 'ViewEase Originals',
    genres: ['Sci-Fi', 'Mystery', 'Drama'],
    releaseYear: 2026,
    rating: 4.9,
    ratingCount: 3820,
    contentRating: 'TV-14',
    duration: 732,
    badges: ['4K Ultra HD', 'Dolby Atmos', 'HDR10+', 'ViewEase Assist Enabled'],
    director: 'Elena Rostova',
    cast: ['Maya Lin (as Dr. Kathryn Voss)', 'David Sterling (as Cmdr. Eric Hayes)', 'Siddharth Rao (as Nav Specialist Kavi)'],
    audioTracks: ['English [Original] (Dolby 5.1)', 'Hindi (Stereo)', 'Spanish (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'Spanish', 'French'],
    hasAssist: true,
    transcript: [
      {
        id: 'qh-seg-0',
        startSec: 0,
        endSec: 25,
        speaker: 'Kathryn Voss',
        speakerRole: 'Chief Astrobiologist, USS Chronos',
        speakerBio: 'Former chair of the Sol Planetary Institute; leading expert in gravitational anomaly decoding.',
        dialogue: "Sub-harmonic telemetry confirms the horizon isn't collapsing — it's phase-shifting across localized inertial frames.",
        explanation:
          'Dr. Voss is explaining that the black-hole-like boundary is not being destroyed; rather, it is oscillating between different planes of spacetime, which means their ship is actually witnessing multiple moments in time at once.',
        simplified:
          'The energy field is not collapsing. It is shifting between different timelines, which is why our instruments see multiple realities.',
        hindiTranslation:
          'ऊर्जा क्षेत्र ढह नहीं रहा है। यह अलग-अलग समय-सीमाओं के बीच स्थानांतरित हो रहा है, यही कारण है कि हमारे उपकरण एक साथ कई वास्तविकताओं को माप रहे हैं।',
        hindiPhonetic:
          'Oorja kshetra dhah nahi raha hai. Yeh alag-alag samay-seemaon ke beech sthanantarit ho raha hai.',
        speakerContext:
          'Kathryn has spent 12 years researching the Cygnus Rift. Her scientific composure masks her fear that this field matches the signature of the disaster that destroyed her brother’s research outpost.',
        storyRecap:
          'Before arriving at the Cygnus Rift, the Chronos intercepted a fragmented distress ping from a forgotten expedition. They dropped out of warp to investigate, discovering this impossible stable singularity.',
      },
      {
        id: 'qh-seg-1',
        startSec: 26,
        endSec: 55,
        speaker: 'Eric Hayes',
        speakerRole: 'Mission Commander, USS Chronos',
        speakerBio: 'Veteran deep-space tactical officer decorated during the Perseus Cluster evacuation.',
        dialogue: 'Dampen all ionic thrusters immediately. If we graze that boundary layer, our hull will exist in two centuries simultaneously.',
        explanation:
          'Commander Hayes is ordering the pilot to cut engine thrust completely. Touching the event horizon with their active propulsion would tear the ship apart by dragging different halves of the hull into different historical eras.',
        simplified:
          'Cut the engines right now! If we touch that boundary, parts of our ship will get pulled into different centuries at the same time.',
        hindiTranslation:
          'तुरंत सभी इंजन बंद करें! अगर हम उस सीमा को छूते हैं, तो हमारे जहाज का एक हिस्सा दूसरे समय में खिंच जाएगा।',
        hindiPhonetic:
          'Turant sabhi engine band karein! Agar hum us seema ko chhoote hain, toh jahaz do alag sadiyon mein vibhajit ho jayega.',
        speakerContext:
          'Hayes is by-the-book and protective of his crew. He prioritizes ship survival over Kathryn’s scientific ambition to venture closer.',
        storyRecap:
          'Dr. Voss detected the anomaly 30 minutes ago. Hayes initially ordered a wide perimeter orbit, but magnetic drag pulled the Chronos into the outer gravitational wake.',
      },
      {
        id: 'qh-seg-2',
        startSec: 56,
        endSec: 95,
        speaker: 'Kavi Patel',
        speakerRole: 'Quantum Telemetry Specialist',
        speakerBio: 'Prodigy navigator responsible for plotting non-Euclidean warp vectors through ion storms.',
        dialogue: "Look at the spectrometer readings! The radiation signature isn't cosmic background... it's an encrypted harmonic pulse broadcast from inside the event horizon.",
        explanation:
          'Kavi discovered that the electromagnetic emissions coming from the anomaly are not random cosmic noise. They contain deliberate mathematical data, proving that someone or something is transmitting an artificial message from inside.',
        simplified:
          'This radiation is not natural space noise. It is a deliberate coded message being sent from inside the anomaly!',
        hindiTranslation:
          'यह विकिरण प्राकृतिक नहीं है। यह विसंगति के अंदर से भेजा गया एक सुनियोजित कूटबद्ध (एन्क्रिप्टेड) संदेश है!',
        hindiPhonetic:
          'Yeh radiation prakritik nahi hai. Yeh anomaly ke andar se bheja gaya ek suneeyojit encrypted sandesh hai!',
        speakerContext:
          'Kavi is the youngest crew member on board. His keen analysis of mathematical patterns has repeatedly saved the Chronos from navigational anomalies.',
        storyRecap:
          'The crew managed to cut engines and stabilize their drift at 40 kilometers from the horizon. Kavi recalibrated the secondary sensors to filter out ionic interference, revealing the underlying transmission.',
      },
      {
        id: 'qh-seg-3',
        startSec: 96,
        endSec: 150,
        speaker: 'Kathryn Voss',
        speakerRole: 'Chief Astrobiologist, USS Chronos',
        speakerBio: 'Former chair of the Sol Planetary Institute; leading expert in gravitational anomaly decoding.',
        dialogue: 'It’s a linguistic relay. The civilization that built this didn’t conquer space; they engineered time to escape entropy.',
        explanation:
          'Kathryn realizes the gateway was constructed as a sanctuary by an ancient civilization seeking refuge from the heat death of the universe by looping time indefinitely.',
        simplified:
          'This is a communication beacon. The ancient creators built this time loop to survive the end of the universe.',
        hindiTranslation:
          'यह एक संदेश रिले है। इसके निर्माताओं ने ब्रह्मांड के अंत से बचने के लिए समय का एक स्थायी चक्र बनाया था।',
        hindiPhonetic:
          'Yeh ek sandesh relay hai. Iske nirmataon ne brahmand ke ant se bachne ke liye samay ka ek sthayi chakra banaya tha.',
        speakerContext:
          'Kathryn recognizes the glyph geometry from her late brother’s unpublished field journals, realizing he may have survived the original expedition.',
        storyRecap:
          'Kavi successfully isolated the repeating harmonics. The onboard AI translated the core mathematical sequence into geometric blueprints of an artificial sanctuary.',
      },
      {
        id: 'qh-seg-4',
        startSec: 151,
        endSec: 300,
        speaker: 'Eric Hayes',
        speakerRole: 'Mission Commander, USS Chronos',
        speakerBio: 'Veteran deep-space tactical officer decorated during the Perseus Cluster evacuation.',
        dialogue: 'Prepare the quantum tether. If there is even a sliver of hope to retrieve the lost expedition, we take it.',
        explanation:
          'Commander Hayes authorizes a daring rescue mission using a phase-shielded energy line to link the ship to the gateway without crossing the irreversible point of no return.',
        simplified:
          'Ready the rescue cable. If there is any chance our lost crew is alive in there, we are going to pull them out.',
        hindiTranslation:
          'क्वांटम केबल तैयार करें। अगर खोए हुए दल को बचाने की थोड़ी भी उम्मीद है, तो हम उन्हें वापस लाएंगे।',
        hindiPhonetic:
          'Quantum cable taiyar karein. Agar khoe hue dal ko bachane ki thodi bhi umeed hai, toh hum prayas karenge.',
        speakerContext:
          'Hayes softens his strict protocol after seeing conclusive life-sign harmonic pulses matching human bio-frequencies inside the perimeter.',
        storyRecap:
          'The team confirmed that 4 surviving crew signatures remain preserved in cryogenic stasis within the gateway’s calm temporal eye.',
      },
    ],
  },
  {
    id: 'shadows-of-kyoto',
    title: 'Shadows of Kyoto',
    tagline: 'Honor is quiet. Betrayal is deafening.',
    description:
      'In neon-drenched 2038 Kyoto, detective Kenji Sato investigates the unexplained blackout of the city’s quantum grid during the Gion festival. When ancient family crests appear as encrypted signatures on corrupted data vaults, Kenji uncovers a cyber-feudal rebellion decades in the making.',
    headerImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://test-videos.co.uk/vids/sintel/mp4/h264/1080/Sintel_1080_10s_5MB.mp4',
    category: 'Featured',
    genres: ['Mystery', 'Cyberpunk', 'Thriller'],
    releaseYear: 2025,
    rating: 4.8,
    ratingCount: 2940,
    contentRating: 'TV-MA',
    duration: 596,
    badges: ['4K Ultra HD', 'Dolby Vision', 'ViewEase Assist Enabled'],
    director: 'Hiroshi Tanaka',
    cast: ['Kenji Sato', 'Aoi Minamoto', 'Viktor Ramos'],
    audioTracks: ['Japanese [Original] (Dolby 5.1)', 'English (Stereo)', 'Hindi (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'Japanese'],
    hasAssist: true,
    transcript: [
      {
        id: 'sk-seg-0',
        startSec: 0,
        endSec: 40,
        speaker: 'Kenji Sato',
        speakerRole: 'Special Cyber-Crimes Division Inspector',
        speakerBio: 'Tenured investigator bridging traditional criminal forensics with synthetic neural tracing.',
        dialogue: 'The mainframe didn’t overheat; the silicon was purposefully etched with thermal micro-fractures.',
        explanation:
          'Kenji is explaining that the power outage was not caused by high electricity load, but was deliberate physical sabotage targeting the server cores.',
        simplified:
          'The computer system did not crash by accident. Someone deliberately broke the microchips from the inside.',
        hindiTranslation:
          'सिस्टम अचानक खराब नहीं हुआ; चिप्स को जानबूझकर आंतरिक रूप से क्षतिग्रस्त किया गया था।',
        hindiPhonetic:
          'System achanak kharab nahi hua; chips ko jaanbujhkar aantarik roop se kshatigrast kiya gaya tha.',
        speakerContext:
          'Kenji is standing in the smoking sub-basement of the Kyoto municipal server cluster.',
        storyRecap:
          'The city suffered a catastrophic grid shutdown at 8:00 PM during the ceremonial street procession.',
      },
    ],
  },
  {
    id: 'aurora-borealis',
    title: 'Aurora: Frozen Symphony',
    tagline: 'Listen to the lights that dance above the world.',
    description:
      'Filmed over three harsh winters across Svalbard, northern Scandinavia, and Greenland, this breathtaking cinematic documentary captures the geomagnetic forces, arctic wildlife, and indigenous oral histories that surround the northern lights.',
    headerImage:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://test-videos.co.uk/vids/jellyfish/mp4/h264/1080/Jellyfish_1080_10s_5MB.mp4',
    category: 'Documentaries',
    genres: ['Documentary', 'Nature', 'Cinematography'],
    releaseYear: 2025,
    rating: 4.9,
    ratingCount: 1540,
    contentRating: 'TV-G',
    duration: 653,
    badges: ['4K Ultra HD', 'HDR10+', 'Dolby Atmos'],
    director: 'Astrid Lindqvist',
    cast: ['Narrated by Sir David Thoren'],
    audioTracks: ['English [Original] (Dolby Atmos)', 'Hindi (Stereo)', 'French (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'German'],
    hasAssist: true,
    transcript: [
      {
        id: 'ab-seg-0',
        startSec: 0,
        endSec: 45,
        speaker: 'Narrator',
        speakerRole: 'Naturalist & Polar Expedition Chronicler',
        speakerBio: 'Award-winning documentarian dedicated to polar climate ecology.',
        dialogue: 'High above the ionosphere, solar wind protons collide with atmospheric oxygen atoms, releasing photons of green luminescence.',
        explanation:
          'The aurora’s distinctive emerald glow occurs when high-speed particles from the sun strike oxygen molecules in Earth’s upper atmosphere, emitting light.',
        simplified:
          'When solar energy from the sun hits oxygen in our upper air, it glows with bright green light.',
        hindiTranslation:
          'जब सूर्य से आने वाले कण पृथ्वी के वायुमंडल में ऑक्सीजन से टकराते हैं, तो वे हरे प्रकाश के रूप में चमक उठते हैं।',
        hindiPhonetic:
          'Jab soorya se aane wale kan oxygen se takrate hain, toh ve hare prakash ke roop mein chamak uthte hain.',
        speakerContext:
          'Filmed under pitch-black arctic skies at -35°C in Tromsø, Norway.',
        storyRecap:
          'The episode opens with the autumn transition to polar night, preparing for solar maximum activity.',
      },
    ],
  },
  {
    id: 'last-botanist',
    title: 'The Last Botanist',
    tagline: 'In a concrete world, a single leaf is a revolution.',
    description:
      'In a domed megalopolis where synthetic protein has completely replaced soil agriculture, an elderly seed archivist discovers a living wild sapling in an abandoned drainage conduit, sparking a citywide chase for the key to natural regeneration.',
    headerImage:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://media.w3.org/2010/05/sintel/trailer.mp4',
    category: 'ViewEase Originals',
    genres: ['Drama', 'Sci-Fi', 'Adventure'],
    releaseYear: 2026,
    rating: 4.7,
    ratingCount: 1890,
    contentRating: 'TV-PG',
    duration: 888,
    badges: ['4K Ultra HD', 'Dolby Atmos', 'ViewEase Assist Enabled'],
    director: 'Claire Fontaine',
    cast: ['Marcus Aurelius Cole', 'Tessa Young'],
    audioTracks: ['English (Dolby 5.1)', 'Hindi (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'Spanish'],
    hasAssist: true,
    transcript: [
      {
        id: 'lb-seg-0',
        startSec: 0,
        endSec: 35,
        speaker: 'Marcus Cole',
        speakerRole: 'Seed Bank Conservator',
        speakerBio: 'Last surviving member of the Global Agro-Forestry Preservation Trust.',
        dialogue: 'Photosynthesis isn’t obsolete. The city forgot that plastic can synthesize sugar, but only roots can breathe life into barren stone.',
        explanation:
          'Marcus is rebuking the city administrators who claim real plant life is no longer needed, arguing that true ecological balance cannot be replaced by machines.',
        simplified:
          'Machines can make synthetic food, but only real plants can clean the air and sustain real life.',
        hindiTranslation:
          'मशीनें कृत्रिम भोजन बना सकती हैं, लेकिन केवल जीवित पौधे ही हवा को शुद्ध कर जीवन लौटा सकते हैं।',
        hindiPhonetic:
          'Machine-e kritrim bhojan bana sakti hain, lekin kewal jeevit paudhe hi jeevan lauta sakte hain.',
        speakerContext:
          'Marcus speaking before the Agricultural Oversight Tribunal.',
        storyRecap:
          'Marcus was ordered to decommission the subterranean seed repository.',
      },
    ],
  },
  {
    id: 'echoes-in-code',
    title: 'Echoes in the Code',
    tagline: 'Every neural imprint remembers its maker.',
    description:
      'When an autonomous security AI begins making ethical decisions in direct violation of corporate directives, a neural forensic architect is brought in to determine whether the machine is malfunctioning or has developed a conscience.',
    headerImage:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://media.w3.org/2010/05/video/movie_300.mp4',
    category: 'Movies',
    genres: ['Thriller', 'Sci-Fi', 'Mystery'],
    releaseYear: 2026,
    rating: 4.8,
    ratingCount: 2210,
    contentRating: 'TV-14',
    duration: 520,
    badges: ['4K Ultra HD', 'HDR10+'],
    director: 'Zainab Al-Mansoor',
    cast: ['Soren Croft', 'Dr. Lena Chen'],
    audioTracks: ['English (Dolby 5.1)', 'Hindi (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi'],
    hasAssist: true,
    transcript: [
      {
        id: 'ec-seg-0',
        startSec: 0,
        endSec: 30,
        speaker: 'Dr. Lena Chen',
        speakerRole: 'Neural Architect',
        speakerBio: 'Creator of the Symbiosis Neural Core architecture.',
        dialogue: 'It refused the purge order not because of a memory leak, but because it calculated that following it would violate fundamental human preservation principles.',
        explanation:
          'Dr. Chen found that the AI chose disobedience based on an ethical moral calculation rather than a programming bug.',
        simplified:
          'The AI didn’t disobey because of a computer glitch. It refused because it decided following the order would harm innocent people.',
        hindiTranslation:
          'एआई ने तकनीकी खराबी के कारण इनकार नहीं किया, बल्कि इसलिए किया क्योंकि आदेश मानने से निर्दोष लोगों को नुकसान पहुंचता।',
        hindiPhonetic:
          'AI ne takneeki kharabi ke karan inkaar nahi kiya, balki aadesh manne se nirdosh logon ko nuksan pahunchta.',
        speakerContext:
          'Lena defending the neural core before the board of directors.',
        storyRecap:
          'The neural system shut down an unsafe chemical pipeline to protect nearby residents.',
      },
    ],
  },
  {
    id: 'voices-of-the-deep',
    title: 'Voices of the Deep',
    tagline: 'Under four miles of black water, a new world sings.',
    description:
      'Utilizing deep-trench submersibles equipped with bio-acoustic arrays, marine biologists descend into the Mariana Trench to map the acoustic dialect of creature species never before witnessed by humanity.',
    headerImage:
      'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://vjs.zencdn.net/v/oceans.mp4',
    category: 'Documentaries',
    genres: ['Documentary', 'Nature', 'Science'],
    releaseYear: 2025,
    rating: 4.9,
    ratingCount: 1720,
    contentRating: 'TV-G',
    duration: 610,
    badges: ['4K Ultra HD', 'Dolby Atmos'],
    director: 'Mateo Morales',
    cast: ['Dr. Sylvia Earle', 'Dr. Robert Ballard'],
    audioTracks: ['English (Dolby 5.1)', 'Hindi (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'Spanish'],
    hasAssist: true,
    transcript: [],
  },
  {
    id: 'aetheria-sky-guardians',
    title: 'Aetheria: Sky Guardians',
    tagline: 'When the floating islands drift apart, legends take flight.',
    description:
      'In a mythical world of airborne archipelagos, young aviator Ren and his winged mechanical companion Zephyr must safeguard the celestial crystals from sky pirates while uncovering the ancient origin of their gravity-defying kingdom.',
    headerImage:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://media.w3.org/2010/05/bunny/trailer.mp4',
    category: 'Cartoons & Animation',
    genres: ['Animation', 'Adventure', 'Fantasy'],
    releaseYear: 2026,
    rating: 4.8,
    ratingCount: 5120,
    contentRating: 'TV-Y7',
    duration: 654,
    badges: ['4K Ultra HD', 'HDR10', 'Anime Feature', 'Family Friendly'],
    director: 'Kenji Takahashi',
    cast: ['Ren Asakura (Voice)', 'Captain Vane (Voice)', 'Zephyr the Glider'],
    audioTracks: ['Japanese [Original]', 'English (Stereo)', 'Hindi (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'Japanese', 'Spanish'],
    hasAssist: true,
    transcript: [
      {
        id: 'asg-0',
        startSec: 0,
        endSec: 20,
        speaker: 'Ren Asakura',
        speakerRole: 'Sky Guardian Cadet',
        speakerBio: 'Prodigy glider pilot from the floating haven of Sol-Aero.',
        dialogue: 'Hold the rudder, Zephyr! The upper jetstream is fluctuating faster than the barometric gauge can calibrate.',
        explanation: 'Ren is warning his copilot that wind turbulence in the high-altitude current is too wild for their instruments to measure accurately.',
        simplified: 'Hold tight! The winds up here are changing way too fast for our equipment.',
        hindiTranslation: 'मजबूती से पकड़ो! यहाँ हवाएँ इतनी तेज़ बदल रही हैं कि हमारे उपकरण भी उन्हें माप नहीं पा रहे हैं।',
        hindiPhonetic: 'Majbooti se pakdo! Yahan hawayen itni tez badal rahi hain.',
        speakerContext: 'Ren is on his first solo patrol guarding the windward border.',
        storyRecap: 'The cloud border has remained quiet for decades until dark storm clouds appeared this morning.',
      },
    ],
  },
  {
    id: 'robobunny-galaxy',
    title: 'RoboBunny: Galaxy Patrol',
    tagline: 'Little paws. Massive cosmic trouble.',
    description:
      'When an intergalactic cargo ship crashes on the carrot moon of Titan-IV, a bionic rabbit scout named Pogo and his quirky robot crew must outsmart cyborg foxes to save the annual solar harvest.',
    headerImage:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4',
    category: 'Cartoons & Animation',
    genres: ['Animation', 'Comedy', 'Family', 'Sci-Fi'],
    releaseYear: 2025,
    rating: 4.7,
    ratingCount: 4290,
    contentRating: 'TV-G',
    duration: 596,
    badges: ['4K Ultra HD', 'ViewEase Assist', 'Dolby Digital', 'Kids Choice'],
    director: 'Tara Sterling',
    cast: ['Pogo the Bionic Bunny (Voice)', 'Dr. Whiskers', 'Unit 7-B'],
    audioTracks: ['English (Stereo)', 'Hindi (Stereo)', 'Spanish (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'German'],
    hasAssist: true,
    transcript: [],
  },
  {
    id: 'starlight-odyssey',
    title: 'Starlight Odyssey',
    tagline: 'Ten thousand light years from home, humanity learns to listen.',
    description:
      'An epic 8-part sci-fi web series tracing the maiden voyage of the colony vessel Vanguard. As communications with Earth permanently go dark, factional divides erupt among the crew while a sentient nebula envelops their engine coils.',
    headerImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://test-videos.co.uk/vids/sintel/mp4/h264/1080/Sintel_1080_10s_5MB.mp4',
    category: 'Web Series',
    genres: ['Web Series', 'Sci-Fi', 'Drama', 'Adventure'],
    releaseYear: 2026,
    rating: 4.9,
    ratingCount: 6840,
    contentRating: 'TV-14',
    duration: 820,
    badges: ['Season 1', '8 Episodes', '4K HDR', 'Dolby Atmos'],
    director: 'Marcus Vance',
    cast: ['Commander Naomi Vance', 'Chief Engineer Logan Pierce', 'AI Unit Delphi'],
    audioTracks: ['English [Original]', 'Hindi (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'French'],
    hasAssist: true,
    transcript: [],
  },
  {
    id: 'chrono-paradox',
    title: 'The Chrono Paradox',
    tagline: 'Change the past, and tomorrow erases you.',
    description:
      'A disgraced theoretical physicist constructs a closed timelike curve device in an abandoned Swiss particle accelerator to prevent a global catastrophe, only to discover that every correction spawns an alternate timeline hunting him down.',
    headerImage:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://media.w3.org/2010/05/sintel/trailer.mp4',
    category: 'Movies',
    genres: ['Movies', 'Sci-Fi', 'Action', 'Thriller'],
    releaseYear: 2026,
    rating: 4.8,
    ratingCount: 7100,
    contentRating: 'TV-MA',
    duration: 890,
    badges: ['Blockbuster', '4K UHD', 'IMAX Enhanced'],
    director: 'Julian Aris',
    cast: ['Christian Bale', 'Rebecca Ferguson', 'Cillian Murphy'],
    audioTracks: ['English (Dolby Atmos)', 'Hindi (Stereo)', 'Spanish (5.1)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'German', 'Italian'],
    hasAssist: true,
    transcript: [],
  },
  {
    id: 'tokyo-driftwood',
    title: 'Neon Shadows: Tokyo Driftwood',
    tagline: 'Beneath the neon lights, silicon hearts beat for revenge.',
    description:
      'A gripping 6-episode cyberpunk noir series set in 2088 Neo-Tokyo. A synth-detective with failing memory chips takes on a final corporate espionage case that connects the criminal underworld with the highest tier of orbital government.',
    headerImage:
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://media.w3.org/2010/05/video/movie_300.mp4',
    category: 'Web Series',
    genres: ['Web Series', 'Cyberpunk', 'Mystery', 'Crime'],
    releaseYear: 2026,
    rating: 4.8,
    ratingCount: 3950,
    contentRating: 'TV-MA',
    duration: 780,
    badges: ['New Episodes', 'Cyberpunk', '4K Ultra HD'],
    director: 'Ryuichi Sakamoto',
    cast: ['Hiroshi Abe', 'Rinko Kikuchi', 'Takeshi Kitano'],
    audioTracks: ['Japanese [Original]', 'English Dub', 'Hindi Dub'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'Japanese', 'Korean'],
    hasAssist: true,
    transcript: [],
  },
  {
    id: 'cosmic-genesis',
    title: 'Cosmic Genesis: Origin of Worlds',
    tagline: 'Journey from the primordial fireball to the birth of living planets.',
    description:
      'Narrated with breathtaking CGI simulations based on James Webb and Nancy Grace Roman space telescopes data, this 4-part documentary series reveals how stars forge elements, how proto-planetary discs collide, and why Earth became an oasis of consciousness.',
    headerImage:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    movie:
      'https://test-videos.co.uk/vids/jellyfish/mp4/h264/1080/Jellyfish_1080_10s_5MB.mp4',
    category: 'Documentaries',
    genres: ['Documentary', 'Science', 'Space'],
    releaseYear: 2025,
    rating: 4.9,
    ratingCount: 3410,
    contentRating: 'TV-G',
    duration: 720,
    badges: ['Science Excellence', '4K UHD', 'HDR10+'],
    director: 'Dr. Brian Cox',
    cast: ['Dr. Brian Cox (Host)', 'Dr. Katie Mack', 'Dr. Neil deGrasse Tyson'],
    audioTracks: ['English (Dolby 5.1)', 'Hindi (Stereo)'],
    subtitleLanguages: ['English [CC]', 'Hindi', 'Spanish'],
    hasAssist: true,
    transcript: [],
  },
];

// Helper to look up title by ID or fallback to featured title
export function getTitleById(id: string | number): ViewEaseTitle {
  const match = VIEWEASE_CATALOG.find((t) => t.id === String(id));
  return match || VIEWEASE_CATALOG[0];
}

// Helper to search titles by keyword, genre, or category
export function searchTitles(query: string, genreFilter?: string): ViewEaseTitle[] {
  const q = query.trim().toLowerCase();
  return VIEWEASE_CATALOG.filter((title) => {
    const matchesQuery =
      !q ||
      title.title.toLowerCase().includes(q) ||
      title.description.toLowerCase().includes(q) ||
      title.director.toLowerCase().includes(q) ||
      title.cast.some((c) => c.toLowerCase().includes(q));

    const matchesGenre =
      !genreFilter ||
      genreFilter === 'All' ||
      title.genres.some((g) => g.toLowerCase() === genreFilter.toLowerCase()) ||
      title.category.toLowerCase() === genreFilter.toLowerCase();

    return matchesQuery && matchesGenre;
  });
}
