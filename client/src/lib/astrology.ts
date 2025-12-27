const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

interface CelestialPosition {
  longitude: number;
  sign: string;
  degree: number;
}

function toJulianDate(date: Date, hours: number = 12): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let y = year;
  let m = month;
  
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  
  const JD = Math.floor(365.25 * (y + 4716)) + 
             Math.floor(30.6001 * (m + 1)) + 
             day + hours / 24 + B - 1524.5;
  
  return JD;
}

function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

function longitudeToSign(longitude: number): { sign: string; degree: number } {
  const normalized = normalizeAngle(longitude);
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  return { sign: ZODIAC_SIGNS[signIndex], degree };
}

function calculateSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
  
  const Mrad = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);
  
  const sunLong = normalizeAngle(L0 + C);
  return sunLong;
}

function calculateMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  
  const Drad = D * Math.PI / 180;
  const Mrad = M * Math.PI / 180;
  const Mprad = Mp * Math.PI / 180;
  const Frad = F * Math.PI / 180;
  
  let longitude = Lp;
  longitude += 6.288774 * Math.sin(Mprad);
  longitude += 1.274027 * Math.sin(2 * Drad - Mprad);
  longitude += 0.658314 * Math.sin(2 * Drad);
  longitude += 0.213618 * Math.sin(2 * Mprad);
  longitude -= 0.185116 * Math.sin(Mrad);
  longitude -= 0.114332 * Math.sin(2 * Frad);
  longitude += 0.058793 * Math.sin(2 * Drad - 2 * Mprad);
  longitude += 0.057066 * Math.sin(2 * Drad - Mrad - Mprad);
  longitude += 0.053322 * Math.sin(2 * Drad + Mprad);
  
  return normalizeAngle(longitude);
}

function calculateMercuryLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 252.2509 + 149474.0722 * T;
  const M = 174.7948 + 149472.5153 * T;
  const Mrad = M * Math.PI / 180;
  
  let longitude = L;
  longitude += 23.4400 * Math.sin(Mrad);
  longitude += 2.9818 * Math.sin(2 * Mrad);
  longitude += 0.5255 * Math.sin(3 * Mrad);
  
  return normalizeAngle(longitude);
}

function calculateVenusLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 181.9798 + 58519.2130 * T;
  const M = 50.4161 + 58517.8039 * T;
  const Mrad = M * Math.PI / 180;
  
  let longitude = L;
  longitude += 0.7758 * Math.sin(Mrad);
  longitude += 0.0033 * Math.sin(2 * Mrad);
  
  return normalizeAngle(longitude);
}

function calculateMarsLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 355.4330 + 19141.6964 * T;
  const M = 19.3730 + 19140.3023 * T;
  const Mrad = M * Math.PI / 180;
  
  let longitude = L;
  longitude += 10.6912 * Math.sin(Mrad);
  longitude += 0.6228 * Math.sin(2 * Mrad);
  longitude += 0.0503 * Math.sin(3 * Mrad);
  
  return normalizeAngle(longitude);
}

function calculateJupiterLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 34.3515 + 3036.3027 * T;
  const M = 20.0202 + 3034.9057 * T;
  const Mrad = M * Math.PI / 180;
  
  let longitude = L;
  longitude += 5.5549 * Math.sin(Mrad);
  longitude += 0.1683 * Math.sin(2 * Mrad);
  
  return normalizeAngle(longitude);
}

function calculateSaturnLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 50.0774 + 1223.5110 * T;
  const M = 317.0207 + 1222.1138 * T;
  const Mrad = M * Math.PI / 180;
  
  let longitude = L;
  longitude += 6.4040 * Math.sin(Mrad);
  longitude += 0.2235 * Math.sin(2 * Mrad);
  
  return normalizeAngle(longitude);
}

function calculateUranusLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 314.0550 + 429.8640 * T;
  return normalizeAngle(L);
}

function calculateNeptuneLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 304.3487 + 219.8833 * T;
  return normalizeAngle(L);
}

function calculatePlutoLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 238.9286 + 145.2078 * T;
  return normalizeAngle(L);
}

function calculateNorthNodeLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const omega = 125.04452 - 1934.136261 * T;
  return normalizeAngle(omega);
}

function calculateAscendant(jd: number, latitude: number, longitude: number, birthHour: number): number {
  const T = (jd - 2451545.0) / 36525;
  
  const LST = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + longitude + birthHour * 15) % 360;
  
  const epsilon = 23.439291 - 0.0130042 * T;
  const epsilonRad = epsilon * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const LSTrad = LST * Math.PI / 180;
  
  const ascRad = Math.atan2(
    Math.cos(LSTrad),
    -(Math.sin(LSTrad) * Math.cos(epsilonRad) + Math.tan(latRad) * Math.sin(epsilonRad))
  );
  
  let asc = ascRad * 180 / Math.PI;
  if (Math.cos(LSTrad) < 0) asc += 180;
  
  return normalizeAngle(asc);
}

