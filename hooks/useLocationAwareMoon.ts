/**
 * Location-Aware Moon Hook
 * 
 * Custom hook for managing location-aware moon theme state
 * Handles privacy, permissions, and real-time data updates
 */

import { useState, useEffect, useCallback } from 'react';
import { weatherService, type WeatherData, type LocationData } from '@/lib/services/weatherService';
import { moonService, type MoonData, type MoonPosition } from '@/lib/services/moonService';

export interface LocationMoonState {
  weather: WeatherData | null;
  location: LocationData | null;
  moonData: MoonData | null;
  moonPosition: MoonPosition | null;
  isNightTime: boolean;
  moonVisibility: number;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
  lastUpdated: Date | null;
}

export interface LocationMoonControls {
  requestLocationPermission: () => Promise<boolean>;
  refreshData: () => Promise<void>;
  setManualLocation: (lat: number, lon: number) => Promise<void>;
  clearError: () => void;
}

export const useLocationAwareMoon = (enableAutoUpdate = true) => {
  const [state, setState] = useState<LocationMoonState>({
    weather: null,
    location: null,
    moonData: null,
    moonPosition: null,
    isNightTime: false,
    moonVisibility: 0.5,
    loading: false,
    error: null,
    permissionGranted: false,
    lastUpdated: null
  });

  /**
   * Initialize or refresh location and weather data
   */
  const refreshData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Get user location
      const location = await weatherService.getUserLocation();
      if (!location) {
        throw new Error('Unable to determine location');
      }

      // Get weather data
      const weather = await weatherService.getWeatherData(location);
      if (!weather) {
        throw new Error('Unable to fetch weather data');
      }

      // Get moon data
      const now = new Date();
      const moonData = moonService.getCurrentMoonData(now);
      const moonPosition = moonService.getMoonPosition(now, location.latitude, location.longitude);

      // Calculate visibility and night time
      const isNightTime = weatherService.isNightTime(location, weather);
      const weatherVisibility = weatherService.calculateMoonVisibility(weather, moonData.illumination / 100);
      const moonVisibility = moonService.getMoonVisibilityScore(moonPosition, moonData, weatherVisibility);

      setState({
        weather,
        location,
        moonData,
        moonPosition,
        isNightTime,
        moonVisibility,
        loading: false,
        error: null,
        permissionGranted: true,
        lastUpdated: now
      });

      return true;
    } catch (error) {
      console.warn('Location-aware moon data refresh failed:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        permissionGranted: false,
        lastUpdated: new Date()
      }));
      return false;
    }
  }, []);

  /**
   * Request location permission explicitly
   */
  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation not supported' }));
      return false;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000
        });
      });

      setState(prev => ({ ...prev, permissionGranted: true, error: null }));
      await refreshData();
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        permissionGranted: false,
        error: 'Location permission denied or unavailable'
      }));
      return false;
    }
  }, [refreshData]);

  /**
   * Set manual location (for users who prefer not to share precise location)
   */
  const setManualLocation = useCallback(async (lat: number, lon: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const location: LocationData = { latitude: lat, longitude: lon };
      const weather = await weatherService.getWeatherData(location);
      
      if (!weather) {
        throw new Error('Unable to fetch weather data for location');
      }

      const now = new Date();
      const moonData = moonService.getCurrentMoonData(now);
      const moonPosition = moonService.getMoonPosition(now, lat, lon);

      const isNightTime = weatherService.isNightTime(location, weather);
      const weatherVisibility = weatherService.calculateMoonVisibility(weather, moonData.illumination / 100);
      const moonVisibility = moonService.getMoonVisibilityScore(moonPosition, moonData, weatherVisibility);

      setState({
        weather,
        location,
        moonData,
        moonPosition,
        isNightTime,
        moonVisibility,
        loading: false,
        error: null,
        permissionGranted: true,
        lastUpdated: now
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to set manual location'
      }));
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-refresh data every 30 minutes
  useEffect(() => {
    if (!enableAutoUpdate) return;

    const interval = setInterval(() => {
      if (state.permissionGranted && !state.loading) {
        refreshData();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [enableAutoUpdate, state.permissionGranted, state.loading, refreshData]);

  // Initial data load
  useEffect(() => {
    if (enableAutoUpdate && !state.lastUpdated && !state.loading) {
      refreshData();
    }
  }, [enableAutoUpdate, state.lastUpdated, state.loading, refreshData]);

  const controls: LocationMoonControls = {
    requestLocationPermission,
    refreshData,
    setManualLocation,
    clearError
  };

  return { state, controls };
};

export default useLocationAwareMoon;