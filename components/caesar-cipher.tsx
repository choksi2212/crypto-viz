"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CaesarCipherProps {
  inputText: string
  isVisualizing: boolean
  animationKey: number
  onComplete: () => void
}

export default function CaesarCipher({ inputText, isVisualizing, animationKey, onComplete }: CaesarCipherProps) {
  const [shift, setShift] = useState(3)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [encryptedText, setEncryptedText] = useState("")
  const [currentResult, setCurrentResult] = useState("")
  const [showShifting, setShowShifting] = useState(false)
  const [currentChar, setCurrentChar] = useState("")

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  const caesarEncrypt = (text: string, shift: number) => {
    return text
      .split("")
      .map((char) => {
        if (char.match(/[a-zA-Z]/)) {
          const isUpperCase = char === char.toUpperCase()
          const charCode = char.toLowerCase().charCodeAt(0)
          const shifted = (((charCode - 97 + shift) % 26) + 26) % 26
          const newChar = String.fromCharCode(shifted + 97)
          return isUpperCase ? newChar.toUpperCase() : newChar
        }
        return char
      })
      .join("")
  }

  useEffect(() => {
    if (isVisualizing && inputText) {
      setCurrentIndex(-1)
      setEncryptedText("")
      setCurrentResult("")
      setShowShifting(false)

      const animate = async () => {
        let result = ""

        for (let i = 0; i < inputText.length; i++) {
          setCurrentIndex(i)
          setCurrentChar(inputText[i].toUpperCase())

          if (inputText[i].match(/[a-zA-Z]/)) {
            // Show the shifting animation
            setShowShifting(true)
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Calculate encrypted character
            const char = inputText[i].toUpperCase()
            const charIndex = char.charCodeAt(0) - 65
            const encryptedChar = alphabet[(charIndex + shift) % 26]
            result += inputText[i] === inputText[i].toUpperCase() ? encryptedChar : encryptedChar.toLowerCase()

            setShowShifting(false)
          } else {
            result += inputText[i]
          }

          setCurrentResult(result)
          await new Promise((resolve) => setTimeout(resolve, 500))
        }

        setEncryptedText(caesarEncrypt(inputText, shift))
        setCurrentIndex(-1)
        setTimeout(onComplete, 800)
      }

      animate()
    }
  }, [isVisualizing, animationKey, inputText, shift, onComplete])

  const getCurrentCharIndex = () => {
    if (currentIndex >= 0 && inputText[currentIndex].match(/[a-zA-Z]/)) {
      return inputText[currentIndex].toUpperCase().charCodeAt(0) - 65
    }
    return -1
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Label htmlFor="shift" className="text-xs font-medium text-slate-300 mb-1 block">
          Shift Value (0-25)
        </Label>
        <Input
          id="shift"
          type="number"
          min="0"
          max="25"
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="w-24 h-8 bg-slate-700/50 border-slate-600 text-white text-sm"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-purple-400 mb-2">Caesar Cipher</h3>
          <p className="text-slate-300 text-sm">Shift by {shift} positions</p>
        </div>

        {/* Input Text */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-blue-400 mb-2 text-center">Input Text:</h4>
          <div className="flex flex-wrap justify-center gap-1">
            {inputText
              .slice(0, 20)
              .split("")
              .map((char, index) => (
                <motion.div
                  key={`${animationKey}-${index}`}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${
                      currentIndex === index
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                        : "bg-slate-700/50 text-slate-300 border border-slate-600"
                    }
                  `}
                  animate={{
                    scale: currentIndex === index ? 1.2 : 1,
                    y: currentIndex === index ? -8 : 0,
                  }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  {char}
                </motion.div>
              ))}
          </div>
        </div>

        {/* Alphabet Shifting Visualization */}
        <AnimatePresence>
          {showShifting && currentIndex >= 0 && inputText[currentIndex].match(/[a-zA-Z]/) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6"
            >
              <div className="text-center mb-4">
                <div className="text-sm text-slate-300 mb-2">Shifting alphabet by {shift} positions:</div>
                <div className="text-lg font-bold text-blue-400">Finding: {currentChar} → ?</div>
              </div>

              {/* Original Alphabet */}
              <div className="mb-4">
                <h5 className="text-xs text-blue-400 mb-2 text-center">Original Alphabet:</h5>
                <div className="flex justify-center gap-1 flex-wrap">
                  {alphabet.split("").map((char, index) => {
                    const isCurrentChar = index === getCurrentCharIndex()
                    return (
                      <motion.div
                        key={`orig-${char}`}
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                          ${
                            isCurrentChar
                              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }
                        `}
                        animate={{
                          scale: isCurrentChar ? 1.2 : 1,
                          y: isCurrentChar ? -5 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {char}
                      </motion.div>
                    )
                  })}
                </div>
                <div className="flex justify-center gap-1 flex-wrap mt-1">
                  {alphabet.split("").map((_, index) => (
                    <div
                      key={`pos-${index}`}
                      className="w-8 h-4 flex items-center justify-center text-xs text-slate-400"
                    >
                      {index}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shifting Animation */}
              <div className="mb-4">
                <div className="flex items-center justify-center mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="text-purple-400 text-2xl mx-4"
                  >
                    ⟲
                  </motion.div>
                  <div className="text-sm text-purple-400">Shifting by {shift}</div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="text-purple-400 text-2xl mx-4"
                  >
                    ⟳
                  </motion.div>
                </div>
              </div>

              {/* Shifted Alphabet */}
              <div className="mb-4">
                <h5 className="text-xs text-purple-400 mb-2 text-center">Shifted Alphabet:</h5>
                <div className="flex justify-center gap-1 flex-wrap">
                  {alphabet.split("").map((char, index) => {
                    const shiftedIndex = (index + shift) % 26
                    const isResultChar = index === getCurrentCharIndex()
                    return (
                      <motion.div
                        key={`shifted-${char}`}
                        initial={{ x: 0 }}
                        animate={{ x: shift * 36 }}
                        transition={{ duration: 1.5, type: "spring" }}
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                          ${
                            isResultChar
                              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          }
                        `}
                        style={{
                          position: "relative",
                        }}
                      >
                        {alphabet[shiftedIndex]}
                      </motion.div>
                    )
                  })}
                </div>
                <div className="flex justify-center gap-1 flex-wrap mt-1">
                  {alphabet.split("").map((_, index) => (
                    <motion.div
                      key={`shifted-pos-${index}`}
                      initial={{ x: 0 }}
                      animate={{ x: shift * 36 }}
                      transition={{ duration: 1.5, type: "spring" }}
                      className="w-8 h-4 flex items-center justify-center text-xs text-slate-400"
                      style={{ position: "relative" }}
                    >
                      {(index + shift) % 26}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Result Arrow and Character */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center"
              >
                <div className="text-3xl text-green-400 mb-2">↓</div>
                <div className="text-lg text-slate-300 mb-2">Result:</div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.8, type: "spring" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-xl shadow-green-500/40"
                >
                  {alphabet[(getCurrentCharIndex() + shift) % 26]}
                </motion.div>
                <div className="text-sm text-slate-400 mt-2">
                  Position {getCurrentCharIndex()} + {shift} = Position {(getCurrentCharIndex() + shift) % 26}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Encrypted Characters Display */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-green-400 mb-2 text-center">Encrypted Text:</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {currentResult.split("").map((char, index) => (
              <motion.div
                key={`result-${animationKey}-${index}`}
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-300 font-bold text-sm"
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final Result */}
        <AnimatePresence>
          {encryptedText && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-400 mb-2">Final Encrypted Result:</h4>
                <p className="text-lg font-mono text-white break-all">{encryptedText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
