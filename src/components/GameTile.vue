<template>
	<div
		class="az-tile"
		:class="[
			`az-tile--${color}`,
			{ 'az-tile--blocked': blocked }
		]"
		@click="handleClick"
	>
		<div class="az-tile__inner" />
	</div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
	blocked?: boolean
	color: string
}>(), {
	blocked: false
})

const emit = defineEmits<{
	(e: 'click'): void
}>()

const handleClick = () => {
	if (props.blocked) return

	emit('click')
}
</script>

<style lang="scss" scoped>
.az-tile {
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 0.5px solid $color-milk-200;

	&:not(.az-tile--blocked):hover {
		cursor: pointer;
	}

	&--blocked {
		&:hover {
			cursor: not-allowed;
		}
	}

	&__inner {
		width: 47px;
		height: 47px;
		border: 8px solid;
	}

	&--cherry {
		.az-tile__inner {
			background: $color-rose-400;
			border-color: $color-rose-300 #0000000D #00000026 #0000000D;
		}
	}

	&--mint {
		.az-tile__inner {
			background: $color-mint-200;
			border-color: $color-mint-100 #0000000D #00000026 #0000000D;
		}
	}

	&--navy {
		.az-tile__inner {
			background: $color-navy-200;
			border-color: $color-navy-100 #0000000D #00000026 #0000000D;
		}
	}

	&--rose {
		.az-tile__inner {
			background: $color-rose-200;
			border-color: $color-rose-100 #0000000D #00000026 #0000000D;
		}
	}

	&--skin {
		.az-tile__inner {
			background: #F4D1B6;
			border-color: #FAE3D4 #0000000D #00000026 #0000000D;
		}
	}

	&--sky {
		.az-tile__inner {
			background: $color-navy-400;
			border-color: $color-navy-300 #0000000D #00000026 #0000000D;
		}
	}

	&--teal {
		.az-tile__inner {
			background: $color-mint-400;
			border-color: $color-mint-300 #0000000D #00000026 #0000000D;
		}
	}
}
</style>