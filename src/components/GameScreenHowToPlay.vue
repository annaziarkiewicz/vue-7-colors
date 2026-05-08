<template>
	<section class="az-how-to-play">
		<div class="az-how-to-play__heading">How to play</div>
		<div class="az-how-to-play__close" @click="emit('close')">✕</div>

		<div class="az-how-to-play__content">
			<div class="az-how-to-play__description">
				This is a classic strategic board game where every color choice expands your area.
				You start in the top-left corner, the AI starts in the bottom-right corner, and both sides take turns capturing connected tiles.
				Win by claiming at least 50% of the board or controlling more tiles when no moves remain.
			</div>

			<div class="az-how-to-play__row">
				<div class="az-elements">
					<div class="az-elements__heading">Game elements:</div>

					<div
						v-for="color in colors"
						:key="color"
						class="az-elements__item"
					>
						<div class="az-elements__item-tile">
							<GameTile :color="color" />
						</div>
						<div class="az-elements__item-name">{{ color }} tile</div>
					</div>
				</div>

				<div class="az-controls">
					<div class="az-controls__heading">Game controls:</div>

					<div class="az-controls__item">
						<div class="az-controls__item-mouse">
							<GameScreenMouse left-button />
						</div>

						<div class="az-controls__item-name">click a tile to claim its color</div>
					</div>
				</div>

				<div class="az-shortcodes">
					<div class="az-shortcodes__heading">Keyboard shortcodes:</div>

					<div class="az-shortcodes__item">
						<GameScreenKey key-type="letter">M</GameScreenKey>
						<div class="az-shortcodes__item-name">open menu</div>
					</div>

					<div class="az-shortcodes__item">
						<GameScreenKey key-type="letter">P</GameScreenKey>
						<div class="az-shortcodes__item-name">pause / resume</div>
					</div>

					<div class="az-shortcodes__item">
						<GameScreenKey key-type="letter">R</GameScreenKey>
						<div class="az-shortcodes__item-name">restart game</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import GameTile from '@/components/GameTile.vue'
import GameScreenKey from '@/components/GameScreenKey.vue'
import GameScreenMouse from '@/components/GameScreenMouse.vue'

import { colors } from '@/composables/use7colorsMap'

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
.az-how-to-play {
	position: absolute;
	inset: 0;
	overflow-y: scroll;
	width: 100%;
	height: 100%;
	padding: 24px 48px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: start;
	gap: 24px;
	background: $color-milk-200;

	&__heading {
		font-size: 48px;
		font-weight: 700;
		line-height: 1em;
		color: $color-navy-200;
		text-transform: uppercase;
	}

	&__close {
		position: absolute;
		top: 30px;
		right: 30px;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		cursor: pointer;
		background: $color-navy-200;
		color: $color-milk-200;

		&:hover {
			background: $color-navy-300;
		}
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: 48px;
		color: $color-grey-400;
	}

	&__description {
		font-size: 20px;
		line-height: 1.5em;
		text-align: justify;
	}

	&__row {
		display: flex;
		flex-direction: row;
		gap: 48px;

		[class$='heading'] {
			margin-bottom: 8px;
			font-size: 15px;
			font-weight: 500;
			line-height: 1.35em;
			text-transform: uppercase;
		}

		[class$='item'] {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 12px;
		}

		[class$='name'] {
			font-size: 15px;
			line-height: 1.5em;
		}
	}

	.az-elements {
        width: calc(100% - 568px);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
		gap: 8px;

        &__heading {
            width: 100%;
        }

        &__item {
            width: calc(50% - 4px);
        }

		[class$='item-tile'] {
			width: 48px;
			height: 48px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.az-tile {
			position: relative;
		}
	}

    .az-controls,
	.az-shortcodes {
		display: flex;
        flex-direction: column;
		gap: 8px;
	}

    .az-controls {
		width: 320px;
	}

	.az-shortcodes {
		width: 200px;
	}
}
</style>