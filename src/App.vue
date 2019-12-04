<template>
    <router-view/>
</template>

<script>
import util from '@/utils/util'
export default {
	name: 'App',
	mounted(){
	
	if (util.checkIE()) {
	  window.addEventListener('hashchange', () => {
	    var currentPath = window.location.hash.slice(1);
	    if (this.$route.path !== currentPath) {
	    this.$router.push(currentPath)
	  }
	}, false)
	}
	}
}
</script>

<style lang="scss" type="text/css">
</style>
