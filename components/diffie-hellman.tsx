"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DiffieHellmanProps {
  inputText: string
  isVisualizing: boolean
  animationKey: number
  onComplete: () => void
}

export default function DiffieHellman({ inputText, isVisualizing, animationKey, onComplete }: DiffieHellmanProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [publicValues, setPublicValues] = useState({ p: 23, g: 5 })
  const [privateKeys, setPrivateKeys] = useState({ alice: 6, bob: 15 })
  const [publicKeys, setPublicKeys] = useState({ alice: 0, bob: 0 })
  const [sharedSecrets, setSharedSecrets] = useState({ alice: 0, bob: 0 })

  const modPow = (base: number, exp: number, mod: number) => {
    let result = 1
    base = base % mod
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod
      }
      exp = Math.floor(exp / 2)
      base = (base * base) % mod
    }
    return result
  }

  useEffect(() => {
    if (isVisualizing) {
      setCurrentStep(0)

      const animate = async () => {
        // Step 1: Show public parameters
        setCurrentStep(1)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Step 2: Generate public keys
        setCurrentStep(2)
        const alicePublic = modPow(publicValues.g, privateKeys.alice, publicValues.p)
        const bobPublic = modPow(publicValues.g, privateKeys.bob, publicValues.p)
        setPublicKeys({ alice: alicePublic, bob: bobPublic })
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Step 3: Exchange public keys
        setCurrentStep(3)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Step 4: Calculate shared secrets
        setCurrentStep(4)
        const aliceShared = modPow(bobPublic, privateKeys.alice, publicValues.p)
        const bobShared = modPow(alicePublic, privateKeys.bob, publicValues.p)
        setSharedSecrets({ alice: aliceShared, bob: bobShared })
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setCurrentStep(5)
        setTimeout(onComplete, 1000)
      }

      animate()
    }
  }, [isVisualizing, animationKey, onComplete])

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">Diffie-Hellman Key Exchange</h3>
        <p className="text-slate-300">Secure key exchange over an insecure channel</p>
      </div>

      <div className="flex justify-between items-start h-full">
        {/* Alice */}
        <div className="flex-1 text-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              A
            </div>
            <h4 className="text-lg font-semibold text-pink-400">Alice</h4>
          </motion.div>

          <div className="space-y-4">
            {/* Alice's private key */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStep >= 1 ? 1 : 0.3 }}
              className="bg-pink-500/20 border border-pink-500/50 rounded-lg p-2"
            >
              <div className="text-sm text-pink-300 mb-1">Private Key (secret)</div>
              <div className="text-2xl font-mono text-white">a = {privateKeys.alice}</div>
            </motion.div>

            {/* Alice's public key calculation */}
            <AnimatePresence>
              {currentStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-2"
                >
                  <div className="text-sm text-blue-300 mb-1">Public Key</div>
                  <div className="text-lg font-mono text-white">
                    A = g<sup>a</sup> mod p
                  </div>
                  <div className="text-lg font-mono text-white">
                    A = {publicValues.g}
                    <sup>{privateKeys.alice}</sup> mod {publicValues.p} = {publicKeys.alice}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Alice's shared secret */}
            <AnimatePresence>
              {currentStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/50 rounded-lg p-2"
                >
                  <div className="text-sm text-green-300 mb-1">Shared Secret</div>
                  <div className="text-lg font-mono text-white">
                    s = B<sup>a</sup> mod p
                  </div>
                  <div className="text-lg font-mono text-white">
                    s = {publicKeys.bob}
                    <sup>{privateKeys.alice}</sup> mod {publicValues.p} = {sharedSecrets.alice}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Middle - Public Parameters and Exchange */}
        <div className="flex-1 text-center px-8">
          {/* Public Parameters */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: currentStep >= 1 ? 1 : 0.3, scale: 1 }}
            className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4"
          >
            <h4 className="text-lg font-semibold text-yellow-400 mb-2">Public Parameters</h4>
            <div className="space-y-1">
              <div className="text-lg font-mono text-white">p = {publicValues.p} (prime)</div>
              <div className="text-lg font-mono text-white">g = {publicValues.g} (generator)</div>
            </div>
          </motion.div>

          {/* Key Exchange Animation */}
          <div className="relative h-24 mb-4">
            <AnimatePresence>
              {currentStep >= 3 && (
                <>
                  {/* Alice to Bob */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute top-4 left-0 right-0"
                  >
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-2 mx-auto w-fit">
                      <div className="text-sm text-blue-300">A = {publicKeys.alice}</div>
                    </div>
                    <motion.div
                      className="text-center mt-2"
                      animate={{ x: [0, 50, 0] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <div className="text-2xl">→</div>
                    </motion.div>
                  </motion.div>

                  {/* Bob to Alice */}
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute bottom-4 left-0 right-0"
                  >
                    <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-2 mx-auto w-fit">
                      <div className="text-sm text-purple-300">B = {publicKeys.bob}</div>
                    </div>
                    <motion.div
                      className="text-center mt-2"
                      animate={{ x: [0, -50, 0] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <div className="text-2xl">←</div>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Final Shared Secret */}
          <AnimatePresence>
            {currentStep >= 5 && sharedSecrets.alice === sharedSecrets.bob && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg p-3"
              >
                <h4 className="text-xl font-semibold text-green-400 mb-1">🎉 Shared Secret Established!</h4>
                <div className="text-3xl font-mono text-white">{sharedSecrets.alice}</div>
                <div className="text-sm text-slate-300 mt-1">Both parties now have the same secret key</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bob */}
        <div className="flex-1 text-center">
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              B
            </div>
            <h4 className="text-lg font-semibold text-blue-400">Bob</h4>
          </motion.div>

          <div className="space-y-4">
            {/* Bob's private key */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: currentStep >= 1 ? 1 : 0.3 }}
              className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-2"
            >
              <div className="text-sm text-blue-300 mb-1">Private Key (secret)</div>
              <div className="text-2xl font-mono text-white">b = {privateKeys.bob}</div>
            </motion.div>

            {/* Bob's public key calculation */}
            <AnimatePresence>
              {currentStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-2"
                >
                  <div className="text-sm text-purple-300 mb-1">Public Key</div>
                  <div className="text-lg font-mono text-white">
                    B = g<sup>b</sup> mod p
                  </div>
                  <div className="text-lg font-mono text-white">
                    B = {publicValues.g}
                    <sup>{privateKeys.bob}</sup> mod {publicValues.p} = {publicKeys.bob}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bob's shared secret */}
            <AnimatePresence>
              {currentStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/50 rounded-lg p-2"
                >
                  <div className="text-sm text-green-300 mb-1">Shared Secret</div>
                  <div className="text-lg font-mono text-white">
                    s = A<sup>b</sup> mod p
                  </div>
                  <div className="text-lg font-mono text-white">
                    s = {publicKeys.alice}
                    <sup>{privateKeys.bob}</sup> mod {publicValues.p} = {sharedSecrets.bob}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
