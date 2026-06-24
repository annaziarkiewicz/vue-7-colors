<template>
	<div class="az-board">
		<GameTile
			v-for="(cell, index) in game.cells.value"
			:key="index"
			:blocked="isTileBlocked(cell)"
			:color="cell"
			@click="handleClick(index)"
		/>

		<slot />
	</div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, toRef, watch } from 'vue'

import GameTile from '@/components/GameTile.vue'

import { use7colorsGame } from '@/composables/use7colorsGame'

import type { Turn } from '@/types/7colors'

const props = defineProps<{
	actionDelay: number
	paused: boolean
}>()

const emit = defineEmits<{
	(e: 'draw'): void
	(e: 'lost'): void
	(e: 'update:aiScore', value: number): void
	(e: 'update:aiTiles', value: number): void
	(e: 'update:playerTiles', value: number): void
	(e: 'update:score', value: number): void
	(e: 'update:time', value: number): void
	(e: 'update:turn', value: Turn): void
	(e: 'won'): void
}>()

const game = use7colorsGame(props.actionDelay, toRef(props, 'paused'))
const resultEmitted = ref(false)

const isTileBlocked = (cell: string) => {
	return !props.paused && game.currentTurn.value === 'player' && cell === game.blockedColor.value
}

const handleClick = (index: number) => {
	if (props.paused) return
	if (game.currentTurn.value !== 'player') return
	if (game.cells.value[index] === game.blockedColor.value) return

	game.handlePlayerClick(index)
}

const emitGameResult = () => {
	if (resultEmitted.value) return

	if (game.winner.value === 'player') {
		resultEmitted.value = true
		emit('won')
		return
	}

	if (game.winner.value === 'ai') {
		resultEmitted.value = true
		emit('lost')
		return
	}

	if (game.isDraw.value) {
		resultEmitted.value = true
		emit('draw')
	}
}

watch(game.score, value => {
	emit('update:aiScore', value.ai)
	emit('update:aiTiles', value.aiTiles)
	emit('update:playerTiles', value.playerTiles)
	emit('update:score', value.player)
}, { immediate: true })

watch(game.currentTurn, () => {
	emit('update:turn', game.currentTurn.value)
}, { immediate: true })

watch(game.turnTime, () => {
	emit('update:time', game.turnTime.value)
}, { immediate: true })

watch(game.winner, () => {
	emitGameResult()
})

watch(game.isDraw, () => {
	emitGameResult()
})

onUnmounted(() => {
	game.stopAll()
})
</script>

<style lang="scss" scoped>
.az-board {
	position: relative;
	width: 960px;
	height: 576px;
	display: grid;
	grid-template-columns: repeat(19, 48px);
	grid-template-rows: repeat(11, 48px);
	background-color: $color-milk-300;
	border: 24px solid $color-milk-200;
	outline: none;
}
</style>