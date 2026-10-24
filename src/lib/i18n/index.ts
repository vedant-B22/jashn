export type Locale = 'en' | 'hi' | 'mr';

export interface Translations {
  readonly appTitle: string;
  readonly appSubtitle: string;
  readonly intakePlaceholder: string;
  readonly generatePlanBtn: string;
  readonly listeningBtn: string;
  readonly voiceStartBtn: string;
  readonly presetsTitle: string;
  readonly weddingPreset: string;
  readonly birthdayPreset: string;
  readonly communityPreset: string;
  readonly budgetTitle: string;
  readonly budgetSubtitle: string;
  readonly timelineTitle: string;
  readonly timelineSubtitle: string;
  readonly vendorsTitle: string;
  readonly vendorsSubtitle: string;
  readonly ideasTitle: string;
  readonly ideasSubtitle: string;
  readonly planBTitle: string;
  readonly planBSubtitle: string;
  readonly whyThisBtn: string;
  readonly exportIcsBtn: string;
  readonly printBtn: string;
  readonly copySummaryBtn: string;
  readonly guestsLabel: string;
  readonly totalBudgetLabel: string;
  readonly perGuestLabel: string;
  readonly contingencyLabel: string;
  readonly whatIfTitle: string;
  readonly whatIfDescription: string;
  readonly urgentMilestones: string;
  readonly criticalPathLabel: string;
  readonly accessibleTableToggle: string;
  readonly rebalanceNotice: string;
}

