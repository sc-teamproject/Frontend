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
import { isKorean } from '../../composables/useUiPreferences'

const props = defineProps({
  selectedRestaurant: {
    type: Object,
    default: () => ({})
  }
})

let map = null
let marker = null
const mapCardRef = ref(null)

const gpsDistance = ref(null)
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
      collapseMap: '지도 축소'
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
    popupTitle: 'Restaurant'
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

const updateMarker = () => {
  if (!map) return

  const coords = getCoordinates()
  mapx.value = coords[1].toString()
  mapy.value = coords[0].toString()

  if (marker) {
    map.removeLayer(marker)
  }

  marker = L.marker(coords).addTo(map).bindPopup(props.selectedRestaurant?.title || uiText.value.popupTitle)
  map.setView(coords, 15)

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

watch(() => props.selectedRestaurant?.contentid, () => {
  updateMarker()
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
