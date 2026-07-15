<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
    <div class="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <MapPin class="text-rose-500 w-5 h-5" />
        <span class="font-bold text-sm">Google 지도 스타일 연동</span>
      </div>
      <div v-if="gpsDistance" class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
        내 위치에서 {{ gpsDistance }}km
      </div>
    </div>

    <div class="flex-grow relative bg-slate-100">
      <!-- MAP CONTAINER -->
      <div id="map-container"></div>

      <!-- Custom Map Info Box -->
      <div class="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-2.5 shadow-md max-w-[210px]">
        <p class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Google Map 연동 완료
        </p>
        <p class="text-[9px] text-slate-400 mt-1">
          경도: {{ mapx }}<br />
          위도: {{ mapy }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { MapPin } from 'lucide-vue-next'
import L from 'leaflet'

const props = defineProps({
  selectedRestaurant: {
    type: Object,
    default: () => ({})
  }
})

let map = null
let marker = null

const gpsDistance = ref(null)
const mapx = ref('126.9125968520')
const mapy = ref('35.1515409291')

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

  marker = L.marker(coords).addTo(map).bindPopup(props.selectedRestaurant?.title || '맛집')
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

onMounted(() => {
  if (typeof L !== 'undefined') {
    initMap()
  } else {
    setTimeout(initMap, 1000)
  }
})

watch(() => props.selectedRestaurant?.contentid, () => {
  updateMarker()
})
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 100%;
  min-height: 320px;
}
</style>
