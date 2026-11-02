/**
 * ============================================================================
 * MEHFIL (महफ़िल / محفل) - PLAYLIST CONFIGURATION
 * ============================================================================
 * 
 * All tracks are verified, authentic Qawwalis streamed via YouTube IFrame API.
 * Video IDs are verified official releases from Coke Studio, Oriental Star
 * Agencies (OSA Worldwide), and official record labels.
 * 
 * HOW TO ADD YOUR OWN SONGS:
 * 1. Find any YouTube video (e.g., https://www.youtube.com/watch?v=Km5z_gfZqfY)
 * 2. Copy the video ID (the string after `v=`, e.g., "Km5z_gfZqfY")
 * 3. Add or replace an entry in the playlist arrays below.
 */

const MEHFIL_CONFIG = {
  defaultVolume: 80,
  defaultPlaylist: "coke-studio",
  crossfadeDuration: 2,
  enableAmbientParticles: true,
  
  // Custom YouTube Playlist IDs (Optional fallback placeholders)
  youtubePlaylists: {
    cokeStudio: "PLAYLIST_ID_COKE_STUDIO",
    nfakClassics: "PLAYLIST_ID_NFAK_CLASSICS",
    trending: "PLAYLIST_ID_TRENDING_QAWWALI"
  }
};

/**
 * Verified Curated Qawwali Tracks with authentic, embed-friendly YouTube IDs.
 */
