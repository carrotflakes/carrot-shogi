<style>
</style>

<template>
	<g class="piece"
		 v-attr="transform: $data | position"
		 v-on="click: onClick($event, $data)">
		 <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#pieceShape"
			 		fill="{{$data === selectedPiece ? '#FFEACF' : '#F0C895'}}"
					stroke="#4A361B" />
		 <text x="-7" y="0"  fill="#4A361B" font-size="14px">{{label[0]}}</text>
		 <text x="-7" y="14" fill="#4A361B" font-size="14px">{{label[1]}}</text>
	</g>
</template>

<script>

export default {
  props: ["$data", "onClick"],
	inherit: true,
}

</script>
