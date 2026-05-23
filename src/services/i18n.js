/**
 * FarmSense — Internationalization & Voice Service
 */

const DICTIONARY = {
  en: {
    // Nav & Headers
    homeLink: '← Home',
    dashboardTitle: 'Farm Dashboard',
    setLocationLabel: 'Set your location to get started',
    useGPS: 'Use GPS',
    gpsHint: 'Most accurate',
    dividerOr: 'or',
    searchPlaceholder: 'Search village, city or enter pincode...',
    changeBtn: 'Change',
    weatherTab: 'Weather',
    advisoryTab: 'Advisory',
    predictionsTab: 'Predictions',
    loadingText: 'Analyzing weather patterns for your farm...',
    errorMsg: 'Something went wrong',
    retryBtn: 'Try Again',
    statTemp: 'Temperature',
    statHumidity: 'Humidity',
    statRain: 'Rain Chance',
    statWind: 'Wind',
    sevenDayForecast: '7-Day Forecast',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    wind: 'Wind',
    uvIndex: 'UV Index',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    tempTrend: 'Temperature Trend',
    precipitation: 'Precipitation',
    humidityWind: 'Humidity & Wind',
    historicalComparison: 'Historical Comparison',
    historicalDesc: 'This week vs same period last year',
    cropAdvisory: 'Crop Advisory',
    cropAdvisoryDesc: 'Select your crop for personalized farming advice',
    selectCropLabel: 'Select Your Crop',
    chooseCropOption: '— Choose a crop —',
    bestDaysTitle: 'Best Days This Week',
    predictionsTitle: 'AI Yield Prediction',
    predictionsDesc: 'Enter your farm details to get personalized yield predictions',
    footerText: 'Built for Indian Farmers • EVS Project 2026',
    footerDisclaimer: 'Advisory insights are AI-generated suggestions. Always consult local agricultural officers for critical decisions.',
    
    // Crop Doctor
    cropDoctorTitle: 'Crop Doctor AI',
    cropDoctorDesc: 'Upload a photo of a sick plant for instant diagnosis.',
    tapToUpload: 'Tap to upload or take a photo',
    analyzingImage: 'Analyzing image...',
    pleaseSelectCropAlert: 'Please select a crop at the top of the Advisory tab first.',
    highConfidenceMatch: 'High Confidence Match',
    recommendedAction: 'Recommended Action',
    cropDoctorResultDesc: 'Based on the visual symptoms (spots/lesions) and current weather parameters (high humidity), our AI models indicate a strong likelihood of',
    cropDoctorResultAction: 'Apply a broad-spectrum fungicide (e.g., Mancozeb or Carbendazim) at 2g/liter of water. Avoid spraying if rain is expected within 4 hours.',

    // Prediction Form
    enterFarmDetails: 'Enter Your Farm Details',
    enterFarmDetailsDesc: 'Get AI-powered yield predictions based on real weather data',
    cropLabel: 'Crop',
    cropSelectPlaceholder: 'Select your crop',
    soilTypeLabel: 'Soil Type',
    soilSelectPlaceholder: 'Select soil type',
    farmAreaLabel: 'Farm Area (Acres)',
    irrigationMethodLabel: 'Irrigation Method',
    sowingDateLabel: 'Sowing Date',
    generatePredictionBtn: 'Generate Prediction',
    analyzingBtn: 'Analyzing...',
    predictedYieldTitle: 'Predicted Yield',
    expectedRevenueTitle: 'Expected Revenue',
    estimatedLossTitle: 'Estimated Value at Risk',
    currentPriceTitle: 'Current Market Price (Est.)',
    growthStageTitle: 'Growth Stage Timeline',
    riskAssessmentTitle: 'Risk Assessment',
    recommendationsTitle: 'Recommendations',
    weatherScore: 'Weather Score',
    soilScore: 'Soil Score',
    irrigation: 'Irrigation',

    // Crops
    rice: 'Rice (Paddy)',
    wheat: 'Wheat',
    sugarcane: 'Sugarcane',
    cotton: 'Cotton',
    maize: 'Maize (Corn)',
    soybean: 'Soybean',
    groundnut: 'Groundnut (Peanut)',
    mustard: 'Mustard',
    bajra: 'Bajra (Pearl Millet)',
    jowar: 'Jowar (Sorghum)',
    tur: 'Tur / Arhar (Pigeon Pea)',
    chana: 'Chana (Chickpea)',
    tomato: 'Tomato',
    onion: 'Onion',
    potato: 'Potato',

    // Soils
    alluvial: 'Alluvial Soil',
    alluvial_desc: 'Found in Indo-Gangetic plains. Rich in potash, very fertile.',
    black: 'Black Soil (Regur)',
    black_desc: 'Deccan plateau. Rich in calcium, magnesium. Self-ploughing clay.',
    red: 'Red Soil',
    red_desc: 'Southern & Eastern India. Iron-rich, low in nitrogen/phosphorus.',
    laterite: 'Laterite Soil',
    laterite_desc: 'Western Ghats & northeast. Acidic, rich in iron/aluminum.',
    clay: 'Clay Soil',
    clay_desc: 'Heavy texture, high water holding capacity. Sticky when wet.',
    sandy: 'Sandy Soil',
    sandy_desc: 'Rajasthan, coastal regions. Low water retention, easy to till.',
    loamy: 'Loamy Soil',
    loamy_desc: 'Ideal mix of sand, silt, clay. Best for most crops.',
    mountain: 'Mountain / Forest Soil',
    mountain_desc: 'Hilly regions. Rich in humus, acidic, high organic content.',
    desert: 'Desert Soil (Arid)',
    desert_desc: 'Thar region. High mineral content, very low organic matter.',

    // Irrigation Methods
    rainfed: 'Rainfed (No Irrigation)',
    flood: 'Flood / Surface',
    sprinkler: 'Sprinkler',
    drip: 'Drip Irrigation',
    furrow: 'Furrow',

    // Seasons & Units
    Kharif: 'Kharif',
    Rabi: 'Rabi',
    Annual: 'Annual',
    'Year-round': 'Year-round',
    'Kharif/Rabi': 'Kharif/Rabi',
    'Year-round (Tomato)': 'Year-round',
    'sugarcane_unit': 'tonnes',
    'general_unit': 'quintals',
    'per_acre': 'per acre',

    // Growth Stages
    'Germination': 'Germination',
    'Seedling': 'Seedling',
    'Tillering': 'Tillering',
    'Flowering': 'Flowering',
    'Grain Filling': 'Grain Filling',
    'Maturity': 'Maturity',
    'Crown Root': 'Crown Root',
    'Heading': 'Heading',
    'Grand Growth': 'Grand Growth',
    'Vegetative': 'Vegetative',
    'Square Formation': 'Square Formation',
    'Boll Development': 'Boll Development',
    'Tasseling': 'Tasseling',
    'Silking': 'Silking',
    'Pod Filling': 'Pod Filling',
    'Pegging': 'Pegging',
    'Siliqua Dev.': 'Siliqua Dev.',
    'Fruiting': 'Fruiting',
    'Harvest Period': 'Harvest Period',
    'Bulb Init.': 'Bulb Init.',
    'Bulb Filling': 'Bulb Filling',
    'Sprout Dev.': 'Sprout Dev.',
    'Tuber Init.': 'Tuber Init.',
    'Tuber Bulking': 'Tuber Bulking',

    // Advisory Warnings
    listen: 'Listen',
    stop: 'Stop',
    heatStressTitle: 'Heat Stress Warning — {days} day{s}',
    heatStressBody: 'Temperatures will exceed {temp}°C, which is above {crop}\'s heat tolerance. This can damage flowers, reduce fruit set, and slow growth.',
    heatStressAction1: 'Apply mulch to reduce soil temperature',
    heatStressAction2: 'Irrigate in early morning or late evening',
    heatStressAction3: 'Use shade nets if available',
    heatStressAction4: 'Avoid transplanting on hot days',

    coldFrostTitle: 'Cold/Frost Risk — {days} day{s}',
    coldFrostBody: 'Minimum temperatures will drop near or below {temp}°C. {crop} is sensitive to cold at this level.',
    coldFrostAction1: 'Cover young plants with plastic/straw at night',
    coldFrostAction2: 'Irrigate fields in evening to retain soil warmth',
    coldFrostAction3: 'Avoid pruning during cold spells',

    idealTempTitle: 'Temperature — Ideal Range',
    idealTempBody: 'Temperatures are within the optimal {minOpt}–{maxOpt}°C range for {crop} for most of the week. Great growing conditions!',
    idealTempAction1: 'Continue regular crop management',

    heavyRainTitle: 'Heavy Rain Alert — {days} day{s}',
    heavyRainBody: 'Heavy rainfall (>30mm) expected on {dates}. Risk of waterlogging and crop damage for {crop}.',
    heavyRainAction1: 'Ensure field drainage channels are clear',
    heavyRainAction2: 'Postpone fertilizer/pesticide application',
    heavyRainAction3: 'Harvest mature produce before heavy rain',
    heavyRainAction4: 'Protect seedbeds with temporary covers',

    irrigationTitle: 'Irrigation Needed',
    irrigationBody: 'Expected rainfall ({rain}mm) is {deficit}mm short of {crop}\'s weekly water need ({need}mm). {dry} dry days ahead.',
    irrigationAction1: 'Plan irrigation to supplement ~{deficit}mm',
    irrigationAction3: 'Water early morning to minimize evaporation',

    waterAdequateTitle: 'Water Supply — Adequate',
    waterAdequateBody: 'Expected rainfall of {rain}mm meets {crop}\'s water requirement of {need}mm/week.',
    waterAdequateAction1: 'No additional irrigation needed this week',

    highWindTitle: 'High Wind — Spraying Window Limited',
    highWindBody: 'Wind speeds will exceed {limit} km/h on {days} days. Not suitable for pesticide/fertilizer spraying.',
    highWindActionCalm: 'Best days for spraying: {calm}',
    highWindActionMorning: 'Consider early morning spraying when winds are calmer',
    highWindActionStake: 'Stake tall plants to prevent lodging',

    strongWindTitle: 'Strong Wind Warning',
    strongWindBody: 'Average maximum wind speed is {wind} km/h. Risk of physical crop damage and accelerated soil moisture loss.',
    strongWindAction1: 'Install windbreaks if possible',
    strongWindAction2: 'Secure greenhouse/polytunnel structures',
    strongWindAction3: 'Delay transplanting to calmer period',

    diseaseRiskTitle: 'Disease Risk — High Humidity ({percent}% of hours)',
    diseaseRiskBody: 'Humidity will exceed {limit}% for {hours} hours this week. {crop} is susceptible to: {diseases}.',
    diseaseRiskAction1: 'Apply preventive fungicide during a dry window',
    diseaseRiskAction2: 'Improve air circulation (wider spacing, remove lower leaves)',
    diseaseRiskAction3: 'Monitor fields daily for early disease symptoms',
    diseaseRiskAction4: 'Avoid overhead irrigation',

    diseaseLowTitle: 'Disease Risk — Low',
    diseaseLowBody: 'Humidity levels are mostly below the disease threshold for {crop}. Low fungal disease pressure expected.',
    diseaseLowAction1: 'Continue regular scouting',

    highUVTitle: 'High UV Index — {days} day{s}',
    highUVBody: 'Very high UV radiation can cause sunscald on fruits and accelerate moisture loss.',
    highUVAction1: 'Use shade cloth for sensitive vegetables',
    highUVAction2: 'Farmers: wear hats and protective clothing',
    highUVAction3: 'Schedule field work in early morning/late afternoon',

    // Predictor results messages
    minimalYieldLoss: 'Minimal yield loss expected. Conditions are favorable for your crop!',
    moderateYieldLoss: 'Moderate yield reduction possible. Follow recommendations to mitigate losses.',
    significantYieldLoss: 'Significant yield reduction likely. Immediate action needed to protect your crop.',
    severeYieldLoss: 'Severe yield loss expected. Consider protective measures and consult local agricultural officer.',
    weatherStressFactor: 'Weather Stress',
    soilMismatchFactor: 'Soil Mismatch',
    riskFactorsFactor: 'Risk Factors',
    conditionsFavorableFactor: 'Conditions Favorable',
    currentStageLabel: 'Current Stage',
    daysSinceSowingLabel: 'Days Since Sowing',
    overallProgressLabel: 'Overall Progress',
    criticalPeriodLabel: 'CRITICAL GROWTH PERIOD',
    droughtStressRisk: 'Drought Stress',
    floodRisk: 'Flood / Waterlogging',
    heatStressRisk: 'Heat Stress',
    diseasePressureRisk: 'Disease Pressure',
    pestPressureRisk: 'Pest Pressure',
    stageAdviceLabel: '{stage} Stage Care',
    irrigationScheduleLabel: 'Irrigation Schedule',
    fungicideAppLabel: 'Fungicide Application',
    heatMgmtLabel: 'Heat Management',
    drainageMgmtLabel: 'Drainage Management',
    soilAmendmentLabel: 'Soil Amendment',
    harvestPlanningLabel: 'Harvest Planning',
    favorableCondLabel: 'Favorable Conditions',
    rangeLabel: 'Range',
    totalLabel: 'Total',
    confidenceLabel: 'Confidence',
    milletSeason: 'Kharif/Rabi',
    
    // Advisories general
    selectCropAdvisoryDefault: 'Select a crop above to get personalized farming advice',
    conditionFavorableDefault: 'Conditions are favorable for your crop. Continue regular practices.',
    weatherStressExpected: 'Some weather stress expected. Follow the advisories below carefully.',
    highStressAhead: 'High stress conditions ahead. Take immediate protective action.',

    // Activities
    plantingActivity: 'Planting / Transplanting',
    sprayingActivity: 'Pesticide Spraying',
    bestDayReason: 'Low rain ({rain}mm), wind {wind} km/h',

    // Crop Tips (English)
    rice_tip_irrigation: 'Maintain 5cm standing water during tillering stage',
    wheat_tip_irrigation: 'Critical irrigation at crown root, tillering, flowering stages',
    sugarcane_tip_irrigation: 'Avoid waterlogging; furrow irrigation recommended',
    cotton_tip_irrigation: 'Drip irrigation at flowering is critical',
    maize_tip_irrigation: 'Critical water need at tasseling/silking stage',
    soybean_tip_irrigation: 'Avoid waterlogging; ensure proper drainage',
    groundnut_tip_irrigation: 'Critical at pegging and pod filling stages',
    mustard_tip_irrigation: 'First irrigation 25-30 days after sowing is critical',
    bajra_tip_irrigation: 'Drought tolerant but needs water at grain filling',
    jowar_tip_irrigation: 'Drought tolerant; one irrigation at flowering helps',
    tur_tip_irrigation: 'Generally rainfed; irrigate at flowering if dry spell',
    chana_tip_irrigation: 'Only 1-2 irrigations needed; avoid excess water',
    tomato_tip_irrigation: 'Regular drip irrigation; mulch to conserve moisture',
    onion_tip_irrigation: 'Stop irrigation 10-15 days before harvest',
    potato_tip_irrigation: 'Consistent moisture; earthing up at 30 days',

    // Weather Descriptions (English)
    'Clear sky': 'Clear sky',
    'Mainly clear': 'Mainly clear',
    'Partly cloudy': 'Partly cloudy',
    'Overcast': 'Overcast',
    'Foggy': 'Foggy',
    'Rime fog': 'Rime fog',
    'Light drizzle': 'Light drizzle',
    'Moderate drizzle': 'Moderate drizzle',
    'Dense drizzle': 'Dense drizzle',
    'Freezing drizzle': 'Freezing drizzle',
    'Heavy freezing drizzle': 'Heavy freezing drizzle',
    'Slight rain': 'Slight rain',
    'Moderate rain': 'Moderate rain',
    'Heavy rain': 'Heavy rain',
    'Light freezing rain': 'Light freezing rain',
    'Heavy freezing rain': 'Heavy freezing rain',
    'Slight snowfall': 'Slight snowfall',
    'Moderate snowfall': 'Moderate snowfall',
    'Heavy snowfall': 'Heavy snowfall',
    'Snow grains': 'Snow grains',
    'Slight showers': 'Slight showers',
    'Moderate showers': 'Moderate showers',
    'Violent showers': 'Violent showers',
    'Slight snow showers': 'Slight snow showers',
    'Heavy snow showers': 'Heavy snow showers',
    'Thunderstorm': 'Thunderstorm',
    'Thunderstorm + hail': 'Thunderstorm + hail',
    'Thunderstorm + heavy hail': 'Thunderstorm + heavy hail',

    // Calendar & Extra UI Labels (English)
    Today: 'Today',
    'This Year': 'This Year',
    'Last Year': 'Last Year',
    Safe: 'Safe',
    Caution: 'Caution',
    Alert: 'Alert',
    minimal: 'Minimal',
    moderate: 'Moderate',
    significant: 'Significant',
    severe: 'Severe',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    priority: 'Priority',

    // Fungal Diseases (English)
    'Rice blast': 'Rice blast',
    'Sheath blight': 'Sheath blight',
    'Brown spot': 'Brown spot',
    'Rust': 'Rust',
    'Karnal bunt': 'Karnal bunt',
    'Powdery mildew': 'Powdery mildew',
    'Red rot': 'Red rot',
    'Smut': 'Smut',
    'Wilt': 'Wilt',
    'Boll rot': 'Boll rot',
    'Bacterial blight': 'Bacterial blight',
    'Fusarium wilt': 'Fusarium wilt',
    'Maydis leaf blight': 'Maydis leaf blight',
    'Downy mildew': 'Downy mildew',
    'Stalk rot': 'Stalk rot',
    'Yellow mosaic': 'Yellow mosaic',
    'Anthracnose': 'Anthracnose',
    'Tikka leaf spot': 'Tikka leaf spot',
    'Collar rot': 'Collar rot',
    'White rust': 'White rust',
    'Alternaria blight': 'Alternaria blight',
    'Ergot': 'Ergot',
    'Grain mold': 'Grain mold',
    'Charcoal rot': 'Charcoal rot',
    'Sterility mosaic': 'Sterility mosaic',
    'Pod borer': 'Pod borer',
    'Ascochyta blight': 'Ascochyta blight',
    'Botrytis grey mould': 'Botrytis grey mould',
    'Late blight': 'Late blight',
    'Early blight': 'Early blight',
    'Bacterial wilt': 'Bacterial wilt',
    'Purple blotch': 'Purple blotch',
    'Stemphylium blight': 'Stemphylium blight',
    'Common scab': 'Common scab'
  },
  hi: {
    // Nav & Headers
    homeLink: '← मुख्य पृष्ठ',
    dashboardTitle: 'फार्म डैशबोर्ड',
    setLocationLabel: 'शुरू करने के लिए अपना स्थान निर्धारित करें',
    useGPS: 'GPS उपयोग करें',
    gpsHint: 'सबसे सटीक',
    dividerOr: 'अथवा',
    searchPlaceholder: 'गांव, शहर खोजें या पिनकोड दर्ज करें...',
    changeBtn: 'बदलें',
    weatherTab: 'मौसम',
    advisoryTab: 'सलाह',
    predictionsTab: 'भविष्यवाणी',
    loadingText: 'आपके खेत के लिए मौसम के पैटर्न का विश्लेषण किया जा रहा है...',
    errorMsg: 'कुछ गलत हो गया',
    retryBtn: 'पुनः प्रयास करें',
    statTemp: 'तापमान',
    statHumidity: 'आर्द्रता',
    statRain: 'बारिश की संभावना',
    statWind: 'हवा की गति',
    sevenDayForecast: '7-दिवसीय पूर्वानुमान',
    feelsLike: 'महसूस होने वाला तापमान',
    humidity: 'आर्द्रता',
    wind: 'हवा',
    uvIndex: 'UV सूचकांक',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    tempTrend: 'तापमान का रुख',
    precipitation: 'वर्षा का अनुमान',
    humidityWind: 'आर्द्रता और हवा',
    historicalComparison: 'ऐतिहासिक तुलना',
    historicalDesc: 'यह सप्ताह बनाम पिछले वर्ष की समान अवधि',
    cropAdvisory: 'फसल सलाह',
    cropAdvisoryDesc: 'व्यक्तिगत खेती की सलाह पाने के लिए अपनी फसल चुनें',
    selectCropLabel: 'अपनी फसल चुनें',
    chooseCropOption: '— फसल का चयन करें —',
    bestDaysTitle: 'इस सप्ताह के सर्वोत्तम दिन',
    predictionsTitle: 'AI फसल उपज पूर्वानुमान',
    predictionsDesc: 'व्यक्तिगत फसल उपज पूर्वानुमान प्राप्त करने के लिए अपने खेत का विवरण दर्ज करें',
    footerText: 'भारतीय किसानों के लिए निर्मित • EVS प्रोजेक्ट 2026',
    footerDisclaimer: 'सलाह अंतर्दृष्टि AI-जनरेटेड सुझाव हैं। महत्वपूर्ण निर्णयों के लिए हमेशा स्थानीय कृषि अधिकारियों से परामर्श करें।',
    
    // Crop Doctor
    cropDoctorTitle: 'फसल डॉक्टर AI',
    cropDoctorDesc: 'तुरंत निदान के लिए बीमार पौधे की फोटो अपलोड करें।',
    tapToUpload: 'फ़ोटो अपलोड करने या खींचने के लिए टैप करें',
    analyzingImage: 'छवि का विश्लेषण किया जा रहा है...',
    pleaseSelectCropAlert: 'कृपया पहले सलाहकार टैब के शीर्ष पर एक फसल चुनें।',
    highConfidenceMatch: 'उच्च संभावना मिलान',
    recommendedAction: 'अनुशंसित कार्रवाई',
    cropDoctorResultDesc: 'दृश्य लक्षणों (धब्बे/घाव) और वर्तमान मौसम मापदंडों (उच्च आर्द्रता) के आधार पर, हमारे AI मॉडल संकेत देते हैं कि आपकी फसल में इसकी प्रबल संभावना है',
    cropDoctorResultAction: 'पानी में 2 ग्राम/लीटर की दर से एक व्यापक स्पेक्ट्रम कवकनाशी (जैसे, मैनकोज़ेब या कार्बेन्डाजिम) का छिड़काव करें। यदि 4 घंटे के भीतर बारिश की उम्मीद हो तो छिड़काव से बचें।',

    // Prediction Form
    enterFarmDetails: 'अपने खेत का विवरण दर्ज करें',
    enterFarmDetailsDesc: 'वास्तविक मौसम डेटा के आधार पर AI-संचालित फसल उपज की भविष्यवाणी प्राप्त करें',
    cropLabel: 'फसल',
    cropSelectPlaceholder: 'अपनी फसल चुनें',
    soilTypeLabel: 'मिट्टी का प्रकार',
    soilSelectPlaceholder: 'मिट्टी का प्रकार चुनें',
    farmAreaLabel: 'खेत का क्षेत्रफल (एकड़)',
    irrigationMethodLabel: 'सिंचाई की विधि',
    sowingDateLabel: 'बुआई की तारीख',
    generatePredictionBtn: 'उपज का पूर्वानुमान लगाएं',
    analyzingBtn: 'विश्लेषण किया जा रहा है...',
    predictedYieldTitle: 'अनुमानित उपज',
    expectedRevenueTitle: 'अपेक्षित राजस्व',
    estimatedLossTitle: 'जोखिम में अनुमानित मूल्य',
    currentPriceTitle: 'वर्तमान बाजार मूल्य (अनुमानित)',
    growthStageTitle: 'विकास चरण समयरेखा',
    riskAssessmentTitle: 'जोखिम मूल्यांकन',
    recommendationsTitle: 'सिफारिशें',
    weatherScore: 'मौसम स्कोर',
    soilScore: 'मिट्टी स्कोर',
    irrigation: 'सिंचाई',

    // Crops
    rice: 'धान (चावल)',
    wheat: 'गेहूं',
    sugarcane: 'गन्ना',
    cotton: 'कपास',
    maize: 'मक्का',
    soybean: 'सोयाबीन',
    groundnut: 'मूंगफली',
    mustard: 'सरसों',
    bajra: 'बाजरा',
    jowar: 'ज्वार',
    tur: 'अरहर (तुअर)',
    chana: 'चना',
    tomato: 'टमाटर',
    onion: 'प्याज़',
    potato: 'आलू',

    // Soils
    alluvial: 'जलोढ़ मिट्टी',
    alluvial_desc: 'गंगा-यमुना के मैदानों में पाई जाती है। पोटाश से भरपूर, अत्यधिक उपजाऊ।',
    black: 'काली मिट्टी (रेगुर)',
    black_desc: 'दक्कन का पठार। कैल्शियम, मैग्नीशियम से भरपूर। स्व-जुताई वाली मिट्टी।',
    red: 'लाल मिट्टी',
    red_desc: 'दक्षिणी और पूर्वी भारत। लोहे से भरपूर, नाइट्रोजन/फॉस्फोरस में कम।',
    laterite: 'लेटराइट मिट्टी',
    laterite_desc: 'पश्चिमी घाट और पूर्वोत्तर। अम्लीय, लोहे/एल्यूमीनियम से भरपूर।',
    clay: 'चिकनी मिट्टी',
    clay_desc: 'भारी बनावट, उच्च जल धारण क्षमता। गीली होने पर चिपचिपी।',
    sandy: 'बलुई मिट्टी',
    sandy_desc: 'राजस्थान, तटीय क्षेत्र। कम जल धारण क्षमता, जोतने में आसान।',
    loamy: 'दोमट मिट्टी',
    loamy_desc: 'रेत, गाद, मिट्टी का आदर्श मिश्रण। अधिकांश फसलों के लिए सर्वोत्तम।',
    mountain: 'पर्वतीय मिट्टी',
    mountain_desc: 'पहाड़ी क्षेत्र। ह्यूमस से भरपूर, अम्लीय, उच्च जैविक सामग्री।',
    desert: 'मरुस्थलीय मिट्टी',
    desert_desc: 'थार क्षेत्र। उच्च खनिज सामग्री, बहुत कम जैविक पदार्थ।',

    // Irrigation Methods
    rainfed: 'वर्षा आधारित (कोई सिंचाई नहीं)',
    flood: 'बाढ़ / सतह सिंचाई',
    sprinkler: 'छिड़काव (स्प्रिंकलर)',
    drip: 'टपकदार (ड्रिप) सिंचाई',
    furrow: 'नाली (फर्रो) सिंचाई',

    // Seasons & Units
    Kharif: 'खरीफ',
    Rabi: 'रबी',
    Annual: 'वार्षिक',
    'Year-round': 'साल भर',
    'Kharif/Rabi': 'खरीफ/रबी',
    'Year-round (Tomato)': 'साल भर',
    'sugarcane_unit': 'टन',
    'general_unit': 'क्विंटल',
    'per_acre': 'प्रति एकड़',

    // Growth Stages
    'Germination': 'अंकुरण',
    'Seedling': 'पौध अवस्था',
    'Tillering': 'कल्ले निकलना',
    'Flowering': 'फूल आना',
    'Grain Filling': 'दाना भरना',
    'Maturity': 'परिपक्वता',
    'Crown Root': 'मुकुट जड़',
    'Heading': 'बालियां निकलना',
    'Grand Growth': 'मुख्य वृद्धि',
    'Vegetative': 'वानस्पतिक वृद्धि',
    'Square Formation': 'डोडी बनना',
    'Boll Development': 'टिंडे का विकास',
    'Tasseling': 'नरमंजरी (टैसेलिंग)',
    'Silking': 'भुट्टा बनना (सिल्किंग)',
    'Pod Filling': 'फली भरना',
    'Pegging': 'पेगिंग (जड़ जमना)',
    'Siliqua Dev.': 'फलियों का विकास',
    'Fruiting': 'फल लगना',
    'Harvest Period': 'कटाई की अवधि',
    'Bulb Init.': 'कंद बनना',
    'Bulb Filling': 'कंद का विकास',
    'Sprout Dev.': 'अंकुर विकास',
    'Tuber Init.': 'आलू बनना शुरू',
    'Tuber Bulking': 'आलू का आकार बढ़ना',

    // Advisory Warnings
    listen: 'सुनें',
    stop: 'रोकें',
    heatStressTitle: 'गर्मी का तनाव चेतावनी — {days} दिन',
    heatStressBody: 'तापमान {temp}°C से अधिक हो जाएगा, जो {crop} की गर्मी सहनशीलता से अधिक है। यह फूलों को नुकसान पहुंचा सकता है, फल लगने को कम कर सकता है और विकास को धीमा कर सकता है।',
    heatStressAction1: 'मिट्टी का तापमान कम करने के लिए मल्च लगाएं',
    heatStressAction2: 'सुबह जल्दी या देर शाम को सिंचाई करें',
    heatStressAction3: 'यदि उपलब्ध हो तो छायादार जालों का उपयोग करें',
    heatStressAction4: 'गर्म दिनों में रोपाई से बचें',

    coldFrostTitle: 'ठंड/पाला का जोखिम — {days} दिन',
    coldFrostBody: 'न्यूनतम तापमान {temp}°C के पास या उससे नीचे गिर जाएगा। {crop} इस स्तर पर ठंड के प्रति संवेदनशील है।',
    coldFrostAction1: 'रात में युवा पौधों को प्लास्टिक/पुआल से ढकें',
    coldFrostAction2: 'मिट्टी की गर्मी बनाए रखने के लिए शाम को खेतों की सिंचाई करें',
    coldFrostAction3: 'ठंड के मौसम में छंटाई से बचें',

    idealTempTitle: 'तापमान — आदर्श सीमा',
    idealTempBody: 'सप्ताह के अधिकांश समय तापमान {crop} के लिए अनुकूलतम {minOpt}–{maxOpt}°C सीमा के भीतर है। बहुत बढ़िया बढ़ती स्थितियां!',
    idealTempAction1: 'नियमित फसल प्रबंधन जारी रखें',

    heavyRainTitle: 'भारी बारिश की चेतावनी — {days} दिन',
    heavyRainBody: 'भारी वर्षा ({dates}) पर होने की उम्मीद है। {crop} के लिए जलभराव और फसल के नुकसान का जोखिम।',
    heavyRainAction1: 'सुनिश्चित करें कि खेत की जल निकासी नाली साफ हो',
    heavyRainAction2: 'उर्वरक/कीटनाशक छिड़काव स्थगित करें',
    heavyRainAction3: 'भारी बारिश से पहले परिपक्व उपज की कटाई करें',
    heavyRainAction4: 'अस्थायी कवर के साथ क्यारियों की रक्षा करें',

    irrigationTitle: 'सिंचाई की आवश्यकता',
    irrigationBody: 'अपेक्षित वर्षा ({rain} मिमी) {crop} की साप्ताहिक पानी की आवश्यकता ({need} मिमी) से {deficit} मिमी कम है। {dry} सूखे दिन आगे हैं।',
    irrigationAction1: 'लगभग {deficit} मिमी की पूरक सिंचाई की योजना बनाएं',
    irrigationAction3: 'वाष्पीकरण को कम करने के लिए सुबह जल्दी पानी दें',

    waterAdequateTitle: 'पानी की आपूर्ति — पर्याप्त',
    waterAdequateBody: '{rain} मिमी की अपेक्षित वर्षा {crop} की साप्ताहिक पानी की आवश्यकता ({need} मिमी) को पूरा करती है।',
    waterAdequateAction1: 'इस सप्ताह अतिरिक्त सिंचाई की आवश्यकता नहीं है',

    highWindTitle: 'तेज हवा — छिड़काव का समय सीमित',
    highWindBody: '{days} दिनों में हवा की गति {limit} किमी/घंटे से अधिक हो जाएगी। कीटनाशक/उर्वरक छिड़काव के लिए उपयुक्त नहीं है।',
    highWindActionCalm: 'छिड़काव के लिए सबसे अच्छे दिन: {calm}',
    highWindActionMorning: 'हवा शांत होने पर सुबह जल्दी छिड़काव करने पर विचार करें',
    highWindActionStake: 'पौधों को गिरने से रोकने के लिए सहारा दें',

    strongWindTitle: 'तेज़ हवा की चेतावनी',
    strongWindBody: 'औसत अधिकतम हवा की गति {wind} किमी/घंटा है। फसल को शारीरिक नुकसान और मिट्टी की नमी के तेजी से नुकसान का जोखिम।',
    strongWindAction1: 'यदि संभव हो तो वायुरोधक (विंडब्रेक) लगाएं',
    strongWindAction2: 'ग्रीनहाउस/पॉलीटनल संरचनाओं को सुरक्षित करें',
    strongWindAction3: 'शांत अवधि तक रोपाई में देरी करें',

    diseaseRiskTitle: 'रोग का जोखिम — उच्च आर्द्रता ({percent}% घंटे)',
    diseaseRiskBody: 'इस सप्ताह {hours} घंटों तक आर्द्रता {limit}% से अधिक रहेगी। {crop} इन बीमारियों के प्रति संवेदनशील है: {diseases}।',
    diseaseRiskAction1: 'सूखे मौसम में निवारक कवकनाशी लगाएं',
    diseaseRiskAction2: 'हवा के संचार में सुधार करें (व्यापक दूरी, निचली पत्तियों को हटा दें)',
    diseaseRiskAction3: 'शुरुआती रोग के लक्षणों के लिए प्रतिदिन खेतों की निगरानी करें',
    diseaseRiskAction4: 'ओवरहेड सिंचाई से बचें',

    diseaseLowTitle: 'रोग का जोखिम — कम',
    diseaseLowBody: 'आर्द्रता का स्तर {crop} के लिए रोग सीमा से काफी नीचे है। कम कवक रोग दबाव की उम्मीद है।',
    diseaseLowAction1: 'नियमित निगरानी जारी रखें',

    highUVTitle: 'उच्च यूवी सूचकांक — {days} दिन',
    highUVBody: 'अत्यधिक उच्च यूवी विकिरण फलों पर सनस्कैल्ड (धूप से झुलसना) का कारण बन सकता है और नमी के नुकसान को तेज कर सकता है।',
    highUVAction1: 'संवेदनशील सब्जियों के लिए छायादार कपड़े का प्रयोग करें',
    highUVAction2: 'किसान: टोपी और सुरक्षात्मक कपड़े पहनें',
    highUVAction3: 'सुबह जल्दी या देर दोपहर में खेत के काम की योजना बनाएं',

    // Predictor results messages
    minimalYieldLoss: 'न्यूनतम उपज नुकसान की उम्मीद। स्थितियां आपकी फसल के अनुकूल हैं!',
    moderateYieldLoss: 'मध्यम उपज में कमी संभव। नुकसान कम करने के लिए सिफारिशों का पालन करें।',
    significantYieldLoss: 'फसल उपज में महत्वपूर्ण गिरावट की संभावना। अपनी फसल की सुरक्षा के लिए तत्काल कार्रवाई करें।',
    severeYieldLoss: 'फसल में भारी नुकसान होने की आशंका। सुरक्षात्मक उपाय करें और स्थानीय कृषि अधिकारी से सलाह लें।',
    weatherStressFactor: 'मौसम तनाव',
    soilMismatchFactor: 'मिट्टी बेमेल',
    riskFactorsFactor: 'जोखिम कारक',
    conditionsFavorableFactor: 'अनुकूल स्थितियां',
    currentStageLabel: 'वर्तमान चरण',
    daysSinceSowingLabel: 'बुआई के बाद से दिन',
    overallProgressLabel: 'कुल प्रगति',
    criticalPeriodLabel: 'क्रांतिक विकास अवधि',
    droughtStressRisk: 'सूखा तनाव',
    floodRisk: 'बाढ़ / जलभराव',
    heatStressRisk: 'गर्मी तनाव',
    diseasePressureRisk: 'रोग का दबाव',
    pestPressureRisk: 'कीट का दबाव',
    stageAdviceLabel: '{stage} चरण की देखभाल',
    irrigationScheduleLabel: 'सिंचाई अनुसूची',
    fungicideAppLabel: 'कवकनाशी अनुप्रयोग',
    heatMgmtLabel: 'गर्मी प्रबंधन',
    drainageMgmtLabel: 'जल निकासी प्रबंधन',
    soilAmendmentLabel: 'मिट्टी संशोधन',
    harvestPlanningLabel: 'कटाई की योजना',
    favorableCondLabel: 'अनुकूल परिस्थितियाँ',
    rangeLabel: 'सीमा',
    totalLabel: 'कुल',
    confidenceLabel: 'विश्वास',
    milletSeason: 'खरीफ/रबी',

    // Advisories general
    selectCropAdvisoryDefault: 'व्यक्तिगत सलाह प्राप्त करने के लिए ऊपर एक फसल का चयन करें',
    conditionFavorableDefault: 'स्थितियां आपकी फसल के अनुकूल हैं। नियमित प्रथाओं को जारी रखें।',
    weatherStressExpected: 'मौसम के कुछ तनाव की आशंका है। नीचे दी गई सलाह का ध्यानपूर्वक पालन करें।',
    highStressAhead: 'आगे उच्च तनाव की स्थिति है। तत्काल सुरक्षात्मक कार्रवाई करें।',

    // Activities
    plantingActivity: 'बुआई / रोपाई',
    sprayingActivity: 'कीटनाशक छिड़काव',
    harvestingActivity: 'कटाई',
    bestDayReason: 'कम बारिश ({rain} मिमी), हवा {wind} किमी/घंटा',

    // Crop Tips (Hindi)
    rice_tip_irrigation: 'कल्ले निकलने (tillering) की अवस्था के दौरान 5 सेमी स्थिर पानी बनाए रखें',
    wheat_tip_irrigation: 'मुकुट जड़ (crown root), कल्ले निकलने (tillering) और फूल आने की अवस्थाओं में महत्वपूर्ण सिंचाई करें',
    sugarcane_tip_irrigation: 'जलभराव से बचें; नालीदार (furrow) सिंचाई की सिफारिश की जाती है',
    cotton_tip_irrigation: 'फूल आने के समय टपकदार (drip) सिंचाई अत्यंत महत्वपूर्ण है',
    maize_tip_irrigation: 'भुट्टा बनने (tasseling/silking) के समय पानी की बहुत आवश्यकता होती है',
    soybean_tip_irrigation: 'जलभराव से बचें; खेतों में जल निकासी की उचित व्यवस्था सुनिश्चित करें',
    groundnut_tip_irrigation: 'पेगिंग (peg formation) और फलियाँ भरने की अवस्थाओं में सिंचाई बहुत महत्वपूर्ण है',
    mustard_tip_irrigation: 'बुआई के 25-30 दिन बाद पहली सिंचाई अत्यंत महत्वपूर्ण है',
    bajra_tip_irrigation: 'सूखा सहनशील है लेकिन दाना भरते समय पानी की आवश्यकता होती है',
    jowar_tip_irrigation: 'सूखा सहनशील है; फूल आने के समय एक सिंचाई करने से लाभ होता है',
    tur_tip_irrigation: 'सामान्यतः वर्षा आधारित फसल है; सूखा पड़ने पर फूल आने की अवस्था में सिंचाई करें',
    chana_tip_irrigation: 'केवल 1-2 सिंचाई की आवश्यकता होती है; अतिरिक्त पानी से बचें',
    tomato_tip_irrigation: 'नियमित टपकदार (drip) सिंचाई करें; नमी बनाए रखने के लिए मल्च का उपयोग करें',
    onion_tip_irrigation: 'कटाई से 10-15 दिन पहले सिंचाई बंद कर दें',
    potato_tip_irrigation: 'लगातार नमी आवश्यक है; 30 दिनों पर मिट्टी चढ़ाने का काम करें',

    // Weather Descriptions (Hindi)
    'Clear sky': 'साफ़ आकाश',
    'Mainly clear': 'मुख्यतः साफ़',
    'Partly cloudy': 'आंशिक रूप से बादल',
    'Overcast': 'घने बादल',
    'Foggy': 'कोहरा',
    'Rime fog': 'पाला कोहरा',
    'Light drizzle': 'हल्की बूंदाबांदी',
    'Moderate drizzle': 'मध्यम बूंदाबांदी',
    'Dense drizzle': 'तेज़ बूंदाबांदी',
    'Freezing drizzle': 'ठंडी बूंदाबांदी',
    'Heavy freezing drizzle': 'भारी ठंडी बूंदाबांदी',
    'Slight rain': 'हल्की बारिश',
    'Moderate rain': 'मध्यम बारिश',
    'Heavy rain': 'भारी बारिश',
    'Light freezing rain': 'हल्की जमी हुई बारिश',
    'Heavy freezing rain': 'भारी जमी हुई बारिश',
    'Slight snowfall': 'हल्का हिमपात',
    'Moderate snowfall': 'मध्यम हिमपात',
    'Heavy snowfall': 'भारी हिमपात',
    'Snow grains': 'बर्फ के दाने',
    'Slight showers': 'हल्की बौछारें',
    'Moderate showers': 'मध्यम बौछारें',
    'Violent showers': 'तेज़ बौछारें',
    'Slight snow showers': 'हल्की बर्फबारी बौछारें',
    'Heavy snow showers': 'भारी बर्फबारी बौछारें',
    'Thunderstorm': 'आंधी तूफान',
    'Thunderstorm + hail': 'आंधी तूफान + ओले',
    'Thunderstorm + heavy hail': 'आंधी तूफान + भारी ओले',

    // Calendar & Extra UI Labels (Hindi)
    Today: 'आज',
    'This Year': 'इस वर्ष',
    'Last Year': 'पिछले वर्ष',
    Safe: 'सुरक्षित',
    Caution: 'सावधानी',
    Alert: 'चेतावनी',
    minimal: 'न्यूनतम',
    moderate: 'मध्यम',
    significant: 'महत्वपूर्ण',
    severe: 'गंभीर',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'निम्न',
    priority: 'प्राथमिकता',

    // Fungal Diseases (Hindi)
    'Rice blast': 'धान का झोंका रोग (Blast)',
    'Sheath blight': 'शीथ ब्लाइट (Sheath Blight)',
    'Brown spot': 'भूरा धब्बा रोग (Brown Spot)',
    'Rust': 'गेरूई/रस्ट रोग (Rust)',
    'Karnal bunt': 'करनाल बंट (Karnal Bunt)',
    'Powdery mildew': 'चूर्णिल आसिता (Powdery Mildew)',
    'Red rot': 'लाल सड़न रोग (Red Rot)',
    'Smut': 'कंडुआ रोग (Smut)',
    'Wilt': 'उकठा रोग (Wilt)',
    'Boll rot': 'टिंडा सड़न रोग (Boll Rot)',
    'Bacterial blight': 'जीवाणु झुलसा रोग (Bacterial Blight)',
    'Fusarium wilt': 'फ्यूजेरियम विल्ट',
    'Maydis leaf blight': 'मायडिस पत्ती झुलसा रोग',
    'Downy mildew': 'मृदुरोमिल आसिता (Downy Mildew)',
    'Stalk rot': 'तना सड़न रोग',
    'Yellow mosaic': 'पीला मोज़ेक वायरस',
    'Anthracnose': 'एंथ्रेक्नोज (Anthracnose)',
    'Tikka leaf spot': 'टिक्का पत्ती धब्बा रोग',
    'Collar rot': 'कॉलर रॉट तना सड़न रोग',
    'White rust': 'सफेद रस्ट रोग (White Rust)',
    'Alternaria blight': 'अल्टरनेरिया झुलसा रोग',
    'Ergot': 'अर्गट रोग (Ergot)',
    'Grain mold': 'अनाज फफूंद रोग',
    'Charcoal rot': 'कोयला सड़न (Charcoal Rot)',
    'Sterility mosaic': 'बांझपन मोज़ेक रोग',
    'Pod borer': 'फली छेदक कीट (Pod Borer)',
    'Ascochyta blight': 'एस्कोचाइटा झुलसा रोग',
    'Botrytis grey mould': 'धूसर फफूंद रोग',
    'Late blight': 'पछेती झुलसा रोग (Late Blight)',
    'Early blight': 'अगेती झुलसा रोग (Early Blight)',
    'Bacterial wilt': 'जीवाणु मुरझान रोग',
    'Purple blotch': 'बैंगनी धब्बा रोग (Purple Bloch)',
    'Stemphylium blight': 'स्टेमफिलियम झुलसा रोग',
    'Common scab': 'साधारण खुरंड रोग (Common Scab)'
  }
};

