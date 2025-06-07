"use client"

export const metadata = {
  title: "Crypto-Viz",
  description: "Interactive Cryptography Visualization Tool",
}

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import CaesarCipher from "@/components/caesar-cipher"
import XORCipher from "@/components/xor-cipher"
import VigenereCipher from "@/components/vigenere-cipher"
import RailFenceCipher from "@/components/rail-fence-cipher"
import Base64Encoding from "@/components/base64-encoding"
import DiffieHellman from "@/components/diffie-hellman"

const algorithms = [
  { id: "caesar", name: "Caesar Cipher", description: "Shift each letter by a fixed number" },
  { id: "xor", name: "XOR Cipher", description: "Bitwise XOR operation with a key" },
  { id: "vigenere", name: "Vigenère Cipher", description: "Polyalphabetic substitution cipher" },
  { id: "railfence", name: "Rail Fence Cipher", description: "Zigzag pattern transposition" },
  { id: "base64", name: "Base64 Encoding", description: "Binary to text encoding scheme" },
  { id: "diffie", name: "Diffie-Hellman", description: "Key exchange protocol" },
]

export default function CryptoViz() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("")
  const [inputText, setInputText] = useState("")
  const [isVisualizing, setIsVisualizing] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const handleVisualize = () => {
    if (!selectedAlgorithm || !inputText.trim()) return
    setIsVisualizing(true)
    setAnimationKey((prev) => prev + 1)
  }

  const handleReset = () => {
    setIsVisualizing(false)
    setAnimationKey((prev) => prev + 1)
  }

  const renderAlgorithmComponent = () => {
    const props = {
      inputText,
      isVisualizing,
      animationKey,
      onComplete: () => setIsVisualizing(false),
    }

    switch (selectedAlgorithm) {
      case "caesar":
        return <CaesarCipher {...props} />
      case "xor":
        return <XORCipher {...props} />
      case "vigenere":
        return <VigenereCipher {...props} />
      case "railfence":
        return <RailFenceCipher {...props} />
      case "base64":
        return <Base64Encoding {...props} />
      case "diffie":
        return <DiffieHellman {...props} />
      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 text-white overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbFJ1bGU9ImV2ZW5vZGQiPgo8ZyBmaWxsPSIjOUM5MkFDIiBmaWxsT3BhY2l0eT0iMC4xIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPgo8L2c+CjwvZz4KPC9zdmc+')] animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4 h-full flex flex-col">
        {/* Compact Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Lock className="w-6 h-6 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crypto-Viz
            </h1>
          </div>
          <p className="text-slate-300 text-sm">Interactive Cryptography Visualization</p>
        </motion.div>

        {/* Compact Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-3 mb-4"
        >
          <div className="flex-1">
            <Label htmlFor="algorithm" className="text-xs font-medium text-slate-300 mb-1 block">
              Algorithm
            </Label>
            <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
              <SelectTrigger className="h-9 bg-slate-800/50 border-slate-700 text-white backdrop-blur-sm text-sm">
                <SelectValue placeholder="Choose algorithm" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {algorithms.map((algo) => (
                  <SelectItem key={algo.id} value={algo.id} className="text-white hover:bg-slate-700">
                    <div>
                      <div className="font-medium text-sm">{algo.name}</div>
                      <div className="text-xs text-slate-400">{algo.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="input" className="text-xs font-medium text-slate-300 mb-1 block">
              Input Text
            </Label>
            <Input
              id="input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter message..."
              className="h-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 backdrop-blur-sm text-sm"
            />
          </div>

          <div className="flex gap-2 items-end">
            <Button
              onClick={handleVisualize}
              disabled={!selectedAlgorithm || !inputText.trim() || isVisualizing}
              className="h-9 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 text-sm"
            >
              <Play className="w-3 h-3 mr-1" />
              Visualize
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-9 w-9 p-0 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </motion.div>

        {/* Visualization Area - Takes remaining space */}
        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            {selectedAlgorithm && (
              <motion.div
                key={selectedAlgorithm}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card className="h-full bg-slate-800/30 border-slate-700 backdrop-blur-sm p-4 overflow-auto">
                  {renderAlgorithmComponent()}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedAlgorithm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center text-slate-400">
                <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">Select an algorithm to begin</p>
                <p className="text-sm mt-1">Choose from classical cryptographic methods above</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
