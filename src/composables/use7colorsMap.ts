import { ref } from 'vue'

export const colors: string[] = [
	'mint', 'teal',
	'rose', 'cherry',
	'navy', 'sky',
	'skin'
]

export const use7colorsMap = () => {
	const cols = 19
	const rows = 11

	const cells = ref<string[]>([])

	const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

	const getNeighbors = (index: number) => {
		const x = index % cols
		const y = Math.floor(index / cols)

		return [
			x > 0 ? index - 1 : null,
			x < cols - 1 ? index + 1 : null,
			y > 0 ? index - cols : null,
			y < rows - 1 ? index + cols : null
		].filter((item): item is number => item !== null)
	}

	const getRegion = (startIndex: number) => {
		const visited = new Set<number>()
		const stack = [startIndex]
		const color = cells.value[startIndex]

		while (stack.length) {
			const index = stack.pop()!

			if (visited.has(index)) continue
			if (cells.value[index] !== color) continue

			visited.add(index)

			getNeighbors(index).forEach(neighbor => {
				if (!visited.has(neighbor)) stack.push(neighbor)
			})
		}

		return visited
	}

	const initMap = () => {
		const aiIndex = cols * rows - 1
		const maxStartRegionSize = 8
		let attempts = 0

		do {
			cells.value = Array.from({ length: cols * rows }, () => randomColor())
			attempts++
		} while (
			attempts < 100 &&
			(
				cells.value[0] === cells.value[aiIndex] ||
				getRegion(0).size > maxStartRegionSize ||
				getRegion(aiIndex).size > maxStartRegionSize
			)
		)

		if (cells.value[0] === cells.value[aiIndex]) {
			const availableColors = colors.filter(color => color !== cells.value[0])

			cells.value[aiIndex] = availableColors[Math.floor(Math.random() * availableColors.length)]
		}
	}

	const floodFill = (startIndex: number, newColor: string) => {
		const targetColor = cells.value[startIndex]

		if (targetColor === newColor) return

		const region = getRegion(startIndex)

		region.forEach(index => {
			cells.value[index] = newColor
		})
	}

	return {
		cells,
		cols,
		colors,
		floodFill,
		getNeighbors,
		getRegion,
		initMap,
		rows
	}
}