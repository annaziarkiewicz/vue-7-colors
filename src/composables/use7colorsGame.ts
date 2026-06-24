import { computed, ref, watch, type Ref } from 'vue'

import { use7colorsAI } from '@/composables/use7colorsAI'
import { use7colorsMap } from '@/composables/use7colorsMap'

import type { Score, Turn } from '@/types/7colors'

type GameResult = 'ai' | 'draw' | 'player' | null

export const use7colorsGame = (gameActionDelay: number, paused: Ref<boolean>) => {
	const {
		cells,
		cols,
		colors,
		floodFill,
		getNeighbors,
		getRegion,
		initMap,
		rows
	} = use7colorsMap()

	const { getBestColor } = use7colorsAI()

	const aiIndex = cols * rows - 1
	const target = 50
	const total = cols * rows

	const aiTiles = ref(0)
	const currentTurn = ref<Turn>('player')
	const hasMoved = ref({
		ai: false,
		player: false
	})
	const isDraw = ref(false)
	const noMoves = ref(false)
	const playerTiles = ref(0)
	const turnTime = ref(30)
	const winner = ref<Turn | null>(null)

	const score = computed<Score>(() => ({
		ai: hasMoved.value.ai ? Math.floor((aiTiles.value / total) * 100) : 0,
		aiTiles: hasMoved.value.ai ? aiTiles.value : 0,
		player: hasMoved.value.player ? Math.floor((playerTiles.value / total) * 100) : 0,
		playerTiles: hasMoved.value.player ? playerTiles.value : 0,
		target
	}))

	const blockedColor = computed(() => {
		if (currentTurn.value === 'player') return cells.value[aiIndex] || null

		return cells.value[0] || null
	})

	let aiTimeout: ReturnType<typeof setTimeout> | null = null
	let timer: ReturnType<typeof setInterval> | null = null

	const stopTimer = () => {
		if (timer === null) return

		clearInterval(timer)
		timer = null
	}

	const stopAiTimeout = () => {
		if (aiTimeout === null) return

		clearTimeout(aiTimeout)
		aiTimeout = null
	}

	const stopAll = () => {
		stopTimer()
		stopAiTimeout()
	}

	const updateTiles = () => {
		playerTiles.value = getRegion(0).size
		aiTiles.value = getRegion(aiIndex).size
	}

	const getAvailableColors = (regionIndex: number, forbiddenColor: string | null) => {
		const region = getRegion(regionIndex)
		const availableColors = new Set<string>()

		region.forEach(index => {
			getNeighbors(index).forEach(neighbor => {
				if (region.has(neighbor)) return

				const color = cells.value[neighbor]

				if (color === forbiddenColor) return

				availableColors.add(color)
			})
		})

		return Array.from(availableColors)
	}

	const getNoMovesResult = (): GameResult => {
		if (playerTiles.value > aiTiles.value) return 'player'
		if (aiTiles.value > playerTiles.value) return 'ai'

		return 'draw'
	}

	const getGameResult = (): GameResult => {
		const playerMoves = getAvailableColors(0, cells.value[aiIndex])
		const aiMoves = getAvailableColors(aiIndex, cells.value[0])

		if (playerMoves.length === 0 && aiMoves.length === 0) {
			noMoves.value = true

			return getNoMovesResult()
		}

		if (playerTiles.value / total >= 0.5) return 'player'
		if (aiTiles.value / total >= 0.5) return 'ai'

		return null
	}

	const finishGame = (result: GameResult) => {
		if (result === null) return false

		if (result === 'draw') {
			isDraw.value = true
			winner.value = null
		} else {
			winner.value = result
		}

		stopAll()

		return true
	}

	const evaluateEnd = () => {
		updateTiles()

		return finishGame(getGameResult())
	}

	const startTimer = () => {
		if (paused.value) return
		if (timer !== null) return
		if (currentTurn.value !== 'player') return
		if (winner.value !== null) return
		if (isDraw.value) return

		timer = setInterval(() => {
			if (paused.value) return

			turnTime.value--

			if (turnTime.value > 0) return

			stopTimer()

			currentTurn.value = 'ai'
			turnTime.value = 30

			scheduleAiMove()
		}, 1000)
	}

	const resetTurnTimer = () => {
		stopTimer()
		turnTime.value = 30
		startTimer()
	}

	const scheduleAiMove = () => {
		if (paused.value) return
		if (winner.value !== null) return
		if (isDraw.value) return

		stopAiTimeout()

		aiTimeout = setTimeout(() => {
			aiMove()
		}, gameActionDelay)
	}

	const playerMove = (color: string) => {
		if (paused.value) return
		if (currentTurn.value !== 'player') return
		if (winner.value !== null) return
		if (isDraw.value) return
		if (cells.value[0] === color) return
		if (cells.value[aiIndex] === color) return

		stopTimer()

		const previousColor = cells.value[0]

		floodFill(0, color)

		if (cells.value[0] !== previousColor) {
			hasMoved.value.player = true
		}

		currentTurn.value = 'ai'
		turnTime.value = 30

		if (evaluateEnd()) return

		scheduleAiMove()
	}

	const aiMove = () => {
		if (paused.value) return
		if (currentTurn.value !== 'ai') return
		if (winner.value !== null) return
		if (isDraw.value) return

		stopAiTimeout()

		const region = getRegion(aiIndex)

		const bestColor =
			getBestColor(region, cells.value, getNeighbors, cells.value[0]) ||
			colors.find(color => color !== cells.value[aiIndex] && color !== cells.value[0]) ||
			cells.value[aiIndex]
		const previousColor = cells.value[aiIndex]

		floodFill(aiIndex, bestColor)

		if (cells.value[aiIndex] !== previousColor) {
			hasMoved.value.ai = true
		}

		currentTurn.value = 'player'

		if (evaluateEnd()) return

		resetTurnTimer()
	}

	const handlePlayerClick = (index: number) => {
		if (paused.value) return
		if (currentTurn.value !== 'player') return

		playerMove(cells.value[index])
	}

	watch(paused, value => {
		if (value) {
			stopAll()
			return
		}

		if (winner.value !== null) return
		if (isDraw.value) return

		if (currentTurn.value === 'ai') {
			scheduleAiMove()
			return
		}

		startTimer()
	})

	initMap()
	updateTiles()
	startTimer()

	return {
		aiTiles,
		blockedColor,
		cells,
		cols,
		currentTurn,
		handlePlayerClick,
		isDraw,
		noMoves,
		playerTiles,
		rows,
		score,
		stopAll,
		turnTime,
		winner
	}
}