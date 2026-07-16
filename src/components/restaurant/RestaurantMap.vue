<template>
  <div
    ref="mapCardRef"
    :class="[
      'bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative transition-all duration-200',
      isMapExpanded ? 'w-full h-full rounded-none border-0' : ''
    ]"
  >
    <div class="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <MapPin class="text-rose-500 w-5 h-5" />
        <span class="font-bold text-sm">{{ uiText.mapTitle }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="selectedRestaurant?.contentid || selectedRestaurant?.place_id"
          @click="toggleParkingLayer"
          class="text-xs font-medium px-2 py-1 rounded border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
        >
          {{ uiText.parkingButton }}
        </button>
        <div v-if="gpsDistance" class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {{ uiText.distancePrefix }} {{ gpsDistance }}km
        </div>
        <button
          @click="toggleMapExpanded"
          class="text-xs font-medium px-2 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 transition"
          :aria-label="isMapExpanded ? uiText.collapseMap : uiText.expandMap"
        >
          {{ isMapExpanded ? uiText.collapseMap : uiText.expandMap }}
        </button>
      </div>
    </div>

    <div :class="['relative bg-slate-100', isMapExpanded ? 'h-full min-h-0' : 'h-[700px]']">
      <!-- MAP CONTAINER -->
      <div id="map-container"></div>

      <!-- Custom Map Info Box -->
      <div class="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-2.5 shadow-md max-w-[210px]">
        <p class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          {{ uiText.mapBadge }}
        </p>
        <p class="text-[9px] text-slate-400 mt-1">
          {{ uiText.longitudeLabel }}: {{ mapx }}<br />
          {{ uiText.latitudeLabel }}: {{ mapy }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { MapPin } from 'lucide-vue-next'
import L from 'leaflet'
import axios from 'axios'
import { isKorean } from '../../composables/useUiPreferences'

const props = defineProps({
  selectedRestaurant: {
    type: Object,
    default: () => ({})
  }
})

let map = null

const createPinIcon = (emoji, color, size = 34) => L.divIcon({
  className: '',
  html: `
    <div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border: 2.5px solid #fff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 8px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
    ">
      <span style="transform: rotate(45deg); font-size: ${Math.round(size * 0.5)}px; line-height: 1;">${emoji}</span>
    </div>
  `,
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
  popupAnchor: [0, -size + 4]
})

const buildRouteUrl = (lot) => {
  const lat = Number(lot.latitude)
  const lng = Number(lot.longitude)
  const destination = Number.isFinite(lat) && Number.isFinite(lng)
    ? `${lat},${lng}`
    : (lot.주소 || '').trim()

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`
}

const buildParkingPopup = (lot) => {
  const fee = (lot.요금정보 || '').trim()
  const isFree = fee.includes('무료')
  const badgeBg = isFree ? '#dcfce7' : '#fef3c7'      // 무료=연녹색, 유료=연호박색
  const badgeColor = isFree ? '#15803d' : '#b45309'
  const routeLabel = uiText.value?.routeButton || '길찾기'

  return `
    <div style="min-width: 210px; padding: 12px 14px;">
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px;">
        <span style="font-size: 14px;">🚘</span>
        <span style="font-weight: 700; font-size: 13px; color: #1e293b;">${lot.명칭 || '주차장'}</span>
      </div>
      <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-bottom: 8px;">${lot.주소 || ''}</div>
      <span style="display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: ${badgeBg}; color: ${badgeColor};">${fee || '요금정보 없음'}</span>
      <div style="margin-top: 10px;">
        <a
          href="${buildRouteUrl(lot)}"
          target="_blank"
          rel="noopener noreferrer"
          style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; width: 100%; padding: 7px 10px; border-radius: 8px; background: #2563eb; color: white; font-size: 12px; font-weight: 600; text-decoration: none;"
        >
          🧭 ${routeLabel}
        </a>
      </div>
    </div>
  `
}

const buildRestaurantPopup = (r) => `
  <div style="min-width: 190px; padding: 12px 14px;">
    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px;">
      <span style="font-size: 14px;">🍽️</span>
      <span style="font-weight: 700; font-size: 13px; color: #1e293b;">${r?.title || '식당'}</span>
    </div>
    <div style="font-size: 11px; color: #64748b; line-height: 1.4;">${r?.addr1 || r?.address || ''}</div>
  </div>
`

const restaurantIcon = createPinIcon('🍽️', '#e11d48', 44)  // 로즈레드, 크게
const parkingIcon = createPinIcon('🚘', '#3b82f6')          // 파랑, 자동차 앞면

let marker = null
let parkingMarkersLayer = null
const mapCardRef = ref(null)

const gpsDistance = ref(null)
const parkingLots = ref([])
const isParkingVisible = ref(false)

let allPinsLayer = null
const allPins = ref([])
const isAllVisible = ref(false)

const mapx = ref('126.9125968520')
const mapy = ref('35.1515409291')
const isMapExpanded = ref(false)

const uiText = computed(() => {
  if (isKorean.value) {
    return {
      mapTitle: 'Google 지도 스타일 연동',
      mapBadge: 'Google Map 연동 완료',
      distancePrefix: '내 위치에서',
      longitudeLabel: '경도',
      latitudeLabel: '위도',
      expandMap: '지도 전체 화면 확대',
      collapseMap: '지도 축소',
      parkingButton: '근처 주차장 찾기',
      routeButton: '길찾기'
    }
  }

  return {
    mapTitle: 'Google Maps Style Integration',
    mapBadge: 'Google Maps connected',
    distancePrefix: 'From my location',
    longitudeLabel: 'Longitude',
    latitudeLabel: 'Latitude',
    expandMap: 'Expand full screen map',
    collapseMap: 'Collapse map',
    parkingButton: 'Find nearby parking',
    popupTitle: 'Restaurant',
    routeButton: 'Directions'
  }
})

const getCoordinates = () => {
  const lat = Number(props.selectedRestaurant?.mapy)
  const lng = Number(props.selectedRestaurant?.mapx)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return [lat, lng]
  }

  return [35.1515, 126.9125]
}

const clearParkingMarkers = () => {
  if (parkingMarkersLayer) {
    parkingMarkersLayer.clearLayers()
  }
}

const renderParkingMarkers = () => {
  clearParkingMarkers()
  if (!map || !isParkingVisible.value || parkingLots.value.length === 0) return

  parkingMarkersLayer = L.layerGroup().addTo(map)
  parkingLots.value.forEach((lot) => {
    if (lot.latitude == null || lot.longitude == null) return
    L.marker([lot.latitude, lot.longitude], {icon: parkingIcon,title: lot.명칭 || '주차장'}).addTo(parkingMarkersLayer).bindPopup(buildParkingPopup(lot), { className: 'clean-popup', closeButton: false })
  })
}

const fetchParkingLots = async () => {
  const coords = getCoordinates()
  const lat = Number(coords[0])
  const lng = Number(coords[1])

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    parkingLots.value = []
    return
  }

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    const response = await axios.get(`${baseUrl.replace(/\/$/, '')}/restaurants/parking`, {
      params: {
        lat,
        lng,
        limit: 5,
        radius: 3000
      }
    })
    parkingLots.value = response.data?.items || []
  } catch (error) {
    console.error('Failed to load parking lots', error)
    parkingLots.value = []
  }
}

const clearAllPinMarkers = () => {
  if (allPinsLayer) {
    allPinsLayer.clearLayers()
  }
}

const toggleParkingLayer = async () => {
  isParkingVisible.value = !isParkingVisible.value
  if (!isParkingVisible.value) {
    clearParkingMarkers()
    return
  }
  await fetchParkingLots()
  renderParkingMarkers()
  if (parkingLots.value.length === 0) {
    alert(uiText.value.parkingButton + ' 결과가 없습니다.')
  }
}

const toggleAllPins = async () => {
  isAllVisible.value = !isAllVisible.value
  if (!isAllVisible.value) {
    clearAllPinMarkers()
    return
  }
  if (allPins.value.length === 0) {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
      const response = await axios.get(`${baseUrl.replace(/\/$/, '')}/map/pins`)
      allPins.value = response.data?.items || []
    } catch (error) {
      console.error('Failed to load pins', error)
      allPins.value = []
    }
  }
  renderAllPinMarkers()
}

const renderAllPinMarkers = () => {
  clearAllPinMarkers()
  if (!map || !isAllVisible.value || allPins.value.length === 0) return

  allPinsLayer = L.layerGroup().addTo(map)
  const bounds = []

  allPins.value.forEach((item) => {
    const lat = Number(item.latitude)
    const lng = Number(item.longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
    bounds.push([lat, lng])
    L.marker([lat, lng], { title: item.명칭 || item.title })
      .addTo(allPinsLayer)
      .bindPopup(`<b>${item.명칭 || item.title || ''}</b><br/>${item.주소 || ''}`)
  })

  if (bounds.length > 0) map.fitBounds(bounds, { padding: [30, 30] })
}

const updateMarker = async () => {
  if (!map) return

  const coords = getCoordinates()
  mapx.value = coords[1].toString()
  mapy.value = coords[0].toString()

  if (marker) {
    map.removeLayer(marker)
  }

  marker = L.marker(coords, { icon: restaurantIcon, zIndexOffset: 1000 }).addTo(map).bindPopup(buildRestaurantPopup(props.selectedRestaurant), { className: 'clean-popup', closeButton: false })
  map.setView(coords, 15)

  clearParkingMarkers()
  parkingLots.value = []
  isParkingVisible.value = false

  setTimeout(() => {
    map.invalidateSize()
  }, 100)
}

const initMap = () => {
  if (map) return

  map = L.map('map-container', {
    center: getCoordinates(),
    zoom: 13,
    zoomControl: true
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)

  updateMarker()
}

const syncFullscreenState = () => {
  isMapExpanded.value = document.fullscreenElement === mapCardRef.value
}

const toggleMapExpanded = async () => {
  if (!mapCardRef.value) return

  if (document.fullscreenElement === mapCardRef.value) {
    await document.exitFullscreen()
  } else {
    await mapCardRef.value.requestFullscreen()
  }

  await nextTick()
  if (map) {
    map.invalidateSize()
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', syncFullscreenState)

  if (typeof L !== 'undefined') {
    initMap()
  } else {
    setTimeout(initMap, 1000)
  }
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenState)
})

watch(() => props.selectedRestaurant?.contentid || props.selectedRestaurant?.place_id, async () => {
  await updateMarker()
})

watch(isMapExpanded, async () => {
  await nextTick()
  if (map) {
    map.invalidateSize()
  }
})
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 100%;
  min-height: 700px;
}
</style>

<style>
.clean-popup .leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
}
.clean-popup .leaflet-popup-content {
  margin: 0;
  font-family: inherit;
}
.clean-popup .leaflet-popup-tip {
  border: 1px solid #e2e8f0;
}
</style>