let currentLang = 'en';
let synth = window.speechSynthesis;

export function setLanguage(lang) {
  if (DICTIONARY[lang]) {
    currentLang = lang;
    document.documentElement.lang = lang;
    updateUI();
  }
}

export function getLang() {
  return currentLang;
}

export function t(key, params = {}) {
  let val = DICTIONARY[currentLang][key] || DICTIONARY['en'][key] || key;
  Object.keys(params).forEach(p => {
    val = val.replace(`{${p}}`, params[p]);
  });
  return val;
}

function updateUI() {
  // Translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
}

// ─── Voice Synthesis ───
export function speakText(text) {
  if (!synth) return;
  
  synth.cancel(); // Stop any ongoing speech

  // Clean text of emojis if any remain, although we removed them from codebase
  const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Try to find a voice that matches the current language
  const voices = synth.getVoices();
  const langPrefix = currentLang === 'hi' ? 'hi-IN' : 'en-';
  
  const voice = voices.find(v => v.lang.startsWith(langPrefix)) || voices[0];
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
  utterance.rate = 0.85; // Slightly slower for clear understanding by farmers
  utterance.pitch = 1.0;
  
  synth.speak(utterance);
}

export function stopSpeaking() {
  if (synth) synth.cancel();
}

// Ensure voices are loaded (browser quirk)
if (synth && synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = () => synth.getVoices();
}
