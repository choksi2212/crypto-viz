"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RailFenceCipherProps {
  inputText: string
  isVisualizing: boolean
  animationKey: number
  onComplete: () => void
}

export default function RailFenceCipher({ inputText, isVisualizing, animationKey, onComplete }: RailFenceCipherProps) {
  const [rails, setRails] = useState(3)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [railPositions, setRailPositions] = useState<number[][]>([])
  const [encryptedText, setEncryptedText] = useState("")

  const createRailFence = (text: string, numRails: number) => {
    if (numRails === 1) return [text.split("")]

    const fence: string[][] = Array(numRails)
      .fill(null)
      .map(() => [])
    let rail = 0
    let direction = 1

    for (let i = 0; i < text.length; i++) {
      fence[rail].push(text[i])

      if (rail === 0) direction = 1
      else if (rail === numRails - 1) direction = -1

      rail += direction
    }

    return fence
  }

  const getRailPositions = (textLength: number, numRails: number) => {
    if (numRails === 1) return Array(textLength).fill(0)

    const positions = []
    let rail = 0
    let direction = 1

    for (let i = 0; i < textLength; i++) {
      positions.push(rail)

      if (rail === 0) direction = 1
      else if (rail === numRails - 1) direction = -1

      rail += direction
    }

    return positions
  }

  const railFenceEncrypt = (text: string, numRails: number) => {
    const fence = createRailFence(text, numRails)
    return fence.map((rail) => rail.join("")).join("")
  }

  useEffect(() => {
    if (isVisualizing && inputText) {
      setCurrentIndex(-1)
      setRailPositions([])
      setEncryptedText("")

      const animate = async () => {
        const positions = getRailPositions(inputText.length, rails)
        const fence = createRailFence(inputText, rails)

        // Animate character placement
        for (let i = 0; i < inputText.length; i++) {
          setCurrentIndex(i)
          setRailPositions(positions.slice(0, i + 1))
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        // Show final result
        setEncryptedText(railFenceEncrypt(inputText, rails))
        setCurrentIndex(-1)
        setTimeout(onComplete, 1000)
      }

      animate()
    }
  }, [isVisualizing, animationKey, inputText, rails, onComplete])

  const positions = getRailPositions(inputText.length, rails)

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <Label htmlFor="rails" className="text-sm font-medium text-slate-300 mb-2 block">
          Number of Rails
        </Label>
        <Input
          id="rails"
          type="number"
          min="2"
          max="8"
          value={rails}
          onChange={(e) => setRails(Math.max(2, Math.min(8, Number(e.target.value))))}
          className="w-32 bg-slate-700/50 border-slate-600 text-white"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-purple-400 mb-4">Rail Fence Cipher</h3>
          <p className="text-slate-300">Characters arranged in a zigzag pattern across {rails} rails</p>
        </div>

        {/* Rail Fence Visualization */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="relative"
            style={{ height: `${rails * 40}px`, width: `${Math.max(inputText.length * 40, 400)}px` }}
          >
            {/* Rail lines */}
            {Array(rails)
              .fill(0)
              .map((_, railIndex) => (
                <div
                  key={railIndex}
                  className="absolute w-full border-t border-slate-600/50"
                  style={{ top: `${railIndex * 40 + 20}px` }}
                />
              ))}

            {/* Characters */}
            {inputText.split("").map((char, index) => {
              const railIndex = positions[index]
              const isActive = index <= currentIndex

              return (
                <motion.div
                  key={`${animationKey}-${index}`}
                  className={`
                    absolute w-6 h-6 rounded-lg flex items-center justify-center text-lg font-bold
                    ${
                      isActive
                        ? index === currentIndex
                          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                          : "bg-blue-500/20 border border-blue-500/50 text-blue-300"
                        : "bg-slate-700/30 text-slate-500 border border-slate-600/50"
                    }
                  `}
                  initial={{
                    x: index * 30 + 10,
                    y: 10,
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    x: index * 30 + 10,
                    y: railIndex * 40 + 10,
                    scale: index === currentIndex ? 1.2 : 1,
                    opacity: isActive ? 1 : 0.3,
                  }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  {char}
                </motion.div>
              )
            })}

            {/* Zigzag lines */}
            {railPositions.length > 1 && (
              <svg className="absolute inset-0 pointer-events-none">
                {railPositions.slice(0, -1).map((rail, index) => {
                  const nextRail = railPositions[index + 1]
                  return (
                    <motion.line
                      key={`line-${index}`}
                      x1={index * 40 + 24}
                      y1={rail * 40 + 24}
                      x2={(index + 1) * 40 + 24}
                      y2={nextRail * 40 + 24}
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      strokeOpacity="0.6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    />
                  )
                })}
              </svg>
            )}
          </div>
        </div>

        {/* Reading Order */}
        {railPositions.length === inputText.length && (
          <div className="mt-8">
            <h4 className="text-sm font-medium text-green-400 mb-4 text-center">Reading Order (Row by Row):</h4>
            <div className="space-y-1">
              {Array(rails)
                .fill(0)
                .map((_, railIndex) => (
                  <div key={railIndex} className="flex items-center justify-center gap-2">
                    <span className="text-slate-400 text-xs w-16">Rail {railIndex + 1}:</span>
                    <div className="flex gap-1">
                      {inputText.split("").map((char, charIndex) =>
                        positions[charIndex] === railIndex ? (
                          <div
                            key={charIndex}
                            className="w-4 h-4 rounded bg-green-500/20 border border-green-500/50 flex items-center justify-center text-[0.6rem] text-green-300 font-mono"
                          >
                            {char}
                          </div>
                        ) : null,
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {encryptedText && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-3">
                <h4 className="text-lg font-semibold text-green-400 mb-2">Encrypted Result:</h4>
                <p className="text-2xl font-mono text-white break-all">{encryptedText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
