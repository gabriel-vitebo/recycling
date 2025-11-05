import { ref } from 'vue'

const STORAGE_KEY = 'user_location'

export function useLocation() {
  const latitude = ref<number | null>(null)
  const longitude = ref<number | null>(null)
  const status = ref<'idle' | 'stored' | 'granted' | 'denied' | 'prompt' | 'error'>('idle')
  const error = ref<string | null>(null)

  // Load stored value on client initialization
  if (process.client) {
    loadFromStorage()
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
        latitude.value = parsed.lat
        longitude.value = parsed.lng
        status.value = 'stored'
        error.value = null
      }
    } catch (err: any) {
      // Do not throw in composable; just set error state
      console.warn('useLocation: failed to read storage', err)
      error.value = String(err)
      status.value = 'error'
    }
  }

  function saveToStorage(lat: number, lng: number) {
    try {
      const payload = JSON.stringify({ lat, lng, timestamp: Date.now() })
      localStorage.setItem(STORAGE_KEY, payload)
    } catch (err: any) {
      console.warn('useLocation: failed to save storage', err)
      error.value = String(err)
      status.value = 'error'
    }
  }

  function clearStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (err: any) {
      console.warn('useLocation: failed to clear storage', err)
      error.value = String(err)
      status.value = 'error'
    }
    latitude.value = null
    longitude.value = null
    status.value = 'idle'
  }

  function setLocation(lat: number, lng: number) {
    latitude.value = lat
    longitude.value = lng
    status.value = 'stored'
    error.value = null
    if (process.client) saveToStorage(lat, lng)
  }

  async function requestLocation(options?: PositionOptions): Promise<{ lat: number; lng: number } | null> {
    if (!process.client) {
      error.value = 'not-client'
      status.value = 'error'
      return null
    }

    if (!('geolocation' in navigator)) {
      error.value = 'no-geolocation'
      status.value = 'error'
      return null
    }

    // If Permissions API is available, check state first to avoid an immediate prompt when denied
    try {
      const navAny = navigator as any
      if (navAny.permissions && typeof navAny.permissions.query === 'function') {
        try {
          const perm = await navAny.permissions.query({ name: 'geolocation' })
          // perm.state is 'granted' | 'denied' | 'prompt'
          if (perm.state === 'denied') {
            status.value = 'denied'
            error.value = 'permission-denied'
            return null
          }
          if (perm.state === 'granted') {
            status.value = 'granted'
          }
        } catch (_) {
          // ignore permission API errors and proceed to request
        }
      }
    } catch (_) {
      // ignore
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          latitude.value = lat
          longitude.value = lng
          status.value = 'granted'
          error.value = null
          saveToStorage(lat, lng)
          resolve({ lat, lng })
        },
        (err) => {
          status.value = 'denied'
          error.value = err && err.message ? err.message : String(err)
          resolve(null)
        },
        options,
      )
    })
  }

  return {
    latitude,
    longitude,
    status,
    error,
    requestLocation,
    loadFromStorage,
    clearStorage,
    setLocation,
  }
}

export default useLocation
