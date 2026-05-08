export type GameOverlay = null | 'draw' | 'input' | 'lost' | 'won'

export type GameScreen = 'game' | 'highScores' | 'howToPlay' | 'menu'

export type Score = {
	ai: number
	aiTiles: number
	player: number
	playerTiles: number
	target: number
}

export type Turn = 'ai' | 'player'