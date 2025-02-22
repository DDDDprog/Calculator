"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [currentValue, setCurrentValue] = useState("")
  const [operator, setOperator] = useState("")
  const [previousValue, setPreviousValue] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      if (/[0-9]/.test(key)) {
        handleNumberClick(key)
      } else if (["+", "-", "*", "/"].includes(key)) {
        handleOperatorClick(key)
      } else if (key === "Enter") {
        handleEqualsClick()
      } else if (key === "Escape") {
        handleClear()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleNumberClick = (num: string) => {
    if (display === "0" || operator) {
      setDisplay(num)
      setCurrentValue(num)
    } else {
      setDisplay(display + num)
      setCurrentValue(currentValue + num)
    }
  }

  const handleOperatorClick = (op: string) => {
    if (previousValue && currentValue) {
      handleEqualsClick()
    }
    setOperator(op)
    setPreviousValue(currentValue)
    setCurrentValue("")
  }

  const handleEqualsClick = () => {
    if (!previousValue || !currentValue) return

    let result
    try {
      switch (operator) {
        case "+":
          result = Number.parseFloat(previousValue) + Number.parseFloat(currentValue)
          break
        case "-":
          result = Number.parseFloat(previousValue) - Number.parseFloat(currentValue)
          break
        case "*":
          result = Number.parseFloat(previousValue) * Number.parseFloat(currentValue)
          break
        case "/":
          if (Number.parseFloat(currentValue) === 0) throw new Error("Division by zero")
          result = Number.parseFloat(previousValue) / Number.parseFloat(currentValue)
          break
        case "^":
          result = Math.pow(Number.parseFloat(previousValue), Number.parseFloat(currentValue))
          break
        default:
          return
      }

      const calculation = `${previousValue} ${operator} ${currentValue} = ${result}`
      setHistory((prev) => [calculation, ...prev.slice(0, 4)])
      setDisplay(result.toString())
      setCurrentValue(result.toString())
      setPreviousValue("")
      setOperator("")
    } catch (error) {
      setDisplay("Error")
      setCurrentValue("")
      setPreviousValue("")
      setOperator("")
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setCurrentValue("")
    setPreviousValue("")
    setOperator("")
  }

  const handleSpecialOperation = (operation: string) => {
    if (!currentValue) return

    let result
    switch (operation) {
      case "sqrt":
        result = Math.sqrt(Number.parseFloat(currentValue))
        break
      case "%":
        result = Number.parseFloat(currentValue) / 100
        break
      case "+/-":
        result = Number.parseFloat(currentValue) * -1
        break
    }

    const calculation = `${operation}(${currentValue}) = ${result}`
    setHistory((prev) => [calculation, ...prev.slice(0, 4)])
    setDisplay(result.toString())
    setCurrentValue(result.toString())
  }

  return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      <Card className="w-full max-w-md dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-center dark:text-white">Pro Calculator</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} className="dark:text-white">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            <motion.div
              key={display}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Input className="text-right text-2xl mb-4 dark:bg-gray-700 dark:text-white" value={display} readOnly />
            </motion.div>
          </AnimatePresence>
          <div className="grid grid-cols-4 gap-2">
            {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map((btn) => (
              <motion.div key={btn} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    if (btn === "=") handleEqualsClick()
                    else if (["+", "-", "*", "/"].includes(btn)) handleOperatorClick(btn)
                    else handleNumberClick(btn)
                  }}
                  variant={["=", "+", "-", "*", "/"].includes(btn) ? "default" : "secondary"}
                  className={`${btn === "=" ? "col-span-2" : ""} dark:bg-gray-700 dark:text-white`}
                >
                  {btn}
                </Button>
              </motion.div>
            ))}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleSpecialOperation("sqrt")}
                variant="secondary"
                className="dark:bg-gray-700 dark:text-white"
              >
                √
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleSpecialOperation("%")}
                variant="secondary"
                className="dark:bg-gray-700 dark:text-white"
              >
                %
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleOperatorClick("^")}
                variant="secondary"
                className="dark:bg-gray-700 dark:text-white"
              >
                x^y
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleSpecialOperation("+/-")}
                variant="secondary"
                className="dark:bg-gray-700 dark:text-white"
              >
                +/-
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button onClick={handleClear} variant="destructive" className="col-span-2">
                Clear
              </Button>
            </motion.div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">History</h3>
            <ScrollArea className="h-32 rounded-md border dark:border-gray-700">
              {history.map((item, index) => (
                <div key={index} className="p-2 text-sm dark:text-gray-300">
                  {item}
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

