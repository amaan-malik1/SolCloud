import React, { useEffect, useState } from 'react'

function TypingText({ words }: { words: string[] }) {
    const [wi, setWi] = useState(0)
    const [text, setText] = useState('')
    const [deleting, setDeleting] = useState(false)
    const [waiting, setWaiting] = useState(false)

    useEffect(() => {
        if (waiting) return
        const full = words[wi]
        const timeout = setTimeout(() => {
            if (!deleting) {
                if (text.length < full.length) {
                    setText(full.slice(0, text.length + 1))
                } else {
                    setWaiting(true)
                    setTimeout(() => { setDeleting(true); setWaiting(false) }, 1800)
                }
            } else {
                if (text.length > 0) {
                    setText(text.slice(0, -1))
                } else {
                    setDeleting(false)
                    setWi((wi + 1) % words.length)
                }
            }
        }, deleting ? 40 : 80)
        return () => clearTimeout(timeout)
    }, [text, deleting, wi, words, waiting])

    return (
        <span className="bg-gradient-to-b from-green-700 to-orange-300 text-clip text-transparent bg-clip-text bg-transparent">
            {text}
            <span className="animate-pulse" style={{ borderRight: '2px solid gray', marginLeft: 2 }}>&nbsp;</span>
        </span>
    )
}

export default TypingText