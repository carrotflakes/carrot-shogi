<style>
</style>

<template>
	<g class="piece"
		 v-attr="transform: $data | position"
		 v-on="click: onClick($event, $data)">
		 <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#pieceShape"
			 		fill="{{$data === selectedPiece ? '#FFEACF' : '#F0C895'}}"
					stroke="#A3783D" />
		 <text x="-7" y="0"  font-size="14px" v-attr="fill: promoted ? '#AC0C15' : '#4A361B'">{{label[0]}}</text>
		 <text x="-7" y="14" font-size="14px" v-attr="fill: promoted ? '#AC0C15' : '#4A361B'">{{label[1]}}</text>
	</g>
</template>

<script>

export default {
  props: ["$data", "onClick"],
	inherit: true,
}

</script>
