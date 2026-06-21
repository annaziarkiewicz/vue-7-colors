<template>
	<section class="az-game">
		<GameDashboard
			:current-turn="currentTurn"
			:score="score"
			:time="time"
            :show-overlay="gameState.screen === 'game'"
		/>

		<GameBoard
			:key="gameBoardKey"
			:action-delay="gameActionDelay"
			:paused="gameState.paused || gameState.screen !== 'game' || isGameFrozen"
			@draw="onGameDraw"
			@lost="onGameLost"
			@update:ai-score="onAiScore"
			@update:ai-tiles="score.aiTiles = $event"
			@update:player-tiles="score.playerTiles = $event"
			@update:score="onPlayerScore"
			@update:time="time = $event"
			@update:turn="currentTurn = $event"
			@won="onGameWon"
		>
			<GameOverlayText
				v-if="gameState.paused && gameState.overlay === null && gameState.screen === 'game'"
				text="PAUSED"
			/>

			<GameOverlayText
				v-if="resultOverlayText"
				:text="resultOverlayText"
			/>

			<GameOverlayInput
				v-if="gameState.overlay === 'input'"
				heading="What's your name?"
				placeholder="Type your name and hit enter"
				@close="onInputClose"
				@submit="onScoreSubmit"
			/>
		</GameBoard>

		<GameScreen
			v-if="gameState.screen !== 'game'"
			:button-back-to-game="hasActiveGame"
			:button-high-scores="true"
			:button-how-to-play="true"
			:button-play-game="!hasActiveGame"
			:game-headline="gameHeadline"
			@back-to-game="backToGame"
			@play-game="playGame"
			@show-high-scores="showHighScores"
			@show-how-to-play="showHowToPlay"
		>
			<template #illustrations>
                <div class="az-illustration az-illustration--mint" />
				<div class="az-illustration az-illustration--rose" />
				<div class="az-illustration az-illustration--navy" />
            </template>

			<GameScreenHighScores
				v-if="gameState.screen === 'highScores'"
				@close="closeHighScores"
			/>

			<GameScreenHowToPlay
				v-if="gameState.screen === 'howToPlay'"
				@close="closeHowToPlay"
			/>
		</GameScreen>
	</section>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

import GameBoard from '@/components/GameBoard.vue'
import GameDashboard from '@/components/GameDashboard.vue'
import GameOverlayInput from '@/components/GameOverlayInput.vue'
import GameOverlayText from '@/components/GameOverlayText.vue'
import GameScreen from '@/components/GameScreen.vue'
import GameScreenHighScores from '@/components/GameScreenHighScores.vue'
import GameScreenHowToPlay from '@/components/GameScreenHowToPlay.vue'

import { use7colorsScores } from '@/composables/use7colorsScores'

import type { GameOverlay, GameScreen as GameScreenType, Score, Turn } from '@/types/7colors'

const gameHeadline = '7 colors'
const gameActionDelay = 1000

const currentTurn = ref<Turn>('player')
const gameBoardKey = ref(0)
const gameState = ref<{
	overlay: GameOverlay
	paused: boolean
	screen: GameScreenType
}>({
	overlay: null,
	paused: true,
	screen: 'menu'
})
const hasActiveGame = ref(false)
const isGameFrozen = ref(false)
const score = ref<Score>({
	ai: 0,
	aiTiles: 0,
	player: 0,
	playerTiles: 0,
	target: 50
})
const time = ref(30)

const { addScore, isHighScore } = use7colorsScores()

const resultOverlayText = computed(() => {
	if (gameState.value.overlay === 'won') return 'YOU WON'
	if (gameState.value.overlay === 'lost') return 'YOU LOST'
	if (gameState.value.overlay === 'draw') return 'DRAW'

	return ''
})

const resetScore = () => {
	score.value = {
		ai: 0,
		aiTiles: 0,
		player: 0,
		playerTiles: 0,
		target: 50
	}

	time.value = 30
	currentTurn.value = 'player'
}

