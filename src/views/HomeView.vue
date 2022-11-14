<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <ReviewInput />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    'ReviewInput': ()=>import('@/views/ReviewInput'),
    // 'DataCaching': ()=>import('@/views/experiments/DataCaching'),
    // 'LevelgraphJsonld': ()=>import('@/views/experiments/LevelgraphJsonld'),
  },
}
</script>
