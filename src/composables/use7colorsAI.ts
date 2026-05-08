export const use7colorsAI = () => {
	const getBestColor = (
		region: Set<number>,
		cells: string[],
		getNeighbors: (index: number) => number[],
		forbiddenColor: string | null
	) => {
		const availableColors = new Set<string>()

		region.forEach(index => {
			getNeighbors(index).forEach(neighbor => {
				if (region.has(neighbor)) return

				const color = cells[neighbor]

				if (color === forbiddenColor) return

				availableColors.add(color)
			})
		})

		let bestColor: string | null = null
		let bestScore = -1

		availableColors.forEach(color => {
			const simulatedRegion = new Set(region)
			const stack = Array.from(region)

			while (stack.length) {
				const index = stack.pop()!

				getNeighbors(index).forEach(neighbor => {
					if (simulatedRegion.has(neighbor)) return
					if (cells[neighbor] !== color) return

					simulatedRegion.add(neighbor)
					stack.push(neighbor)
				})
			}

			if (simulatedRegion.size <= bestScore) return

			bestScore = simulatedRegion.size
			bestColor = color
		})

		return bestColor
	}

	return {
		getBestColor
	}
}