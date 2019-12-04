<template>
	<iframe :src="$fun.getUrlVerify($route.query.url)" :key="$route.query.random" frameborder="0" :height="$route.query.iframeH">
		
	</iframe>
</template>
<script>
	
</script>
<style lang="scss" type="text/css">
	iframe{
		width: 960px;
	}
</style>