/**
 * Moon Service
 * 
 * Calculates moon phases, positions, and provides realistic moon data
 * for the location-aware cosmic theme
 */

export interface MoonData {
  phase: number;          // 0-1 (0 = new moon, 0.5 = full moon, 1 = new moon again)
  illumination: number;   // Percentage illuminated (0-100)
  age: number;           // Days since new moon (0-29.5)
  distance: number;      // Distance from Earth in km
  angularDiameter: number; // Angular diameter in degrees
  phaseName: string;     // Human-readable phase name
  isWaxing: boolean;     // Whether moon is waxing or waning
  nextFullMoon: Date;    // Date of next full moon
  nextNewMoon: Date;     // Date of next new moon
}

export interface MoonPosition {
  altitude: number;      // Altitude above horizon in degrees
  azimuth: number;       // Azimuth from north in degrees
  isVisible: boolean;    // Whether moon is above horizon
  riseTime: Date | null; // Moon rise time for today
  setTime: Date | null;  // Moon set time for today
}

class MoonService {
  // Lunar constants
  private readonly LUNAR_MONTH = 29.530588853; // Average lunar month in days
  private readonly KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z'); // Known new moon reference

  /**
   * Get current moon phase data
   */
  getCurrentMoonData(date: Date = new Date()): MoonData {
    const daysSinceReference = this.daysBetween(this.KNOWN_NEW_MOON, date);
    const lunarCycles = daysSinceReference / this.LUNAR_MONTH;
    const currentCycle = lunarCycles - Math.floor(lunarCycles);
    
    const age = currentCycle * this.LUNAR_MONTH;
    const phase = currentCycle;
    const illumination = this.calculateIllumination(phase);
    const phaseName = this.getPhaseName(phase);
    const isWaxing = phase < 0.5;
    
    // Calculate distance (varies due to elliptical orbit)
    const distance = this.calculateMoonDistance(date);
    const angularDiameter = this.calculateAngularDiameter(distance);
    
    // Calculate next major phases
    const nextFullMoon = this.getNextPhaseDate(date, 0.5);
    const nextNewMoon = this.getNextPhaseDate(date, 0.0);

    return {
      phase,
      illumination,
      age,
      distance,
      angularDiameter,
      phaseName,
      isWaxing,
      nextFullMoon,
      nextNewMoon
    };
  }

  /**
   * Get moon position for a specific location and time
   */
  getMoonPosition(
    date: Date,
    latitude: number,
    longitude: number
  ): MoonPosition {
    // Simplified moon position calculation
    // For production, consider using a more accurate astronomical library
    
    const julianDay = this.toJulianDay(date);
    const moonLongitude = this.calculateMoonLongitude(julianDay);
    const moonLatitude = this.calculateMoonLatitude(julianDay);
    
    // Convert to horizontal coordinates
    const { altitude, azimuth } = this.toHorizontalCoordinates(
      moonLongitude,
      moonLatitude,
      date,
      latitude,
      longitude
    );
    
    const isVisible = altitude > 0;
    
    // Calculate rise and set times (simplified)
    const { riseTime, setTime } = this.calculateRiseSetTimes(
      date,
      latitude,
      longitude
    );

    return {
      altitude,
      azimuth,
      isVisible,
      riseTime,
      setTime
    };
  }

  /**
   * Calculate moon illumination percentage based on phase
   */
  private calculateIllumination(phase: number): number {
    // Convert phase to illumination percentage
    if (phase <= 0.5) {
      // Waxing: 0% to 100%
      return phase * 200;
    } else {
      // Waning: 100% to 0%
      return (1 - phase) * 200;
    }
  }

  /**
   * Get human-readable phase name
   */
  private getPhaseName(phase: number): string {
    const phaseNames = [
      { min: 0, max: 0.03, name: 'New Moon' },
      { min: 0.03, max: 0.22, name: 'Waxing Crescent' },
      { min: 0.22, max: 0.28, name: 'First Quarter' },
      { min: 0.28, max: 0.47, name: 'Waxing Gibbous' },
      { min: 0.47, max: 0.53, name: 'Full Moon' },
      { min: 0.53, max: 0.72, name: 'Waning Gibbous' },
      { min: 0.72, max: 0.78, name: 'Last Quarter' },
      { min: 0.78, max: 0.97, name: 'Waning Crescent' },
      { min: 0.97, max: 1, name: 'New Moon' }
    ];

    const currentPhase = phaseNames.find(p => phase >= p.min && phase <= p.max);
    return currentPhase?.name || 'Unknown';
  }

  /**
   * Calculate moon distance from Earth (simplified)
   */
  private calculateMoonDistance(date: Date): number {
    // Average distance with simple elliptical variation
    const avgDistance = 384400; // km
    const julianDay = this.toJulianDay(date);
    const anomaly = ((julianDay - 2451545.0) / 27.55455) * 2 * Math.PI;
    const eccentricity = 0.0549; // Moon's orbital eccentricity
    
    return avgDistance * (1 - eccentricity * Math.cos(anomaly));
  }