export const DICTIONARIES: Record<Locale, Translations> = {
  en: {
    appTitle: 'Jashn — GenAI Celebration & Event Planner',
    appSubtitle:
      'Organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.',
    intakePlaceholder:
      'Describe your dream celebration (e.g., Traditional Indian wedding, 250 guests, ₹15L budget, November in Jaipur, royal heritage vibe with vegetarian menu...)',
    generatePlanBtn: 'Build Complete Master Plan',
    listeningBtn: 'Listening... Speak now',
    voiceStartBtn: 'Voice Input',
    presetsTitle: 'Quick Presets',
    weddingPreset: 'Indian Wedding (200 guests, ₹15L)',
    birthdayPreset: '30th Birthday (60 guests, ₹2L)',
    communityPreset: 'Diwali Gala (300 guests, ₹5L)',
    budgetTitle: 'Smart Zero-Sum Budget Planner',
    budgetSubtitle: 'Live sliders dynamically rebalance. Total budget is strictly conserved.',
    timelineTitle: 'Backward-Scheduled Timeline',
    timelineSubtitle: 'Scheduled backward from event date with dependency ordering & critical path.',
    vendorsTitle: 'Vendor Negotiation Checklist',
    vendorsSubtitle: 'Verified lead-times, questions, red flags, and contract tips.',
    ideasTitle: 'Personalized Themes & Mood Board',
    ideasSubtitle: 'Procedurally generated aesthetic palettes, menus, and cultural motifs.',
    planBTitle: 'Plan B Contingency Studio',
    planBSubtitle: 'Instant deterministic diffs for weather disruptions, guest surges, and budget cuts.',
    whyThisBtn: 'Why This Recommendation?',
    exportIcsBtn: 'Export to Calendar (.ics)',
    printBtn: 'Print / PDF Plan',
    copySummaryBtn: 'Copy Executive Summary',
    guestsLabel: 'Guests',
    totalBudgetLabel: 'Total Budget',
    perGuestLabel: 'Per Guest',
    contingencyLabel: 'Emergency Reserve',
    whatIfTitle: 'What-If Guest Count Simulator',
    whatIfDescription: 'Slide guest count to model variable catering and invitation impact.',
    urgentMilestones: 'Book This Week (Immediate Action Required)',
    criticalPathLabel: 'Critical Path Task',
    accessibleTableToggle: 'Switch to Accessible Table View',
    rebalanceNotice: 'Adjusting any slider automatically rebalances other categories to preserve your total budget.',
  },
  hi: {
    appTitle: 'जश्न — जेन-एआई उत्सव एवं आयोजन योजनाकार',
    appSubtitle: 'शादियों, जन्मदिनों और सामुदायिक आयोजनों की योजना बनाएं — बजट, समयरेखा, विक्रेता चेकलिस्ट और अनूठे विचारों के साथ।',
    intakePlaceholder: 'अपने उत्सव का विवरण दें (उदा: भारतीय विवाह, 250 अतिथि, ₹15 लाख बजट, जयपुर में नवंबर, राजस्थानी शैली...)',
    generatePlanBtn: 'मास्टर प्लान तैयार करें',
    listeningBtn: 'सुन रहे हैं... बोलिए',
    voiceStartBtn: 'ध्वनि इनपुट',
    presetsTitle: 'त्वरित प्रीसेट',
    weddingPreset: 'भारतीय विवाह (200 अतिथि, ₹15 लाख)',
    birthdayPreset: '30वां जन्मदिन (60 अतिथि, ₹2 लाख)',
    communityPreset: 'दिवाली समारोह (300 अतिथि, ₹5 लाख)',
    budgetTitle: 'स्मार्ट जीरो-सम बजट योजनाकार',
    budgetSubtitle: 'स्लाइडर अपने आप बजट संतुलित करते हैं। कुल बजट हमेशा स्थिर रहता है।',
    timelineTitle: 'समयरेखा और कार्य सूची',
    timelineSubtitle: 'आयोजन की तारीख से उल्टी गिनती द्वारा निर्धारित समयरेखा।',
    vendorsTitle: 'विक्रेता चेकलिस्ट व मोलभाव टिप्स',
    vendorsSubtitle: 'सही समयसीमा, पूछने योग्य प्रश्न, लाल झंडे और मोलभाव की रणनीतियाँ।',
    ideasTitle: 'थीम, मेन्यू और मूड बोर्ड',
    ideasSubtitle: 'कंप्यूटर द्वारा तैयार रंग पट्टियाँ, खान-पान मेन्यू और सांस्कृतिक रूपरेखा।',
    planBTitle: 'प्लान बी — आपातकालीन योजना',
    planBSubtitle: 'बारिश, अचानक मेहमान बढ़ने या बजट घटने पर तुरंत गणना।',
    whyThisBtn: 'यह सिफारिश क्यों?',
    exportIcsBtn: 'कैलेंडर में जोड़ें (.ics)',
    printBtn: 'प्रिंट / पीडीएफ योजना',
    copySummaryBtn: 'विवरण कॉपी करें',
    guestsLabel: 'अतिथि',
    totalBudgetLabel: 'कुल बजट',
    perGuestLabel: 'प्रति अतिथि',
    contingencyLabel: 'आपातकालीन रिज़र्व',
    whatIfTitle: 'यदि अतिथि बदलें तो क्या?',
    whatIfDescription: 'मेहमानों की संख्या बदलकर खान-पान और बैठने के खर्च का आकलन करें।',
    urgentMilestones: 'इस सप्ताह बुक करें (अत्यावश्यक)',
    criticalPathLabel: 'महत्वपूर्ण पथ कार्य',
    accessibleTableToggle: 'सुलभ तालिका दृश्य पर बदलें',
    rebalanceNotice: 'किसी भी स्लाइडर को बदलने पर कुल बजट बनाए रखने के लिए अन्य श्रेणियां स्वतः संतुलित हो जाती हैं।',
  },
  mr: {
    appTitle: 'जश्न — जेन-एआय उत्सव व सोहळा नियोजक',
    appSubtitle: 'लग्न, वाढदिवस आणि सार्वजनिक कार्यक्रमांचे नियोजन — बजेट, वेळापत्रक, वेंडर चेकलिस्ट व कल्पक कल्पनांसह.',
    intakePlaceholder: 'तुमच्या स्वप्नातील सोहळ्याचे वर्णन करा (उदा: पारंपरिक लग्न, 200 पाहुणे, ₹15 लाख बजेट, पुणे, मराठमोळा थाट...)',
    generatePlanBtn: 'मास्टर प्लॅन तयार करा',
    listeningBtn: 'ऐकत आहे... बोला',
    voiceStartBtn: 'आवाज इनपुट',
    presetsTitle: 'त्वरित पर्याय',
    weddingPreset: 'मराठमोळे लग्न (200 पाहुणे, ₹15 लाख)',
    birthdayPreset: 'वाढदिवस (60 पाहुणे, ₹2 लाख)',
    communityPreset: 'दिवाळी स्नेहसंमेलन (300 पाहुणे, ₹5 लाख)',
    budgetTitle: 'स्मार्ट बजेट नियोजक',
    budgetSubtitle: 'स्लायडर आपोआप बजेट पुनर्संतुलित करतात. एकूण बजेट नेहमी अचूक राहते.',
    timelineTitle: 'वेळापत्रक व नियोजन',
    timelineSubtitle: 'कार्यक्रमाच्या तारखेपासून उलट क्रमाने निश्चित केलेले कार्य वेळापत्रक.',
    vendorsTitle: 'वेंडर चेकलिस्ट व वाटाघाटी टिप्स',
    vendorsSubtitle: 'अचूक कालावधी, विचारण्याचे प्रश्न आणि महत्त्वाच्या सावधगिरीच्या गोष्टी.',
    ideasTitle: 'संकल्पना, मेन्यू आणि मूड बोर्ड',
    ideasSubtitle: 'कलात्मक रंगसंगती, खाद्य मेन्यू आणि सांस्कृतिक सजावट.',
    planBTitle: 'प्लॅन बी — आपत्कालीन सज्जता',
    planBSubtitle: 'पाऊस, पाहुण्यांची अचानक वाढ किंवा बजेट कपात यावर झटपट उपाय.',
    whyThisBtn: 'ही शिफारस का?',
    exportIcsBtn: 'कॅलेंडरमध्ये जोडा (.ics)',
    printBtn: 'प्रिंट / पीडीएफ प्लॅन',
    copySummaryBtn: 'माहिती कॉपी करा',
    guestsLabel: 'पाहुणे',
    totalBudgetLabel: 'एकूण बजेट',
    perGuestLabel: 'प्रति पाहुणा',
    contingencyLabel: 'आणीबाणी निधी',
    whatIfTitle: 'पाहुण्यांची संख्या बदलल्यास?',
    whatIfDescription: 'पाहुण्यांच्या संख्येनुसार केटरिंग आणि इतर खर्चाचा अंदाज घ्या.',
    urgentMilestones: 'या आठवड्यात बुक करा (अति महत्त्वाचे)',
    criticalPathLabel: 'अत्यंत महत्त्वाचे कार्य',
    accessibleTableToggle: 'सुलभ टेबल स्वरूपात पहा',
    rebalanceNotice: 'कोणतीही वर्गवारी बदलल्यास एकूण बजेट राखण्यासाठी इतर खर्च आपोआप संतुलित होतात.',
  },
};
