"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Base64EncodingProps {
  inputText: string
  isVisualizing: boolean
  animationKey: number
  onComplete: () => void
}

export default function Base64Encoding({ inputText, isVisualizing, animationKey, onComplete }: Base64EncodingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [binaryString, setBinaryString] = useState("")
  const [paddedBinary, setPaddedBinary] = useState("")
  const [base64Result, setBase64Result] = useState("")

  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

  const textToBinary = (text: string) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("")
  }

  const binaryToBase64 = (binary: string) => {
    // Pad binary to multiple of 6
    const paddedBinary = binary.padEnd(Math.ceil(binary.length / 6) * 6, "0")

    // Split into 6-bit chunks
    const chunks = paddedBinary.match(/.{1,6}/g) || []

    // Convert each chunk to base64 character
    let result = chunks.map((chunk) => base64Chars[Number.parseInt(chunk, 2)]).join("")

    // Add padding
    while (result.length % 4 !== 0) {
      result += "="
    }

    return { result, paddedBinary }
  }

  useEffect(() => {
    if (isVisualizing && inputText) {
      setCurrentStep(0)
      setBinaryString("")
      setPaddedBinary("")
      setBase64Result("")

      const animate = async () => {
        // Step 1: Convert to binary
        setCurrentStep(1)
        const binary = textToBinary(inputText)
        setBinaryString(binary)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Step 2: Pad binary
        setCurrentStep(2)
        const { result, paddedBinary: padded } = binaryToBase64(binary)
        setPaddedBinary(padded)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Step 3: Convert to base64
        setCurrentStep(3)
        setBase64Result(result)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setCurrentStep(4)
        setTimeout(onComplete, 1000)
      }

      animate()
    }
  }, [isVisualizing, animationKey, inputText, onComplete])

  const chunks6Bit = paddedBinary.match(/.{1,6}/g) || []

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">Base64 Encoding</h3>
        <p className="text-slate-300">Converting text to Base64 representation</p>
      </div>

      <div className="space-y-4">
        {/* Step 1: Original Text */}
        <div className="text-center">
          <h4 className="text-sm font-semibold text-blue-400 mb-4">Step 1: Original Text</h4>
          <div className="flex justify-center gap-2 flex-wrap">
            {inputText.split("").map((char, index) => (
              <motion.div
                key={`char-${animationKey}-${index}`}
                className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-300 font-mono text-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Step 2: Binary Conversion */}
        <AnimatePresence>
          {currentStep >= 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h4 className="text-sm font-semibold text-green-400 mb-4">Step 2: Convert to Binary (8-bit each)</h4>
              <div className="flex justify-center gap-4 flex-wrap">
                {inputText.split("").map((char, charIndex) => {
                  const binary = char.charCodeAt(0).toString(2).padStart(8, "0")
                  return (
                    <div key={`binary-${charIndex}`} className="text-center">
                      <div className="text-xs text-slate-400 mb-1">{char}</div>
                      <div className="flex gap-1">
                        {binary.split("").map((bit, bitIndex) => (
                          <motion.div
                            key={`bit-${charIndex}-${bitIndex}`}
                            className="w-5 h-5 rounded bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-300 font-mono text-sm"
                            initial={{ opacity: 0, rotateY: -90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            transition={{ delay: charIndex * 0.3 + bitIndex * 0.05 }}
                          >
                            {bit}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: 6-bit Grouping */}
        <AnimatePresence>
          {currentStep >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h4 className="text-sm font-semibold text-purple-400 mb-4">Step 3: Group into 6-bit chunks</h4>
              <div className="flex justify-center gap-1 flex-wrap">
                {chunks6Bit.map((chunk, index) => (
                  <motion.div
                    key={`chunk-${index}`}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="flex gap-1 mb-2">
                      {chunk.split("").map((bit, bitIndex) => (
                        <div
                          key={bitIndex}
                          className="w-5 h-5 rounded bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300 font-mono text-sm"
                        >
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-slate-400">
                      {Number.parseInt(chunk, 2)} → {base64Chars[Number.parseInt(chunk, 2)]}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: Base64 Result */}
        <AnimatePresence>
          {currentStep >= 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h4 className="text-sm font-semibold text-yellow-400 mb-4">Step 4: Base64 Result</h4>
              <div className="flex justify-center gap-2 flex-wrap mb-4">
                {base64Result.split("").map((char, index) => (
                  <motion.div
                    key={`result-${index}`}
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg font-bold
                      ${
                        char === "="
                          ? "bg-orange-500/20 border border-orange-500/50 text-orange-300"
                          : "bg-yellow-500/20 border border-yellow-500/50 text-yellow-300"
                      }
                    `}
                    initial={{ opacity: 0, rotateY: -180 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {char}
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-xl font-mono text-white break-all">{base64Result}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