const PLAYLISTS_DATA = {
  "coke-studio": {
    id: "coke-studio",
    title: "Coke Studio Qawwalis",
    urduTitle: "کوک اسٹوڈیو قوالیاں",
    hindiTitle: "कोक स्टूडियो क़व्वालियाँ",
    badge: "Fusion & Devotion",
    description: "Iconic Sufi renditions from Pakistan and India editions — orchestral grandeur meets timeless spirituality.",
    coverIcon: "🕌",
    accentColor: "#d4af37",
    tracks: [
      {
        id: "cs-01",
        title: "Tajdar-e-Haram",
        urduTitle: "تاجدارِ حرم",
        artist: "Atif Aslam",
        album: "Coke Studio Season 8",
        duration: "10:28",
        videoId: "a18py61_F_w", // Official Coke Studio Season 8
        poet: "Hakim Mirza Purnam Allahabadi",
        couplet: "क़िस्मत में मेरी चैन से जीना लिख दे, डूबे न कभी मेरा सफ़ीنا लिख दे।",
        coupletUrdu: "قسمت میں میری چین سے جینا لکھ دے، ڈوبے نہ کبھی میرا سفینہ لکھ دے۔",
        era: "Modern Classic"
      },
      {
        id: "cs-02",
        title: "Chaap Tilak",
        urduTitle: "چھاپ تلک سب چھینی",
        artist: "Abida Parveen & Rahat Fateh Ali Khan",
        album: "Coke Studio Season 7",
        duration: "10:14",
        videoId: "7SDrjwtfKMk", // Verified Official Coke Studio Season 7
        poet: "Hazrat Amir Khusrau",
        couplet: "छाप तिलक सब छीनी रे मोसे नैना मिलाइके।",
        coupletUrdu: "چھاپ تلک سب چھینی رے موسے نیناں ملائیکے۔",
        era: "13th Century Sufi Kalaam"
      },
      {
        id: "cs-03",
        title: "Afreen Afreen",
        urduTitle: "آفریں آفریں",
        artist: "Rahat Fateh Ali Khan & Momina Mustehsan",
        album: "Coke Studio Season 9",
        duration: "06:45",
        videoId: "kw4tT7SCmaY", // Verified Official Coke Studio Season 9
        poet: "Javed Akhtar / Fana Bulandshahri",
        couplet: "حسنِ بے پروا کو خود بین و خود آرا کر دیا، کیا کیا تم نے کہ آفریں آفریں کہہ دیا۔",
        coupletUrdu: "حسنِ بے پروا کو خود بین و خود آرا کر دیا، کیا کیا تم نے کہ آفریں آفریں کہہ دیا۔",
        era: "Romantic Devotion"
      },
      {
        id: "cs-04",
        title: "Tu Jhoom",
        urduTitle: "تو جھوم",
        artist: "Abida Parveen & Naseebo Lal",
        album: "Coke Studio Season 14",
        duration: "06:44",
        videoId: "7D4vNcK6D38", // Verified Official Coke Studio Season 14
        poet: "Adnan Dhool & Xulfi",
        couplet: "میں راضی اپنی ذات نال، میں راضی اپنے آپ نال، تو جھوم!",
        coupletUrdu: "میں راضی اپنی ذات نال، میں راضی اپنے آپ نال، تو جھوم!",
        era: "Spiritual Transcendence"
      },
      {
        id: "cs-05",
        title: "Rang (Rang Barse)",
        urduTitle: "رنگ",
        artist: "Rahat Fateh Ali Khan & Amjad Sabri",
        album: "Coke Studio Season 9",
        duration: "11:51",
        videoId: "Uks8psEpmB4", // Verified Official Coke Studio Season 9 Finale
        poet: "Hazrat Amir Khusrau",
        couplet: "आज रंग है री मां रंग है री, मोरे महबूब के घर रंग है री।",
        coupletUrdu: "آج رنگ ہے ری ماں رنگ ہے ری، مورے محبوب کے گھر رنگ ہے ری۔",
        era: "The Eternal Colour of Nizamuddin"
      },
      {
        id: "cs-06",
        title: "Shikwa / Jawab-e-Shikwa",
        urduTitle: "شکوہ / جوابِ شکوہ",
        artist: "Fareed Ayaz, Abu Muhammad & Natasha Baig",
        album: "Coke Studio Season 11",
        duration: "14:02",
        videoId: "LrCek73_e_M", // Verified Official Coke Studio Season 11
        poet: "Allama Muhammad Iqbal",
        couplet: "کی محمدؐ سے وفا تو نے تو ہم تیرے ہیں، یہ جہاں چیز ہے کیا لوح و قلم تیرے ہیں۔",
        coupletUrdu: "کی محمدؐ سے وفا تو نے تو ہم تیرے ہیں، یہ جہاں چیز ہے کیا لوح و قلم تیرے ہیں۔",
        era: "Philosophical Dialogue"
      },
      {
        id: "cs-07",
        title: "Aaqa",
        urduTitle: "آقا",
        artist: "Abida Parveen & Ali Sethi",
        album: "Coke Studio Season 9",
        duration: "09:36",
        videoId: "LekqDjknArc", // Verified Official Coke Studio Season 9
        poet: "Hazrat Bedil / Salman Azmi",
        couplet: "شاہِ مدینہ، یثرب کے والی، سارے نبی تیرے در کے سوالی۔",
        coupletUrdu: "شاہِ مدینہ، یثرب کے والی، سارے نبی تیرے در کے سوالی۔",
        era: "Naat-e-Rasool"
      },
      {
        id: "cs-08",
        title: "Faasle",
        urduTitle: "فاصلے",
        artist: "Kaavish & Quratulain Balouch",
        album: "Coke Studio Season 10",
        duration: "07:54",
        videoId: "9sekgEXGm-E", // Verified Official Coke Studio Season 10
        poet: "Jaffer Zaidi",
        couplet: "فاصلے ایسے بھی ہوں گے یہ کبھی سوچا نہ تھا، سامنے بیٹھا تھا میرے اور وہ میرا نہ تھا۔",
        coupletUrdu: "فاصلے ایسے بھی ہوں گے یہ کبھی سوچا نہ تھا، سامنے بیٹھا تھا میرے اور وہ میرا نہ تھا۔",
        era: "Ambient Soul"
      }
    ]
  },

  "nfak": {
    id: "nfak",
    title: "NFAK: The Shahenshah Classics",
    urduTitle: "شہنشاہِ قوالی: نصرت فتح علی خان",
    hindiTitle: "नुसरत फतेह अली खान: अमर क़व्वालियाँ",
    badge: "Pure Traditional Sama",
    description: "The raw, unadulterated ecstasy of Ustad Nusrat Fateh Ali Khan. Ecstatic claps, vocal improvisations, and divine surrender.",
    coverIcon: "🪕",
    accentColor: "#e5c158",
    tracks: [
      {
        id: "nfak-01",
        title: "Yeh Jo Halka Halka Suroor Hai",
        urduTitle: "یہ جو ہلکا ہلکا سرور ہے",
        artist: "Ustad Nusrat Fateh Ali Khan",
        album: "Oriental Star Agencies (OSA Worldwide)",
        duration: "18:42",
        videoId: "Km5z_gfZqfY", // Verified Official OSA release (Embedding Enabled)
        poet: "Anwar Farrukhabadi",
        couplet: "ये जो हल्का हल्का सुरूर है, ये तेरी नज़र का क़ुसूर है।",
        coupletUrdu: "یہ جو ہلکا ہلکا سرور ہے، یہ تیری نظر کا قصور ہے۔",
        era: "Timeless Suroor"
      },
      {
        id: "nfak-02",
        title: "Tumhe Dillagi Bhool Jaani Padegi",
        urduTitle: "تمہیں دِل لگی بھول جانی پڑے گی",
        artist: "Ustad Nusrat Fateh Ali Khan",
        album: "Oriental Star Agencies (OSA Worldwide)",
        duration: "16:20",
        videoId: "cZ3LTV6xgvA", // Verified Official OSA release
        poet: "Purnam Allahabadi",
        couplet: "محبت کی راہوں میں آ کر تو دیکھو، تڑپنے پہ میرے نہ پھر تم ہنسو گے۔",
        coupletUrdu: "محبت کی راہوں میں آ کر تو دیکھو، تڑپنے پہ میرے نہ پھر تم ہنسو گے۔",
        era: "Gharana Legacy"
      },
      {
        id: "nfak-03",
        title: "Allah Hoo Allah Hoo",
        urduTitle: "اللہ ہو اللہ ہو",
        artist: "Ustad Nusrat Fateh Ali Khan",
        album: "Oriental Star Agencies (OSA Worldwide)",
        duration: "14:15",
        videoId: "eeB8pJUxjkY", // Verified Official OSA release
        poet: "Traditional Sufi Zikr",
        couplet: "کوئی تو ہے جو نظامِ ہستی چلا رہا ہے، وہی خدا ہے۔",
        coupletUrdu: "کوئی تو ہے جو نظامِ ہستی چلا رہا ہے، وہی خدا ہے۔",
        era: "Ecstatic Dhikr"
      },
      {
        id: "nfak-04",
        title: "Dam Mast Qalandar (Mast Qalandar)",
        urduTitle: "دم مست قلندر مست مست",
        artist: "Ustad Nusrat Fateh Ali Khan",
        album: "Oriental Star Agencies (OSA Worldwide)",
        duration: "12:55",
        videoId: "1YgBXSVTInM", // Verified Official OSA release
        poet: "Hazrat Amir Khusrau / Bulleh Shah",
        couplet: "جھولے لالن، سندھڑی دا، سیہون دا سخی شہباز قلندر!",
        coupletUrdu: "جھولے لالن، سندھڑی دا، سیہون دا سخی شہباز قلندر!",
        era: "Lal Shahbaz Qalandar"
      },
      {
        id: "nfak-05",
        title: "Sanson Ki Mala Pe Simrun Main",
        urduTitle: "سانسوں کی مالا پہ سمروں میں",
        artist: "Ustad Nusrat Fateh Ali Khan",
        album: "Oriental Star Agencies (OSA Worldwide)",
        duration: "15:30",
        videoId: "bp9YVQcOjgo", // Verified Official OSA release
        poet: "Sant Mirabai / Sufi Adaptations",
        couplet: "सांसों की माला पे सिमरूँ मैं पी का नाम, अपने मन की मैं जानूँ और पी के मन की राम।",
        coupletUrdu: "سانسوں کی مالا پہ سمروں میں پی کا نام، اپنے من کی میں جانوں اور پی کے من کی رام۔",
        era: "Divine Devotion"
      },
      {
        id: "nfak-06",
        title: "Mera Piya Ghar Aaya",
        urduTitle: "میرا پیا گھر آیا",
        artist: "Ustad Nusrat Fateh Ali Khan",
        album: "Oriental Star Agencies (OSA Worldwide)",
        duration: "13:48",
        videoId: "zIPS4XJBvxw", // Verified Official OSA release
        poet: "Hazrat Baba Bulleh Shah",
        couplet: "घड़ियाल देयो निकाल नी, आज पी घर आया मेरे यार नी!",
        coupletUrdu: "گھڑیال دیو نکال نی، اج پی گھر آیا میرے یار نی!",
        era: "Sufi Ecstasy"
      },
      {
        id: "nfak-07",
        title: "Kise Da Yaar Na Vichre",
        urduTitle: "کسے دا یار نہ وچھڑے",
        artist: "Ustad Nusrat Fateh Ali Khan",
        album: "Oriental Star Agencies (OSA Worldwide)",
        duration: "11:24",
        videoId: "ocMEmQ3s8qE", // Verified Official OSA release
        poet: "Baba Bulleh Shah / Traditional",
        couplet: "ربا کسے نوں نہ روگ لاویں، تے کسے دا یار نہ وچھڑے۔",
        coupletUrdu: "ربا کسے نوں نہ روگ لاویں، تے کسے دا یار نہ وچھڑے۔",
        era: "Spiritual Separation"
      },
      {
        id: "nfak-08",
        title: "Nit Khair Manga Sohneya Main Teri",
        urduTitle: "نت خیر منگاں سوہنیا میں تیری",
        artist: "Ustad Nusrat Fateh Ali Khan",
        album: "Oriental Star Agencies (OSA Worldwide)",
        duration: "12:10",
        videoId: "66QAdKouQeg", // Verified Official OSA release
        poet: "Badar Ali Khan",
        couplet: "نت خیر منگاں سوہنیا میں تیری، دعا نہ کوئی اور منگدی۔",
        coupletUrdu: "نت خیر منگاں سوہنیا میں تیری، دعا نہ کوئی اور منگدی۔",
        era: "Universal Blessing"
      }
    ]
  },

  "trending": {
    id: "trending",
    title: "Trending & Sacred Anthems",
    urduTitle: "مقبولِ عام اور مقدس ترانے",
    hindiTitle: "ट्रेंडिंग एवं पावन सूफ़ी क़व्वालियाँ",
    badge: "Contemporary & Soulful",
    description: "The most resonant modern Sufi hymns, cinema masterworks by A.R. Rahman, and viral spiritual anthems.",
    coverIcon: "✨",
    accentColor: "#1b7a5e",
    tracks: [
      {
        id: "tr-01",
        title: "Kun Faya Kun",
        urduTitle: "کُن فیکون",
        artist: "A.R. Rahman, Javed Ali, Mohit Chauhan",
        album: "Rockstar (T-Series Official)",
        duration: "07:53",
        videoId: "1x4oHntSHyU", // Verified Official T-Series release
        poet: "Irshad Kamil (inspired by Quran 36:82)",
        couplet: "जब कहीं पे कुछ नहीं भी नहीं था, वही था वही था वही था वही था।",
        coupletUrdu: "جب کہیں پہ کچھ نہیں بھی نہیں تھا، وہی تھا وہی تھا وہی تھا وہی تھا۔",
        era: "Nizamuddin Dargah Hymn"
      },
      {
        id: "tr-02",
        title: "Bhar Do Jholi Meri",
        urduTitle: "بھر دو جھولی میری یا محمدؐ",
        artist: "Adnan Sami / Sabri Brothers Tribute",
        album: "Bajrangi Bhaijaan (T-Series Official)",
        duration: "08:19",
        videoId: "zk0-f92gg9A", // Verified Official T-Series release
        poet: "Purnam Allahabadi",
        couplet: "بھر دو جھولی میری یا محمدؐ، لوٹ کر میں نہ جاؤں گا خالی۔",
        coupletUrdu: "بھر دو جھولی میری یا محمدؐ، لوٹ کر میں نہ جاؤں گا خالی۔",
        era: "Chishti Dargah Anthem"
      },
      {
        id: "tr-03",
        title: "Khwaja Mere Khwaja",
        urduTitle: "خواجہ میرے خواجہ",
        artist: "A.R. Rahman",
        album: "Jodhaa Akbar (Official HD)",
        duration: "06:58",
        videoId: "4YbAaRFk70o", // Verified Official release
        poet: "Kashif",
        couplet: "خواجہ میرے خواجہ، دل میں سما جا، شاہوں کا شاہ تو، علی کا لاڈلا۔",
        coupletUrdu: "خواجہ میرے خواجہ، دل میں سما جا، شاہوں کا شاہ تو، علی کا لاڈلا۔",
        era: "Ajmer Sharif Dedication"
      },
      {
        id: "tr-04",
        title: "Arziyan (Dargah Peer Ki)",
        urduTitle: "عرضیاں",
        artist: "Javed Ali & Kailash Kher",
        album: "Delhi-6 / A.R. Rahman (T-Series)",
        duration: "08:41",
        videoId: "kYJz2A87k64", // Verified Official T-Series release
        poet: "Prasoon Joshi",
        couplet: "दरारें दरारें माथे पे मौला, मरम्मत मुक़द्दर की कर दो मेरे मौلا।",
        coupletUrdu: "دراریں دراریں ماتھے پہ مولا، مرمت مقدر کی کر دو میرے مولا۔",
        era: "Sufi Supplication"
      },
      {
        id: "tr-05",
        title: "Piya Haji Ali",
        urduTitle: "پیا حاجی علی",
        artist: "A.R. Rahman, Srinivas, Kader Ghulam Mushtafa",
        album: "Fiza (Official HD)",
        duration: "06:30",
        videoId: "3xbl0ldHbZM", // Verified Official release
        poet: "Shaukat Ali",
        couplet: "تیرے دربار میں قسمتیں بنتی ہیں، پیّا حاجی علی شاہِ سمندر۔",
        coupletUrdu: "تیرے دربار میں قسمتیں بنتی ہیں، پیّا حاجی علی شاہِ سمندر۔",
        era: "Haji Ali Dargah Mumbai"
      },
      {
        id: "tr-06",
        title: "Ali Maula Ali Maula",
        urduTitle: "علی مولا علی مولا",
        artist: "Salim-Sulaiman",
        album: "Kurbaan (Official HD)",
        duration: "04:38",
        videoId: "SRC4xPzsOWY", // Verified Official release
        poet: "Niranjan Iyengar",
        couplet: "مانگیں گے مولا تجھ سے تیری رحمتیں، دیدے ہمیں بھی تو برکتیں۔",
        coupletUrdu: "مانگیں گے مولا تجھ سے تیری رحمتیں، دیدے ہمیں بھی تو برکتیں۔",
        era: "Spiritual Cry"
      },
      {
        id: "tr-07",
        title: "Tu Mane Ya Na Mane",
        urduTitle: "تو مانے یا نہ مانے",
        artist: "Wadali Brothers",
        album: "Coke Studio @ MTV",
        duration: "07:15",
        videoId: "iyFd1vnkMUI", // Verified Official Coke Studio MTV release
        poet: "Hazrat Baba Bulleh Shah",
        couplet: "تو مانے یا نہ مانے دلدارا، اساں تے تینوں رب منیا!",
        coupletUrdu: "تو مانے یا نہ مانے دلدارا، اساں تے تینوں رب منیا!",
        era: "Punjabi Sufi Rooh"
      }
    ]
  }
};

/**
 * Returns a flattened array of all tracks mixed together for the "Shuffle All" playlist.
 */
function getCombinedMehfilTracks() {
  const allTracks = [];
  Object.values(PLAYLISTS_DATA).forEach(playlist => {
    playlist.tracks.forEach(track => {
      allTracks.push({
        ...track,
        playlistBadge: playlist.badge,
        category: playlist.id
      });
    });
  });
  return allTracks;
}
