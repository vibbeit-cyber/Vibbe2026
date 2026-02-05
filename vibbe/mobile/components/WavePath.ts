export const getWavePath = (
  x: number,
  tabWidth: number,
  height: number
) => {
  const curveWidth = tabWidth
  const curveDepth = 30

  return `
    M0 0
    H${x - curveWidth / 2}
    C${x - curveWidth / 4} 0,
     ${x - curveWidth / 4} ${curveDepth},
     ${x} ${curveDepth}
    C${x + curveWidth / 4} ${curveDepth},
     ${x + curveWidth / 4} 0,
     ${x + curveWidth / 2} 0
    H1000
    V${height}
    H0
    Z
  `
}
