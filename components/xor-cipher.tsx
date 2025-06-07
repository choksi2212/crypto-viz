"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface XORCipherProps {
  inputText: string
  isVisualizing: boolean
  animationKey: number
  onComplete: () => void
}

export default function XORCipher({ inputText, isVisualizing, animationKey, onComplete }: XORCipherProps) {
  const [key, setKey] = useState("10110101")
  const [currentBit, setCurrentBit] = useState(-1)
  const [result, setResult] = useState("")

  const textToBinary = (text: string) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("")
  }

  const binaryToText = (binary: string) => {
    const chunks = binary.match(/.{1,8}/g) || []
    return chunks.map((chunk) => String.fromCharCode(Number.parseInt(chunk, 2))).join("")
  }

  const xorOperation = (binary1: string, binary2: string) => {
    const result = []
    const maxLength = Math.max(binary1.length, binary2.length)

    for (let i = 0; i < maxLength; i++) {
      const bit1 = binary1[i % binary1.length] || "0"
      const bit2 = binary2[i % binary2.length] || "0"
      result.push((Number.parseInt(bit1) ^ Number.parseInt(bit2)).toString())
    }

    return result.join("")
  }

  useEffect(() => {
    if (isVisualizing && inputText && key) {
      const binary = textToBinary(inputText)
      setCurrentBit(-1)
      setResult("")

      const animate = async () => {
        const xorResult = xorOperation(binary, key)

        for (let i = 0; i < Math.min(binary.length, 32); i++) {
          setCurrentBit(i)
          await new Promise((resolve) => setTimeout(resolve, 150))
        }

        setResult(xorResult)
        setCurrentBit(-1)
        setTimeout(onComplete, 800)
      }

      animate()
    }
  }, [isVisualizing, animationKey, inputText, key, onComplete])

  const binary = inputText ? textToBinary(inputText) : ""
  const xorResult = binary && key ? xorOperation(binary, key) : ""

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Label htmlFor="key" className="text-xs font-medium text-slate-300 mb-1 block">
          Binary Key
        </Label>
        <Input
          id="key"
          value={key}
          onChange={(e) => setKey(e.target.value.replace(/[^01]/g, ""))}
          placeholder="Enter binary key (0s and 1s)"
          className="h-8 bg-slate-700/50 border-slate-600 text-white font-mono text-sm"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-purple-400 mb-2">XOR Cipher</h3>
          <p className="text-slate-300 text-sm">Bitwise XOR operation</p>
        </div>

        {/* Binary Visualization */}
        <div className="space-y-3 overflow-auto">
          {/* Original Binary */}
          <div>
            <h4 className="text-xs font-medium text-blue-400 mb-1">Plaintext (Binary):</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {binary
                .slice(0, 32)
                .split("")
                .map((bit, index) => (
                  <motion.div
                    key={`orig-${animationKey}-${index}`}
                    className={`
                    w-6 h-6 rounded flex items-center justify-center text-xs font-mono
                    ${
                      currentBit === index
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                        : "bg-slate-700/50 text-slate-300 border border-slate-600"
                    }
                  `}
                    animate={{
                      scale: currentBit === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    {bit}
                  </motion.div>
                ))}
            </div>
          </div>

          {/* XOR Symbol */}
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">⊕</div>
          </div>

          {/* Key Binary */}
          <div>
            <h4 className="text-xs font-medium text-green-400 mb-1">Key (Binary):</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {key
                .repeat(Math.ceil(32 / key.length))
                .slice(0, 32)
                .split("")
                .map((bit, index) => (
                  <motion.div
                    key={`key-${animationKey}-${index}`}
                    className={`
                    w-6 h-6 rounded flex items-center justify-center text-xs font-mono
                    ${
                      currentBit === index
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                        : "bg-slate-700/50 text-slate-300 border border-slate-600"
                    }
                  `}
                    animate={{
                      scale: currentBit === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    {bit}
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Equals Symbol */}
          <div className="text-center">
            <div className="text-lg font-bold text-slate-400">=</div>
          </div>

          {/* Result Binary */}
          <div>
            <h4 className="text-xs font-medium text-purple-400 mb-1">Result (Binary):</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {xorResult
                .slice(0, 32)
                .split("")
                .map((bit, index) => (
                  <motion.div
                    key={`result-${animationKey}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: currentBit >= index ? 1 : 0.3,
                      scale: currentBit === index ? 1.2 : 1,
                    }}
                    className={`
                    w-6 h-6 rounded flex items-center justify-center text-xs font-mono
                    ${
                      currentBit >= index
                        ? "bg-purple-500/20 border border-purple-500/50 text-purple-300"
                        : "bg-slate-800/50 text-slate-500 border border-slate-700"
                    }
                  `}
                  >
                    {bit}
                  </motion.div>
                ))}
            </div>
          </div>
        </div>

        {/* Final Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-purple-400 mb-1">Encrypted Result:</h4>
                <p className="text-lg font-mono text-white break-all">{binaryToText(result)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
