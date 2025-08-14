/**
 * Weather Service
 * 
 * Handles real-time weather data fetching for location-aware moon theme
 * Respects user privacy and provides graceful fallbacks
 */

export interface WeatherData {
  clouds: number;        // Cloud coverage 0-100%
  visibility: number;    // Visibility in meters
  weather: string;       // Clear, Clouds, Rain, Snow, etc.
  timezone: number;      // UTC offset in seconds
  temperature: number;   // Temperature in Celsius
  humidity: number;      // Humidity percentage
  windSpeed: number;     // Wind speed in m/s
  description: string;   // Weather description
  icon: string;         // Weather icon code
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timezone?: string;
}

class WeatherService {
  private readonly API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';
  private cache = new Map<string, { data: WeatherData; timestamp: number }>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Get user's location with privacy-first approach
   */
  async getUserLocation(): Promise<LocationData | null> {
    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        return this.getIPBasedLocation();
      }

      // Request permission with timeout
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Location request timeout'));
        }, 10000); // 10 second timeout

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeoutId);
            resolve(pos);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          },
          {
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 5 * 60 * 1000 // 5 minutes
          }
        );
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.warn('Failed to get precise location:', error);
      return this.getIPBasedLocation();
    }
  }

  /**
   * Fallback to IP-based location (less precise but privacy-friendly)
   */
  private async getIPBasedLocation(): Promise<LocationData | null> {
    try {
      // Using ipapi.co for IP-based location (free tier)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          city: data.city,
          country: data.country_name,
          timezone: data.timezone
        };
      }
    } catch (error) {
      console.warn('Failed to get IP-based location:', error);
    }

    // Ultimate fallback - default location (you can set this to your preferred location)
    return {
      latitude: 40.7128, // New York City
      longitude: -74.0060,
      city: 'New York',
      country: 'United States'
    };
  }

  /**
   * Get weather data for location
   */
  async getWeatherData(location: LocationData): Promise<WeatherData | null> {
    if (!this.API_KEY) {
      console.warn('OpenWeather API key not configured');
      return this.getMockWeatherData();
    }

    const cacheKey = `${location.latitude},${location.longitude}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const url = `${this.BASE_URL}/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${this.API_KEY}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        clouds: data.clouds?.all || 0,
        visibility: data.visibility || 10000,
        weather: data.weather?.[0]?.main || 'Clear',
        timezone: data.timezone || 0,
        temperature: data.main?.temp || 20,
        humidity: data.main?.humidity || 50,
        windSpeed: data.wind?.speed || 0,
        description: data.weather?.[0]?.description || 'clear sky',
        icon: data.weather?.[0]?.icon || '01d'
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });

      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return this.getMockWeatherData();
    }
  }

  /**
   * Mock weather data for development/fallback
   */
  private getMockWeatherData(): WeatherData {
    return {
      clouds: 20,
      visibility: 10000,
      weather: 'Clear',
      timezone: 0,
      temperature: 22,
      humidity: 45,
      windSpeed: 2.5,
      description: 'clear sky',
      icon: '01n'
    };
  }

  /**
   * Check if it's currently night time at the location
   */
  isNightTime(location: LocationData, weather?: WeatherData): boolean {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utcTime + ((weather?.timezone || 0) * 1000));
    const hour = localTime.getHours();
    
    // Consider it night between 6 PM and 6 AM
    return hour >= 18 || hour < 6;
  }

  /**
   * Calculate moon visibility based on weather conditions
   */
  calculateMoonVisibility(weather: WeatherData, moonIllumination: number = 0.5): number {
    const baseVisibility = moonIllumination;
    const cloudReduction = weather.clouds / 100;
    const weatherModifier = this.getWeatherModifier(weather.weather);
    const visibilityModifier = Math.min(weather.visibility / 10000, 1);
    
    return Math.max(0.1, baseVisibility * (1 - cloudReduction * 0.7) * weatherModifier * visibilityModifier);
  }

  /**
   * Get weather-specific visibility modifier
   */
  private getWeatherModifier(weatherType: string): number {
    const modifiers: Record<string, number> = {
      'Clear': 1.0,
      'Clouds': 0.6,
      'Rain': 0.2,
      'Drizzle': 0.4,
      'Thunderstorm': 0.1,
      'Snow': 0.3,
      'Mist': 0.5,
      'Fog': 0.2,
      'Haze': 0.7,
      'Dust': 0.4,
      'Sand': 0.3,
      'Ash': 0.2,
      'Squall': 0.3,
      'Tornado': 0.1
    };

    return modifiers[weatherType] || 0.8;
  }

  /**
   * Get weather-based visual effects configuration
   */
  getWeatherEffects(weather: WeatherData) {
    const effects = {
      'Clear': {
        moonGlow: 1.0,
        starVisibility: 0.9,
        atmosphere: 'crisp',
        cloudLayers: 0,
        particles: null
      },
      'Clouds': {
        moonGlow: 0.4,
        starVisibility: 0.3,
        atmosphere: 'hazy',
        cloudLayers: 2,
        particles: null
      },
      'Rain': {
        moonGlow: 0.1,
        starVisibility: 0.05,
        atmosphere: 'stormy',
        cloudLayers: 3,
        particles: 'rain'
      },
      'Snow': {
        moonGlow: 0.3,
        starVisibility: 0.2,
        atmosphere: 'muffled',
        cloudLayers: 2,
        particles: 'snow'
      },
      'Thunderstorm': {
        moonGlow: 0.05,
        starVisibility: 0.0,
        atmosphere: 'dramatic',
        cloudLayers: 4,
        particles: 'storm'
      }
    };

    return effects[weather.weather as keyof typeof effects] || effects['Clear'];
  }
}

export const weatherService = new WeatherService();
export default weatherService;