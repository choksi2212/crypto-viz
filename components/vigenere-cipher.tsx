"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface VigenereCipherProps {
  inputText: string
  isVisualizing: boolean
  animationKey: number
  onComplete: () => void
}

export default function VigenereCipher({ inputText, isVisualizing, animationKey, onComplete }: VigenereCipherProps) {
  const [keyword, setKeyword] = useState("KEY")
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [encryptedText, setEncryptedText] = useState("")
  const [currentShift, setCurrentShift] = useState(0)
  const [currentResult, setCurrentResult] = useState("")

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  const vigenereEncrypt = (text: string, key: string) => {
    return text
      .split("")
      .map((char, index) => {
        if (char.match(/[a-zA-Z]/)) {
          const isUpperCase = char === char.toUpperCase()
          const charIndex = char.toLowerCase().charCodeAt(0) - 97
          const keyIndex = key[index % key.length].toLowerCase().charCodeAt(0) - 97
          const encryptedChar = alphabet[(charIndex + keyIndex) % 26]
          return isUpperCase ? encryptedChar : encryptedChar.toLowerCase()
        }
        return char
      })
      .join("")
  }

  useEffect(() => {
    if (isVisualizing && inputText && keyword) {
      setCurrentIndex(-1)
      setEncryptedText("")
      setCurrentShift(0)
      setCurrentResult("")

      const animate = async () => {
        const cleanText = inputText.replace(/[^a-zA-Z]/g, "").toUpperCase()
        const cleanKey = keyword.replace(/[^a-zA-Z]/g, "").toUpperCase()
        let result = ""

        for (let i = 0; i < cleanText.length; i++) {
          setCurrentIndex(i)

          if (cleanText[i].match(/[A-Z]/)) {
            const charIndex = cleanText[i].charCodeAt(0) - 65
            const keyIndex = cleanKey[i % cleanKey.length].charCodeAt(0) - 65
            setCurrentShift(keyIndex)

            // Wait to show the shift amount
            await new Promise((resolve) => setTimeout(resolve, 600))

            // Calculate encrypted character
            const encryptedChar = alphabet[(charIndex + keyIndex) % 26]
            result += encryptedChar
            setCurrentResult(result)
          } else {
            result += cleanText[i]
            setCurrentResult(result)
          }

          await new Promise((resolve) => setTimeout(resolve, 600))
        }

        setEncryptedText(vigenereEncrypt(inputText, keyword))
        setCurrentIndex(-1)
        setCurrentShift(0)
        setTimeout(onComplete, 1000)
      }

      animate()
    }
  }, [isVisualizing, animationKey, inputText, keyword, onComplete])

  const cleanText = inputText.replace(/[^a-zA-Z]/g, "").toUpperCase()
  const cleanKey = keyword.replace(/[^a-zA-Z]/g, "").toUpperCase()

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3">
        <Label htmlFor="keyword" className="text-xs font-medium text-slate-300 mb-1 block">
          Keyword
        </Label>
        <Input
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value.replace(/[^a-zA-Z]/g, ""))}
          placeholder="Enter keyword"
          className="h-8 bg-slate-700/50 border-slate-600 text-white text-sm w-48"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-purple-400 mb-1">Vigenère Cipher</h3>
          <p className="text-slate-300 text-xs">Polyalphabetic substitution</p>
        </div>

        {/* Character Animation */}
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-blue-400 mb-2">Plaintext:</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {cleanText
                .slice(0, 16)
                .split("")
                .map((char, index) => (
                  <motion.div
                    key={`char-${animationKey}-${index}`}
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                      ${
                        currentIndex === index
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                          : "bg-slate-700/50 text-slate-300 border border-slate-600"
                      }
                    `}
                    animate={{
                      scale: currentIndex === index ? 1.1 : 1,
                      y: currentIndex === index ? -5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {char}
                  </motion.div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-green-400 mb-2">Key:</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {cleanText
                .slice(0, 16)
                .split("")
                .map((_, index) => {
                  const keyChar = cleanKey[index % cleanKey.length]
                  return (
                    <motion.div
                      key={`key-${animationKey}-${index}`}
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                        ${
                          currentIndex === index
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                            : "bg-slate-700/50 text-slate-300 border border-slate-600"
                        }
                      `}
                      animate={{
                        scale: currentIndex === index ? 1.1 : 1,
                        y: currentIndex === index ? 5 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {keyChar}
                    </motion.div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Alphabet Wheel Visualization */}
        <AnimatePresence>
          {currentIndex >= 0 && currentIndex < cleanText.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="my-6"
            >
              <div className="flex flex-col items-center">
                {/* Plaintext Character */}
                <div className="mb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                    {cleanText[currentIndex]}
                  </div>
                </div>

                {/* Shift Amount */}
                <div className="flex items-center mb-2">
                  <div className="text-sm text-slate-300">Shift by</div>
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold mx-2">
                    {currentShift}
                  </div>
                  <div className="text-sm text-slate-300">positions</div>
                </div>

                {/* Alphabet Wheel */}
                <div className="relative w-64 h-64">
                  {/* Static outer wheel */}
                  <div className="absolute inset-0 rounded-full border-2 border-slate-600 flex items-center justify-center">
                    <div className="absolute w-full h-full">
                      {alphabet.split("").map((char, i) => (
                        <div
                          key={`outer-${char}`}
                          className="absolute w-6 h-6 flex items-center justify-center text-slate-300 font-mono"
                          style={{
                            transform: `rotate(${i * (360 / 26)}deg) translateY(-110px) rotate(-${i * (360 / 26)}deg)`,
                          }}
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rotating inner wheel */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-500 flex items-center justify-center"
                    style={{ width: "80%", height: "80%", margin: "10%" }}
                    animate={{
                      rotate: currentShift * (360 / 26),
                    }}
                    transition={{ duration: 1, type: "spring" }}
                  >
                    <div className="absolute w-full h-full">
                      {alphabet.split("").map((char, i) => (
                        <div
                          key={`inner-${char}`}
                          className="absolute w-6 h-6 flex items-center justify-center text-purple-300 font-mono"
                          style={{
                            transform: `rotate(${i * (360 / 26)}deg) translateY(-80px) rotate(-${i * (360 / 26)}deg)`,
                          }}
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Indicator */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-500"></div>

                  {/* Result */}
                  {currentIndex >= 0 && cleanText[currentIndex].match(/[A-Z]/) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30">
                        {currentResult[currentResult.length - 1]}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Current Operation */}
                <div className="mt-4 bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-sm text-slate-300 mb-1">Current Operation:</div>
                  <div className="text-lg font-mono text-white">
                    {cleanText[currentIndex]} + {cleanKey[currentIndex % cleanKey.length]} (shift {currentShift}) ={" "}
                    {currentResult[currentResult.length - 1] || "?"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Encrypted Characters */}
        <div className="mt-4">
          <h4 className="text-xs font-medium text-purple-400 mb-2">Encrypted Text:</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {currentResult.split("").map((char, index) => (
              <motion.div
                key={`result-${animationKey}-${index}`}
                initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-sm"
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
              className="mt-4"
            >
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-purple-400 mb-1">Encrypted Result:</h4>
                <p className="text-lg font-mono text-white break-all">{encryptedText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
