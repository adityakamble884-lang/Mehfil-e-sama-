/**
 * ============================================================================
 * MEHFIL - ROTATING SUFI COUPLETS & RUBAIYAT (Public Domain)
 * ============================================================================
 * 
 * Timeless public-domain Sufi poetry from Hazrat Amir Khusrau, Mawlana Rumi,
 * Hazrat Baba Bulleh Shah, Allama Iqbal, and Khwaja Ghulam Farid.
 */

const SUFI_COUPLETS = [
  {
    urdu: "چھاپ تلک سب چھینی رے موسے نیناں ملائیکے",
    hindi: "छाप तिलक सब छीनी रे मोसे नैना मिलाइके",
    translation: "You have taken away all my identity and markings, with just one glance of your eyes.",
    poet: "Hazrat Amir Khusrau (1253–1325)",
    context: "Dedicated to his Murshid, Hazrat Nizamuddin Auliya"
  },
  {
    urdu: "بشنو از نے چون حکایت میکند، از جدائیہا شکایت میکند",
    hindi: "बाँसुरी की आवाज़ सुनो, कैसे वो अपनी जुदाई का शिकवा करती है",
    translation: "Listen to the reed flute as it complains, lamenting the pangs of separation from its source.",
    poet: "Mawlana Jalaluddin Rumi (1207–1273)",
    context: "Opening line of the Masnavi-ye-Ma'navi"
  },
  {
    urdu: "من تو شدم تو من شدی، من تن شدم تو جاں شدی",
    hindi: "मैं तू बन गया और तू मैं बन गया, मैं तन बन गया और तू रूह बन गया",
    translation: "I have become you and you have become me; I am the body and you are the soul.",
    poet: "Hazrat Amir Khusrau",
    context: "On the annihilation of ego (Fana) in the Divine"
  },
  {
    urdu: "بُلّھیا کی جاناں میں کَون، نہ میں مؤمن وچ مسیت ہاں",
    hindi: "बुल्ले शाह, मैं क्या जानूँ मैं कौन हूँ, न मैं मोमिन मस्जिदों में हूँ",
    translation: "O Bulleh, what know I who I am? Neither am I a believer bounded by walls, nor in temples.",
    poet: "Hazrat Baba Bulleh Shah (1680–1757)",
    context: "Transcending superficial religious labels towards universal love"
  },
  {
    urdu: "خاصاں دی گل عاماں اگے، نہیں مناسب کرنی",
    hindi: "गहरे राज़ की बातें हर किसी के आगे खोलना मुनासिब नहीं",
    translation: "It is not fitting to speak of divine mysteries before those who seek only the surface.",
    poet: "Mian Muhammad Bakhsh",
    context: "From Saif-ul-Malook"
  },
  {
    urdu: "مٹا دے اپنی ہستی کو اگر کچھ مرتبہ چاہے، کہ دانہ خاک میں مل کر گل و گلزار ہوتا ہے",
    hindi: "मिटा दे अपनी हस्ती को अगर कुछ मर्तबा चाहे, कि दाना ख़ाक में मिल कर गुल-ओ-गुलज़ार होता है",
    translation: "Surrender your ego if you seek high spiritual standing; a seed must dissolve into dust before blooming into a rose garden.",
    poet: "Allama Muhammad Iqbal",
    context: "Bang-e-Dra"
  },
  {
    urdu: "آج رنگ ہے ری ماں رنگ ہے ری، مورے محبوب کے گھر رنگ ہے ری",
    hindi: "आज रंग है री माँ रंग है री, मोरे महबूब के घर रंग है री",
    translation: "Today there is spiritual radiance, O mother! In the abode of my Beloved, all colours unite.",
    poet: "Hazrat Amir Khusrau",
    context: "The definitive closing kalaam of every authentic Mehfil-e-Sama"
  },
  {
    urdu: "عشق دی نویوں نوی بہار، جا میں سبق عشق دا پڑھیا",
    hindi: "इश्क़ की हर पल नई बहार है, जब से मैंने इश्क़ का सबक़ सीखा है",
    translation: "Ever fresh and ever new is the spring of Divine Love, since the day I learned its secret.",
    poet: "Hazrat Baba Bulleh Shah",
    context: "The perennial rejuvenation of spiritual love"
  },
  {
    urdu: "دل آرامے کہ دارَم نَیست بی مَن، نہ مَن بے او توانَم زِیست ہرگِز",
    hindi: "जिस महबूब से मेरे दिल को सुकून है वो मुझ से जुदा नहीं, और मैं भी उसके बिना एक पल नहीं जी सकता",
    translation: "The Beloved who soothes my heart is never apart from me, nor can I live even a breath without Him.",
    poet: "Hazrat Amir Khusrau",
    context: "From his Persian Divan"
  }
];