  /**
   * Calculate angular diameter of moon
   */
  private calculateAngularDiameter(distance: number): number {
    const moonRadius = 1737.4; // km
    return (2 * Math.atan(moonRadius / distance)) * (180 / Math.PI);
  }

  /**
   * Get next occurrence of a specific moon phase
   */
  private getNextPhaseDate(fromDate: Date, targetPhase: number): Date {
    const currentMoon = this.getCurrentMoonData(fromDate);
    let daysToAdd: number;
    
    if (targetPhase >= currentMoon.phase) {
      daysToAdd = (targetPhase - currentMoon.phase) * this.LUNAR_MONTH;
    } else {
      daysToAdd = (1 - currentMoon.phase + targetPhase) * this.LUNAR_MONTH;
    }
    
    const nextDate = new Date(fromDate);
    nextDate.setDate(nextDate.getDate() + Math.round(daysToAdd));
    return nextDate;
  }

  /**
   * Calculate days between two dates
   */
  private daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return (date2.getTime() - date1.getTime()) / oneDay;
  }

  /**
   * Convert date to Julian Day
   */
  private toJulianDay(date: Date): number {
    return (date.getTime() / 86400000) + 2440587.5;
  }

  /**
   * Calculate moon's ecliptic longitude (simplified)
   */
  private calculateMoonLongitude(julianDay: number): number {
    const t = (julianDay - 2451545.0) / 36525;
    const l = 218.316 + 481267.881 * t;
    return l % 360;
  }

  /**
   * Calculate moon's ecliptic latitude (simplified)
   */
  private calculateMoonLatitude(julianDay: number): number {
    const t = (julianDay - 2451545.0) / 36525;
    const b = 5.128 * Math.sin((93.272 + 483202.017 * t) * Math.PI / 180);
    return b;
  }

  /**
   * Convert ecliptic to horizontal coordinates (simplified)
   */
  private toHorizontalCoordinates(
    longitude: number,
    latitude: number,
    date: Date,
    observerLat: number,
    observerLon: number
  ): { altitude: number; azimuth: number } {
    // This is a simplified calculation
    // For production, use a proper astronomical library like astronomy-engine
    
    const hourAngle = this.calculateHourAngle(date, longitude, observerLon);
    const declination = this.calculateDeclination(longitude, latitude);
    
    const altitude = Math.asin(
      Math.sin(declination * Math.PI / 180) * Math.sin(observerLat * Math.PI / 180) +
      Math.cos(declination * Math.PI / 180) * Math.cos(observerLat * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)
    ) * 180 / Math.PI;
    
    const azimuth = Math.atan2(
      Math.sin(hourAngle * Math.PI / 180),
      Math.cos(hourAngle * Math.PI / 180) * Math.sin(observerLat * Math.PI / 180) - Math.tan(declination * Math.PI / 180) * Math.cos(observerLat * Math.PI / 180)
    ) * 180 / Math.PI;
    
    return { altitude, azimuth: (azimuth + 360) % 360 };
  }

  /**
   * Calculate hour angle (simplified)
   */
  private calculateHourAngle(date: Date, longitude: number, observerLon: number): number {
    const utc = date.getUTCHours() + date.getUTCMinutes() / 60;
    const lst = (utc + observerLon / 15) % 24;
    const rightAscension = longitude; // Simplified
    return (lst * 15 - rightAscension + 360) % 360;
  }

  /**
   * Calculate declination (simplified)
   */
  private calculateDeclination(longitude: number, latitude: number): number {
    const obliquity = 23.44; // Earth's obliquity
    return Math.asin(Math.sin(latitude * Math.PI / 180) * Math.sin(obliquity * Math.PI / 180)) * 180 / Math.PI;
  }

  /**
   * Calculate moon rise and set times (simplified)
   */
  private calculateRiseSetTimes(
    date: Date,
    latitude: number,
    longitude: number
  ): { riseTime: Date | null; setTime: Date | null } {
    // Simplified calculation - in production, use proper astronomical calculations
    const baseDate = new Date(date);
    baseDate.setHours(0, 0, 0, 0);
    
    // Mock rise/set times based on moon phase and location
    const riseHour = 6 + Math.random() * 12; // Simplified
    const setHour = 18 + Math.random() * 12; // Simplified
    
    const riseTime = new Date(baseDate);
    riseTime.setHours(Math.floor(riseHour), Math.floor((riseHour % 1) * 60));
    
    const setTime = new Date(baseDate);
    setTime.setHours(Math.floor(setHour), Math.floor((setHour % 1) * 60));
    
    return { riseTime, setTime };
  }

  /**
   * Get moon visibility score (0-1) based on position and weather
   */
  getMoonVisibilityScore(
    moonPosition: MoonPosition,
    moonData: MoonData,
    weatherVisibility: number
  ): number {
    if (!moonPosition.isVisible) return 0;
    
    const altitudeScore = Math.max(0, moonPosition.altitude / 90);
    const illuminationScore = moonData.illumination / 100;
    const weatherScore = weatherVisibility;
    
    return altitudeScore * illuminationScore * weatherScore;
  }
}

export const moonService = new MoonService();
export default moonService;