function calculateMidheaven(jd: number, longitude: number, birthHour: number): number {
  const T = (jd - 2451545.0) / 36525;
  
  const LST = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + longitude + birthHour * 15) % 360;
  
  const epsilon = 23.439291 - 0.0130042 * T;
  const epsilonRad = epsilon * Math.PI / 180;
  const LSTrad = LST * Math.PI / 180;
  
  const mcRad = Math.atan2(Math.sin(LSTrad), Math.cos(LSTrad) * Math.cos(epsilonRad));
  let mc = mcRad * 180 / Math.PI;
  
  if (mc < 0) mc += 360;
  
  return normalizeAngle(mc);
}

function calculateHouse(planetLongitude: number, ascendant: number): number {
  const diff = normalizeAngle(planetLongitude - ascendant);
  const house = Math.floor(diff / 30) + 1;
  return house > 12 ? house - 12 : house;
}

export interface NatalChartData {
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    house: number;
  }>;
  ascendant: {
    name: string;
    sign: string;
    degree: number;
    house: number;
  };
  midheaven?: {
    name: string;
    sign: string;
    degree: number;
    house: number;
  };
}

export function calculateNatalChart(
  birthDate: Date,
  birthTime: string | undefined,
  latitude: number,
  longitude: number
): NatalChartData {
  let hours = 12;
  if (birthTime) {
    const timeParts = birthTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeParts) {
      let h = parseInt(timeParts[1]);
      const m = parseInt(timeParts[2]);
      const period = timeParts[3]?.toUpperCase();
      
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      
      hours = h + m / 60;
    }
  }
  
  const jd = toJulianDate(birthDate, hours);
  
  const sunLong = calculateSunLongitude(jd);
  const moonLong = calculateMoonLongitude(jd);
  const mercuryLong = calculateMercuryLongitude(jd);
  const venusLong = calculateVenusLongitude(jd);
  const marsLong = calculateMarsLongitude(jd);
  const jupiterLong = calculateJupiterLongitude(jd);
  const saturnLong = calculateSaturnLongitude(jd);
  const uranusLong = calculateUranusLongitude(jd);
  const neptuneLong = calculateNeptuneLongitude(jd);
  const plutoLong = calculatePlutoLongitude(jd);
  const northNodeLong = calculateNorthNodeLongitude(jd);
  
  const ascendantLong = calculateAscendant(jd, latitude, longitude, hours);
  const midheavenLong = calculateMidheaven(jd, longitude, hours);
  
  const sunPos = longitudeToSign(sunLong);
  const moonPos = longitudeToSign(moonLong);
  const mercuryPos = longitudeToSign(mercuryLong);
  const venusPos = longitudeToSign(venusLong);
  const marsPos = longitudeToSign(marsLong);
  const jupiterPos = longitudeToSign(jupiterLong);
  const saturnPos = longitudeToSign(saturnLong);
  const uranusPos = longitudeToSign(uranusLong);
  const neptunePos = longitudeToSign(neptuneLong);
  const plutoPos = longitudeToSign(plutoLong);
  const northNodePos = longitudeToSign(northNodeLong);
  const ascendantPos = longitudeToSign(ascendantLong);
  const midheavenPos = longitudeToSign(midheavenLong);
  
  const planets = [
    { name: "Sun", ...sunPos, house: calculateHouse(sunLong, ascendantLong) },
    { name: "Moon", ...moonPos, house: calculateHouse(moonLong, ascendantLong) },
    { name: "Mercury", ...mercuryPos, house: calculateHouse(mercuryLong, ascendantLong) },
    { name: "Venus", ...venusPos, house: calculateHouse(venusLong, ascendantLong) },
    { name: "Mars", ...marsPos, house: calculateHouse(marsLong, ascendantLong) },
    { name: "Jupiter", ...jupiterPos, house: calculateHouse(jupiterLong, ascendantLong) },
    { name: "Saturn", ...saturnPos, house: calculateHouse(saturnLong, ascendantLong) },
    { name: "Uranus", ...uranusPos, house: calculateHouse(uranusLong, ascendantLong) },
    { name: "Neptune", ...neptunePos, house: calculateHouse(neptuneLong, ascendantLong) },
    { name: "Pluto", ...plutoPos, house: calculateHouse(plutoLong, ascendantLong) },
    { name: "North Node", ...northNodePos, house: calculateHouse(northNodeLong, ascendantLong) },
  ];
  
  return {
    planets,
    ascendant: { name: "Ascendant", ...ascendantPos, house: 1 },
    midheaven: { name: "Midheaven", ...midheavenPos, house: 10 }
  };
}