const clearActiveGame = () => {
	resetScore()

	gameBoardKey.value++
	hasActiveGame.value = false
}

const runWithDelay = (action: () => void, delay = gameActionDelay) => {
	isGameFrozen.value = true

	setTimeout(() => {
		action()
		isGameFrozen.value = false
	}, delay)
}

const playGame = () => {
	resetScore()

	gameBoardKey.value++
	hasActiveGame.value = true

	gameState.value.screen = 'game'
	gameState.value.overlay = null
	gameState.value.paused = false

	runWithDelay(() => {})
}

const backToGame = () => {
	if (!hasActiveGame.value) return

	gameState.value.screen = 'game'
	gameState.value.overlay = null
	gameState.value.paused = false
}

const openMenu = () => {
	if (!hasActiveGame.value) return

	gameState.value.screen = 'menu'
	gameState.value.overlay = null
	gameState.value.paused = true
}

const togglePause = () => {
	if (gameState.value.screen !== 'game') return
	if (gameState.value.overlay !== null) return

	gameState.value.paused = !gameState.value.paused
}

const onPlayerScore = (value: number) => {
	score.value.player = value
}

const onAiScore = (value: number) => {
	score.value.ai = value
}

const showResultScreen = () => {
	clearActiveGame()

	gameState.value.screen = 'menu'
	gameState.value.overlay = null
	gameState.value.paused = true
}

const onGameWon = () => {
	gameState.value.paused = true

	if (isHighScore(score.value.playerTiles)) {
		gameState.value.overlay = 'input'
		return
	}

	gameState.value.overlay = 'won'

	runWithDelay(() => {
		showResultScreen()
	}, gameActionDelay * 2)
}

const onGameLost = () => {
	gameState.value.paused = true
	gameState.value.overlay = 'lost'

	runWithDelay(() => {
		showResultScreen()
	}, gameActionDelay * 2)
}

const onGameDraw = () => {
	gameState.value.paused = true
	gameState.value.overlay = 'draw'

	runWithDelay(() => {
		showResultScreen()
	}, gameActionDelay * 2)
}

const onScoreSubmit = (name: string) => {
	addScore({
		name,
		score: score.value.playerTiles
	})

	clearActiveGame()

	gameState.value.overlay = null
	gameState.value.screen = 'highScores'
	gameState.value.paused = true
}

const onInputClose = () => {
	showResultScreen()
}

const showHighScores = () => {
	gameState.value.screen = 'highScores'
}

const closeHighScores = () => {
	gameState.value.screen = 'menu'
}

const showHowToPlay = () => {
	gameState.value.screen = 'howToPlay'
}

const closeHowToPlay = () => {
	gameState.value.screen = 'menu'
}

const handleKey = (event: KeyboardEvent) => {
	if (isGameFrozen.value) return

	if (event.key === 'm' || event.key === 'M') openMenu()
	if (event.key === 'p' || event.key === 'P') togglePause()
	if (event.key === 'r' || event.key === 'R') playGame()
}

onMounted(() => {
	window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
	window.removeEventListener('keydown', handleKey)
})
</script>

<style lang="scss" scoped>
.az-game {
	position: relative;
}

.az-illustration {
	position: absolute;
	pointer-events: none;
	background-position: center;
	background-size: contain;
	background-repeat: no-repeat;

	&--mint {
		bottom: 8px;
		left: 258px;
		width: 250px;
		height: 272px;
		background-image: url('@/assets/screen-mint.png');
	}

	&--rose {
		top: 8px;
		left: 50px;
		width: 230px;
		height: 280px;
		background-image: url('@/assets/screen-rose.png');
	}

	&--navy {
		top: 108px;
		right: 50px;
		width: 225px;
		height: 300px;
		background-image: url('@/assets/screen-navy.png');
	}
}
</style>